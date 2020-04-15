import { Context } from '../../context'
import manager from '../manager'

type HistoryAction = 'CREATED' | 'UPDATED' | 'DELETED'

export const pushHistory = (
  ctx: Context,
  {
    action,
    model,
    meta,
    nodeId
  }: { action: HistoryAction; model: string; meta: any; nodeId: string }
) => {
  return ctx.prisma.historyAction.create({
    data: {
      action,
      model,
      meta: JSON.stringify(meta),
      node: { connect: { id: nodeId } },
      user: { connect: { id: ctx.request.user.id } }
    }
  })
}

/* Register hooks */

manager.register(
  'question-created',
  (ctx, { nodeId, meta }) =>
    pushHistory(ctx, {
      action: 'CREATED',
      model: 'Question',
      meta,
      nodeId
    }),
  true
)

manager.register(
  'question-updated',
  (ctx, { nodeId, meta }) =>
    pushHistory(ctx, {
      action: 'UPDATED',
      model: 'Question',
      meta,
      nodeId
    }),
  true
)

manager.register(
  'answer-created',
  (ctx, { nodeId, meta }) =>
    pushHistory(ctx, {
      action: 'CREATED',
      model: 'Answer',
      meta,
      nodeId
    }),
  true
)

manager.register(
  'answer-updated',
  (ctx, { nodeId, meta }) =>
    pushHistory(ctx, {
      action: 'UPDATED',
      model: 'Answer',
      meta,
      nodeId
    }),
  true
)

manager.register(
  'flag-added',
  (ctx, { nodeId, meta }) =>
    pushHistory(ctx, {
      action: 'CREATED',
      model: 'Flag',
      meta,
      nodeId
    }),
  true
)

manager.register(
  'flag-removed',
  (ctx, { nodeId, meta }) =>
    pushHistory(ctx, {
      action: 'DELETED',
      model: 'Flag',
      meta,
      nodeId
    }),
  true
)
