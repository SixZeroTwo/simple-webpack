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
fn(localRequire, module,module.exports)
return module.exports
}
//入口
require(1)
})({

  1: [function (require, module,exports) {
    "use strict";

var _foo = require("./foo.js");

console.log('main');
(0, _foo.foo)();
      },
      {"./foo.js":2}
        ],
        
  2: [function (require, module,exports) {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.foo = foo;

function foo() {
  console.log('foo');
}
      },
      {}
        ],
        
          });