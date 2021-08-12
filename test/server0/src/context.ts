import { ContextStore } from '../../../dist/context'
import type { Session } from '../../shared/dist/session'

const context = new ContextStore<{ server: string; session: Session }>()

export default context
