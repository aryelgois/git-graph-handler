export default function log(message: unknown) {
  const now = new Date().toISOString()
  console.log(`\x1B[90m[${now}]\x1B[0m`, message)
}
