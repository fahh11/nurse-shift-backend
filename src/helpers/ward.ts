import crypto from 'crypto'

const JOIN_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
// ตัด 0 O I 1 ออกกันสับสน

export const generateJoinCode = (length = 8): string => {
  const bytes = crypto.randomBytes(length)
  let result = ''

  for (let i = 0; i < length; i++) {
    result += JOIN_CODE_CHARS[bytes[i] % JOIN_CODE_CHARS.length]
  }

  return result
}
