const DEV = process.env.DEV ?? false
const PORT = DEV ? '3000' : '4000'

describe('http run', () => {
  it('works for vite build', async () => {
    await page.goto(`http://localhost:${PORT}`)
    await wait(1000)

    await expect(page.$eval('#app', (el) => el.textContent)).resolves.toMatchSnapshot()
  })
})

async function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
