import puppeteer from 'puppeteer'

async function takeScreenshot() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1920, height: 1080 })

  // 访问本地开发服务器
  await page.goto('http://localhost:3000/meteo-radar/', {
    waitUntil: 'networkidle0',
    timeout: 60000,
  })

  // 等待页面加载完成
  await new Promise((r) => setTimeout(r, 3000))

  // 截取总览页面
  await page.screenshot({
    path: 'docs/screenshot-overview.png',
    fullPage: false,
  })

  // 导航到地图页面
  await page.click('button.nav-btn:nth-child(2)')
  await new Promise((r) => setTimeout(r, 3000))

  await page.screenshot({
    path: 'docs/screenshot-map.png',
    fullPage: false,
  })

  // 导航到预警页面
  await page.click('button.nav-btn:nth-child(3)')
  await new Promise((r) => setTimeout(r, 3000))

  await page.screenshot({
    path: 'docs/screenshot-warning.png',
    fullPage: false,
  })

  await browser.close()
  console.log('Screenshots taken successfully!')
}

takeScreenshot().catch(console.error)
