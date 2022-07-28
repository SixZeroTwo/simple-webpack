export function nodejsonLoader(source) {
  return `export default ${JSON.stringify(source)}`
}