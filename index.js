import fs from 'fs'
import parser from '@babel/parser'
import traverse from '@babel/traverse'
import path from 'path'
import ejs from 'ejs'
import { transformFromAst } from 'babel-core'
import webPackConfig from './webpack.config.js'
import { SyncHook } from 'tapable'
import webpackConfig from './webpack.config.js'
let id = 1


const hooks = {
  emitOutputPath: new SyncHook(['compiler']),
}
//初始化插件
initPlugins()
function initPlugins() {
  const plugins = webpackConfig.plugins
  for (let plugin of plugins) {
    plugin.apply(hooks)
  }
}
function createAsset(filePath) {
  //读取文件内容，解码成字符串
  let source = fs.readFileSync(filePath, {
    encoding: 'utf-8'
  })

  //使用loader对匹配的文件进行转换
  const rules = webPackConfig.module.rules
  rules.forEach(({ test, use }) => {
    if (test.test(filePath)) {
      if (Array.isArray(use)) {
        use.reverse().forEach((loader) => {
          source = loader(source)
        })
      }
      else if (typeof use == 'function') {
        source = use(source)
      }
    }
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
    deps,
    id: id++,
    mapping: {}
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
      asset.mapping[relativePath] = child.id
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
      id: asset.id,
      mapping: asset.mapping,
    }
  })
  const code = ejs.render(template, { data })
  let outputPath = './dist/bundle.js'
  const compiler = {
    changeOutputPath(output) {
      outputPath = output
    }
  }
  hooks.emitOutputPath.call(compiler)
  fs.writeFileSync(outputPath, code)
}

build(graph)