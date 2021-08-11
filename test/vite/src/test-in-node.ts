import context from '../../server/src/context'
import context1 from '../../server1/src/context'
import context2 from '../../server2/src/context'
import { getData } from '../../vue/src/model'

context.set({ server: 'local' })
context1.set({ server: 'local1' })
context2.set({ server: 'local2' })

getData().then(console.info).catch(console.error)
