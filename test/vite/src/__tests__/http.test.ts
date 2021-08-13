describe('http run', () => {
  it('works for vite', async () => {
    await page.goto('http://localhost:3000')
    await wait(1000)

    await expect(page.$eval('#app', (el) => el.textContent)).resolves.toMatchSnapshot()
  })

  it('works for vite build', async () => {
    await page.goto('http://localhost:4000')
    await wait(1000)

    await expect(page.$eval('#app', (el) => el.textContent)).resolves.toMatchSnapshot()
  })
})

async function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
