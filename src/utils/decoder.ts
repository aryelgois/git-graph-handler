export function decodeBase64(s: string) {
  const buff = Buffer.from(s, 'base64')
  return buff.toString('utf-8')
}
