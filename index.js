import fs from 'fs'
import parser from '@babel/parser'
import traverse from '@babel/traverse'
import path from 'path'
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
  return {
    filePath,
    source,
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