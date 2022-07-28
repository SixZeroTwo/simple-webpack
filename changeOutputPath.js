export class changeOutputPath {
  constructor(output) {
    this.output = output
  }
  apply(hooks) {
    hooks.emitOutputPath.tap('changeOutputPath', (compiler) => {
      compiler.changeOutputPath(this.output)
    })
  }
}