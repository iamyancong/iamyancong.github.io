// 构建后处理：生成 sitemap.xml，并把 /404/ 复制为 GitHub Pages 识别的 404.html
import { copyFile, readdir, stat, writeFile } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'

const DIST = 'dist'
const SITE = 'https://iamyancong.github.io'

async function walk(dir) {
  const out = []
  for (const name of await readdir(dir)) {
    const full = join(dir, name)
    if ((await stat(full)).isDirectory()) out.push(...(await walk(full)))
    else if (name === 'index.html') out.push(full)
  }
  return out
}

const pages = (await walk(DIST))
  .map((file) => '/' + relative(DIST, file).split(sep).slice(0, -1).join('/'))
  .map((p) => (p === '/' ? '/' : `${p}/`))
  .filter((p) => p !== '/404/')
  .sort()

const today = new Date().toISOString().slice(0, 10)
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${SITE}${p}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`
await writeFile(join(DIST, 'sitemap.xml'), xml)
await copyFile(join(DIST, '404', 'index.html'), join(DIST, '404.html'))
console.log(`[postbuild] sitemap: ${pages.length} 个页面；404.html 已生成`)
