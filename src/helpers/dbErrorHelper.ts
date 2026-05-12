export const isUniqueConstraintError = (error: any): boolean => {
  return error?.code === '23505' // PostgreSQL
}