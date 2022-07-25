import fs from 'fs'
import parser from '@babel/parser'
import traverse from '@babel/traverse'
function createAsset() {
  //读取文件内容，解码成字符串
  const source = fs.readFileSync('./examples/main.js', {
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
    source,
    deps
  }
}

const asset = createAsset()
console.log(asset);