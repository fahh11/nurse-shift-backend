import { parse, differenceInMinutes } from 'date-fns'

export const calculateDurationHours = (
  startTime: string,
  endTime: string
): number => {

  const start = parse(startTime, 'HH:mm', new Date())
  const end = parse(endTime, 'HH:mm', new Date())

  const minutes = differenceInMinutes(end, start)

  if (minutes < 0) {
    throw new Error('Invalid shift time')
  }

  return minutes / 60
}