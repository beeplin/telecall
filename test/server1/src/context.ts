import { Context } from '../../../src/context'

const context = new Context<{ server: string }>()

export const getContext = context.get.bind(context)

export const setContext = context.set.bind(context)

export const runWithContext = context.run.bind(context)
