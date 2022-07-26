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

  './examples/main.js': function (require, module) {
    "use strict";

    var _foo = require("./foo.js");

    var _foo2 = _interopRequireDefault(_foo);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    console.log('main');
    (0, _foo2.default)();
  },
  'C:\Users\Administrator\Desktop\自学前端\webpack\simple-webpack\examples\foo.js': function (require, module) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.foo = foo;

    function foo() {
      console.log('foo');
    }
  }
})