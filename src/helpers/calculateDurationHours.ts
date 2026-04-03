import { parse, differenceInMinutes, addDays } from 'date-fns'

export const calculateDurationHours = (
  startTime: string,
  endTime: string
): number => {

  const baseDate = new Date()

  const start = parse(startTime, 'HH:mm', baseDate)
  let end = parse(endTime, 'HH:mm', baseDate)

  // ✅ handle cross midnight
  if (end <= start) {
    end = addDays(end, 1)
  }

  const minutes = differenceInMinutes(end, start)

  return minutes / 60
}