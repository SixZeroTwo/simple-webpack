(function (fileMapFunction) {
  function require(id) {
    const fn = fileMapFunction[id][0]
    const map = fileMapFunction[id][1]
    const module = {
      exports: {}
    }

    const localRequire = function (filePath) {
      const localId = map[filePath]
      return require(localId)
    }
    fn(localRequire, module)
    return module.exports
  }
  //入口
  require(1)
})({
  1: [function mainjs(require, module) {
    const { foo } = require('./foo.js')

    console.log('main');
    foo()
  }, {
    './foo.js': 2
  }],
  2: [function foojs(require, module) {
    function foo() {
      console.log('foo');
    }
    module.exports = {
      foo
    }
  }, {}],
})