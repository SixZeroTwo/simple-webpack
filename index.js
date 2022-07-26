import fs from 'fs'
import parser from '@babel/parser'
import traverse from '@babel/traverse'
import path from 'path'
import ejs from 'ejs'
import { transformFromAst } from 'babel-core'
function createAsset(filePath) {
  //读取文件内容，解码成字符串
  const source = fs.readFileSync(filePath, {
    encoding: 'utf-8'
  })
  //将文件内容转换成抽象语法树
  const ast = parser.parse(source, { sourceType: 'module' })
  const deps = []
  traverse.default(ast, {
    ImportDeclaration(path) {
      deps.push(path.node.source.value)
    }
  })

  const { code } = transformFromAst(ast, null, { presets: ["env"] })
  return {
    filePath,
    code,
    deps
  }
}

//创建图
function createGraph() {
  const mainAsset = createAsset('./examples/main.js')
  const queue = [mainAsset]
  for (let asset of queue) {
    const relativePaths = asset.deps
    for (let relativePath of relativePaths) {
      const child = createAsset(path.resolve('./examples/', relativePath))
      queue.push(child)
    }
  }

  return queue
}

const graph = createGraph()

function build(graph) {
  const template = fs.readFileSync('bundle.ejs', { encoding: 'utf-8' })
  const data = graph.map(asset => {
    return {
      filePath: asset.filePath,
      code: asset.code,
    }
  })
  const code = ejs.render(template, { data })
  fs.writeFileSync('./dist/bundle.js', code)
}

build(graph)