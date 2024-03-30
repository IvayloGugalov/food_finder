import moment from 'moment-timezone'

moment.tz.setDefault('UTC');

export function getStartAndEndDateOfCurrentWeek() {
  const today = getUtcNow()
  const currentDay = today.getDay() // 0 (Sunday) to 6 (Saturday)

  // Calculate the start date of the current week (Monday)
  const startDate = getUtcFromDate(today)
  const daysUntilMonday = currentDay === 0 ? 6 : currentDay - 1 // Calculate days from Sunday to Monday
  startDate.setDate(today.getDate() - daysUntilMonday)

  // Calculate the end date of the current week (Sunday)
  const endDate = getUtcFromDate(startDate)
  endDate.setDate(startDate.getDate() + 6) // Sunday is 6 days after Monday

  return { startDate, endDate }
}

export const getUtcNow = () => moment.utc().startOf('day').toDate()
export const getUtcFromDate = (date: Date) => moment.utc(date).toDate()
export const getUtcFromString = (date: string) => moment.utc(date).toDate()
