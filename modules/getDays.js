'use strict'

const momentFromString = require('@datatypes/moment').default
const add = require('@datatypes/moment').add
const subtract = require('@datatypes/moment').subtract
const Duration = require('@datatypes/duration').default

module.exports = (options) => {

  options = options || {}
  const daysBefore = options.daysBefore != null ? options.daysBefore : 10
  const daysAhead = options.daysAhead != null ? options.daysAhead : 50

  const now = new Date()
  const nowMoment = momentFromString(now.toISOString())
  const startMoment = subtract(nowMoment, new Duration(`P${daysBefore}D`))
  const endMoment = add(nowMoment, new Duration(`P${daysAhead}D`))
  const duration = endMoment
    .maximumOffset(startMoment)
    .unsafeNormalize()
  const days = []

  for (let dayIndex = 0; dayIndex < duration.days; dayIndex++) {
    const date = add(startMoment, new Duration(`P${dayIndex}D`))
    const day = {
      date: date,
      events: [],
    }

    if (
      new Date()
        .toISOString()
        .substr(0, 10) ===
      date.string.substr(0, 10)
    ) {
      day.today = true
    }

    days.push(day)
  }

  days.startMoment = startMoment
  days.endMoment = endMoment

  return days
}
