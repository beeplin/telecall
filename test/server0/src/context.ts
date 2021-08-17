import type { Session } from '../../../dist'
import { ContextStore } from '../../../dist'

const context = new ContextStore<{ server: string; session: Session }>()

export default context
