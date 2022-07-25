(function (fileMapFunction) {
  function require(filePath) {
    const fn = fileMapFunction[filePath]
    const module = {
      exports: {}
    }
    fn(require, module)
    return module.exports
  }
  //入口
  require('./main.js')
})({
  './foo.js': function foojs(require, module) {
    function foo() {
      console.log('foo');
    }
    module.exports = {
      foo
    }
  },
  './main.js': function mainjs(require, module) {
    const { foo } = require('./foo.js')

    console.log('main');
    foo()
  }
})