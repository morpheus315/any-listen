import type { ExtensionHostContext } from '../type'

export const hostContext = {} as ExtensionHostContext

export const initHostContext = (_hostContext: ExtensionHostContext) => {
  Object.assign(hostContext, _hostContext)
}
