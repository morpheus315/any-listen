import type { ExtensionHostContext } from '../type'

const hostContext = {} as ExtensionHostContext

export const initHostContext = (_hostContext: ExtensionHostContext) => {
  Object.assign(hostContext, _hostContext)
}
