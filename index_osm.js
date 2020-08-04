const config = require('config')
const Parser = require('json-text-sequence').parser
const { spawn } = require('child_process')

const minzoom = config.get('minzoom')
const maxzoom = config.get('maxzoom')
const projection = config.get('projection')
const srcs = config.get('srcs')
const ogr2ogrPath = config.get('ogr2ogrPath')
const tippecanoePath = config.get('tippecanoePath')
const dstDir = config.get('dstDir')
const host = config.get('host')
const port = config.get('port')
const dbname = config.get('dbname')
const user = config.get('user')
const password = config.get('password')

const tippecanoe = spawn(tippecanoePath, [
  `--output-to-directory=${dstDir}`,
  `--no-tile-compression`,
  `--no-feature-limit`,
  `--no-tile-size-limit`,
  `--drop-rate=1`,
  '--force',
  `--minimum-zoom=${minzoom}`,
  `--maximum-zoom=${maxzoom}`,
], { stdio: ['pipe', 'inherit', 'inherit'] })
const downstream = tippecanoe.stdin

const preprocessProperties = (f) => {
 if (f.properties['element']) {
  delete f.properties['element']
    }
  return f
}

let nOpenFiles = 0
for (const src of srcs) {
  nOpenFiles++
  const parser = new Parser()
    .on('data', f => {
      f = preprocessProperties(f)
      f.tippecanoe = {
        layer: src.layer,
        minzoom: src.minzoom,
        maxzoom: src.maxzoom
      }
      downstream.write(`\x1e${JSON.stringify(f)}\n`)
    })
    .on('finish', () => {
      nOpenFiles--
      if (nOpenFiles === 0) {
        downstream.end()
      }
    })
  const ogr2ogr = spawn(ogr2ogrPath, [
    '-f', 'GeoJSONSeq',
    '-lco', 'RS=YES',
    '/vsistdout/',
    `PG:host=${host} port=${port} dbname=${dbname} user=${user} password=${password}`,
    '-sql',    
    src.sql
  ])
  ogr2ogr.stdout.pipe(parser)
}
