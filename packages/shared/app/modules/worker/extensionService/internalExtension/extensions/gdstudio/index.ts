import type { ExtensionContext, ExtensionHostContext } from '../type'
import { resourceActions } from './resourceAction'
import { initHostContext } from './shared'

export const pkg: AnyListen.Extension.Manifest = {
  id: 'internal.gdstudio',
  name: 'GDStudio',
  version: '0.1.0',
  contributes: {
    resource: [
      {
        id: 'gd-netease',
        name: '网易云音乐',
        resource: ['musicSearch', 'musicUrl', 'musicPic', 'musicLyric'],
      },
      {
        id: 'gd-kuwo',
        name: '酷我音乐',
        resource: ['musicSearch', 'musicUrl', 'musicPic', 'musicLyric'],
      },
      {
        id: 'gd-tencent',
        name: 'QQ音乐',
        resource: ['musicSearch', 'musicUrl', 'musicPic', 'musicLyric'],
      },
      {
        id: 'gd-bilibili',
        name: '哔哩哔哩',
        resource: ['musicSearch', 'musicUrl', 'musicPic', 'musicLyric'],
      },
      {
        id: 'gd-tidal',
        name: 'Tidal',
        resource: ['musicSearch', 'musicUrl', 'musicPic', 'musicLyric'],
      },
      {
        id: 'gd-qobuz',
        name: 'Qobuz',
        resource: ['musicSearch', 'musicUrl', 'musicPic', 'musicLyric'],
      },
      {
        id: 'gd-joox',
        name: 'Joox',
        resource: ['musicSearch', 'musicUrl', 'musicPic', 'musicLyric'],
      },
      {
        id: 'gd-apple',
        name: 'Apple Music',
        resource: ['musicSearch', 'musicUrl', 'musicPic', 'musicLyric'],
      },
      {
        id: 'gd-ytmusic',
        name: 'YouTube Music',
        resource: ['musicSearch', 'musicUrl', 'musicPic', 'musicLyric'],
      },
      {
        id: 'gd-spotify',
        name: 'Spotify',
        resource: ['musicSearch', 'musicUrl', 'musicPic', 'musicLyric'],
      },
    ],
  },
  main: '',
  publicKey: '',
}

type RS = AnyListen.IPCExtension.ResourceAction
export const setup = async (
  _extension: AnyListen.Extension.Extension,
  _hostContext: ExtensionHostContext
): Promise<ExtensionContext> => {
  initHostContext(_hostContext)
  return {
    resourceAction: async <T extends keyof RS>(
      action: T,
      params: Parameters<RS[T]>[0]
    ): Promise<Awaited<ReturnType<RS[T]>>> => {
      if (!(action in resourceActions)) throw new Error(`action ${String(action)} not found`)
      // @ts-expect-error
      return resourceActions[action](params) as Awaited<ReturnType<RS[T]>>
    },
  }
}
