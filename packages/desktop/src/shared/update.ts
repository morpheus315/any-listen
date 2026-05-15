import { getLatestVersion } from '@any-listen/common/tools'

import { appEvent, appState } from '../app'
import { checkUpdate, downloadUpdate, initUpdate, restartUpdate } from './electronUpdate'
import { request } from './request'
import { compareVersions, sleep } from './utils'

interface EventTypes {
  checking_for_update: never
  update_available: AnyListen.UpdateInfo
  update_not_available: AnyListen.UpdateInfo
  download_progress: AnyListen.DownloadProgressInfo
  update_downloaded: never
  error: Error
  ignore_version: string | null
}

type Listener = (event: unknown) => void
class UpdateEvent {
  private readonly listeners: Map<keyof EventTypes, Listener[]>
  constructor() {
    this.listeners = new Map()
  }
  off<T extends keyof EventTypes>(eventName: T, listener: (event: EventTypes[T]) => void) {
    let targetListeners = this.listeners.get(eventName)
    if (!targetListeners) return
    const index = targetListeners.indexOf(listener as Listener)
    if (index < 0) return
    targetListeners.splice(index, 1)
  }
  on<T extends keyof EventTypes>(eventName: T, listener: (event: EventTypes[T]) => void) {
    let targetListeners = this.listeners.get(eventName)
    if (!targetListeners) this.listeners.set(eventName, (targetListeners = []))
    targetListeners.push(listener as Listener)
    return () => {
      this.off(eventName, listener as Listener)
    }
  }
  emit<T extends keyof EventTypes>(eventName: T, ...[event]: EventTypes[T] extends never ? [] : [event: EventTypes[T]]) {
    setImmediate(() => {
      let targetListeners = this.listeners.get(eventName)
      if (!targetListeners) return
      for (const listener of Array.from(targetListeners)) {
        listener(event)
      }
    })
  }
}

const owner = 'morpheus315'
const repo = 'any-listen'
const address = [
  [`https://raw.githubusercontent.com/${owner}/${repo}/main/packages/desktop/publish/version.json`, 'direct'],
  [`https://cdn.jsdelivr.net/gh/${owner}/${repo}/packages/desktop/publish/version.json`, 'direct'],
  [`https://fastly.jsdelivr.net/gh/${owner}/${repo}/packages/desktop/publish/version.json`, 'direct'],
  [`https://gcore.jsdelivr.net/gh/${owner}/${repo}/packages/desktop/publish/version.json`, 'direct'],
  // [`https://registry.npmjs.org/@${repo}/${repo}-desktop/latest`, 'npm'],
  // [`https://registry.npmmirror.com/@${repo}/${repo}-desktop/latest`, 'npm'],
  // ['http://cdn.stsky.cn/any-listen/desktop/version.json', 'direct'],
] as const

const getDirectInfo = async (url: string) => {
  console.log(`[update] fetching direct: ${url}`)
  return request<Partial<AnyListen.UpdateInfo>>(url).then(({ body }) => {
    if (body.version == null) throw new Error('version field missing')
    console.log(`[update] direct response: version=${body.version} time=${body.time}`)
    return body as AnyListen.UpdateInfo
  })
}

const getNpmPkgInfo = async (url: string) => {
  console.log(`[update] fetching npm: ${url}`)
  return request<{ versionInfo?: string }>(url).then(({ body }) => {
    if (!body.versionInfo) throw new Error('versionInfo missing')
    const info = JSON.parse(body.versionInfo) as Partial<AnyListen.UpdateInfo>
    if (info.version == null) throw new Error('version field missing')
    console.log(`[update] npm response: version=${info.version}`)
    return info as AnyListen.UpdateInfo
  })
}
export const getUpdateInfo = async (index = 0): Promise<AnyListen.UpdateInfo> => {
  const [url, source] = address[index]
  console.log(`[update] trying source ${index + 1}/${address.length}: ${source} ${url}`)
  let promise: Promise<AnyListen.UpdateInfo>
  switch (source) {
    case 'direct':
      promise = getDirectInfo(url)
      break
    case 'npm':
      promise = getNpmPkgInfo(url)
      break
  }

  return promise.catch(async (err: Error) => {
    console.log(`[update] source ${index + 1} failed: ${err.message}`)
    index++
    if (index >= address.length) {
      console.log(`[update] all ${address.length} sources exhausted`)
      throw err
    }
    return getUpdateInfo(index)
  })
}

export class Update extends UpdateEvent {
  private info: AnyListen.UpdateInfo | null = null
  initUpdate() {
    initUpdate(this)
    appEvent.on('updated_config', (keys, settings) => {
      if (keys.includes('common.allowPreRelease')) {
        void this.checkUpdateStatus(appState.appSetting['common.tryAutoUpdate'])
      }
    })
  }
  async checkUpdateStatus(isAutoUpdate: boolean) {
    if (!this.info) return false
    const allowPre = appState.appSetting['common.allowPreRelease']
    const latest = getLatestVersion(this.info, allowPre)
    const localVer = appState.version.version
    console.log(`[update] local=${localVer} remote=${latest.version} allowPreRelease=${allowPre} autoUpdate=${isAutoUpdate}`)
    if (compareVersions(localVer, latest.version) < 0) {
      console.log(`[update] update available: ${localVer} -> ${latest.version}`)
      await checkUpdate(appState.appSetting['common.allowPreRelease'])
        .then(() => {
          if (isAutoUpdate) {
            setImmediate(() => {
              void downloadUpdate()
            })
          }
        })
        .catch((error) => {
          setImmediate(() => {
            this.emit('error', error as Error)
          })
        })
      this.emit('update_available', this.info)
      return true
    }
    console.log(`[update] already up to date (${localVer} >= ${latest.version})`)
    this.emit('update_not_available', this.info)
    return false
  }
  async checkForUpdates(isAutoUpdate: boolean) {
    console.log(`[update] checkForUpdates start, autoUpdate=${isAutoUpdate}`)
    this.emit('checking_for_update')
    try {
      this.info = await getUpdateInfo()
    } catch (err) {
      console.log(`[update] checkForUpdates failed: ${(err as Error).message}`)
      this.emit('error', err as Error)
      return false
    }

    return this.checkUpdateStatus(isAutoUpdate)
  }
  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  async downloadUpdate() {
    await downloadUpdate()
  }
  async isUpdateAvailable() {
    return this.checkForUpdates(false)
  }
  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  async quitAndInstall() {
    await restartUpdate()
  }
}
export const update = new Update()

export const startCheckUpdateTimeout = async (): Promise<void> => {
  await update.checkForUpdates(appState.appSetting['common.tryAutoUpdate']).catch(() => {})
  await sleep(86400_000)
  return startCheckUpdateTimeout()
}
