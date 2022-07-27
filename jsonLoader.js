export function jsonLoader(source) {
  return `exports default ${JSON.stringify(source)}`
}