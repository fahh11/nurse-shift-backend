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

export function buildShiftDateTime(
    date: Date,
    start: string,
    end: string
) {
    const [sh, sm] = start.split(':').map(Number)
    const [eh, em] = end.split(':').map(Number)

    const startAt = new Date(date)
    startAt.setHours(sh, sm, 0, 0)

    const endAt = new Date(date)
    endAt.setHours(eh, em, 0, 0)

    // 🔥 cross midnight fix
    if (endAt <= startAt) {
        endAt.setDate(endAt.getDate() + 1)
    }

    return { startAt, endAt }
}