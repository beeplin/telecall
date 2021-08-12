import context0, { TestSession as Session0 } from '../../../server0/src/context'
import context1, { TestSession as Session1 } from '../../../server1/src/context'
import { run } from '../model'

describe('local run', () => {
  it('works', async () => {
    context0.set({ server: 'local0', session: new Session0() })
    context1.set({ server: 'local1', session: new Session1() })
    const res = await run()

    expect(res).toMatchSnapshot()
  })
})
