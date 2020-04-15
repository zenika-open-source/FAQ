import { Context } from '../context'

type Callback = (ctx: Context, data: any) => void
type Hook = {
  callback: Callback
  blocking: boolean
}

type HookType =
  | 'question-created'
  | 'question-updated'
  | 'answer-created'
  | 'answer-updated'
  | 'flag-added'
  | 'flag-removed'
  | 'configuration-updated'
  | 'configuration-tags-updated'

class HookManager {
  hooks: { [name in HookType]?: Hook[] } = {}

  register(names: HookType | HookType[], callback: Callback, blocking: boolean = false) {
    if (!Array.isArray(names)) {
      names = [names]
    }

    names.forEach(name => {
      if (!this.hooks[name]) {
        this.hooks[name] = []
      }

      // @ts-ignore
      this.hooks[name].push({ callback, blocking })
    })
  }

  async trigger(name: HookType, ctx: Context, data: any) {
    console.log(`Triggered ${this.hooks[name]?.length || 0} callbacks on hook "${name}"`)

    if (!this.hooks[name]) {
      return
    }

    // @ts-ignore
    for (let hook of this.hooks[name]) {
      if (hook.blocking) {
        await hook.callback(ctx, data)
      } else {
        hook.callback(ctx, data)
      }
    }
  }
}

const manager = new HookManager()

export default manager
