import fs from 'node:fs'
import path from 'node:path'

const tag = process.argv[2]
if (!tag) {
  console.error('Usage: npx tsx bump-version.ts <tag>')
  process.exit(1)
}
const version = tag.startsWith('v') ? tag.slice(1) : tag
console.log(`Bumping to version: ${version}`)

// Update packages/desktop/package.json
const pkgPath = path.join(__dirname, '../../desktop/package.json')
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
pkg.version = version
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
console.log(`Updated ${pkgPath} to ${version}`)

// Update packages/desktop/publish/version.json
const versionJsonPath = path.join(__dirname, '../../desktop/publish/version.json')
let versionJson: any = { version: '', desc: '', time: '', history: [], beta: [] }
if (fs.existsSync(versionJsonPath)) {
  versionJson = JSON.parse(fs.readFileSync(versionJsonPath, 'utf-8'))
}
// Move current version into history
if (versionJson.version) {
  const historyEntry = {
    version: versionJson.version,
    desc: versionJson.desc,
    time: versionJson.time,
  }
  versionJson.history = [historyEntry, ...(versionJson.history || [])]
}
versionJson.version = version
versionJson.time = new Date().toISOString()
fs.writeFileSync(versionJsonPath, JSON.stringify(versionJson))
console.log(`Updated ${versionJsonPath} to ${version}`)
