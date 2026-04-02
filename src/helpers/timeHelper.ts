export const toMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

export function combineDateTime(date: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number)

    const result = new Date(date)
    result.setHours(hours, minutes, 0, 0)

    return result
}