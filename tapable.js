import { SyncHook, AsyncParallelHook } from 'tapable'

class Car {
  constructor() {
    this.hooks = {
      //初始化钩子
      accelerate: new SyncHook(["newSpeed"]),
      brake: new SyncHook(),
      calculateRoutes: new AsyncParallelHook(["source", "target", "routesList"])
    };
  }
}

const car = new Car

//注册
car.hooks.accelerate.tap('test 1', (newSpeed) => {
  console.log('test 1-----------------------');
  console.log(newSpeed)
})
car.hooks.calculateRoutes.tapPromise('test 2', (source, target, routesList) => {
  return new Promise((onResolve, onReject) => {
    setTimeout(() => {
      onResolve()
    }, 100)
  }).then(() => {
    console.log('test 2-----------------------')
    console.log(source, target, routesList);
  })
})
//触发
car.hooks.accelerate.call('hello')
car.hooks.calculateRoutes.promise(1, 2, 3).then(() => {
  console.log('test2完成')
})
