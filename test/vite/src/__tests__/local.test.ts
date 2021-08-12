import { FakeSession } from '../../../../src/session'
import context0 from '../../../server0/src/context'
import context1 from '../../../server1/src/context'
import { run } from '../model'

describe('local run', () => {
  it('works', async () => {
    context0.set({ server: 'local0', session: new FakeSession() })
    context1.set({ server: 'local1', session: new FakeSession() })
    const res = await run()

    expect(res).toMatchSnapshot()
  })
})
