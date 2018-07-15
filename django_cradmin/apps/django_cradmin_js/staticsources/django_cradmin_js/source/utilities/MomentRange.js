import moment from 'moment'

export default class MomentRange {
  static defaultForDatetimeSelect () {
    return new MomentRange(
      moment({
        year: 2010,
        month: 3,
        day: 0
      }),
      moment({
        year: 2020,
        month: 0,
        day: 0
      }).subtract(1, 'second')
    )
  }

  constructor (start = null, end = null) {
    this.start = start || moment()
    this.end = end || moment()
    if (!this.end.isAfter(this.start)) {
      throw new Error('The end of a MomentRange must be after the start.')
    }
  }

  format (...args) {
    return `${this.start.format(...args)} - ${this.end.format(...args)}`
  }

  isWithin (momentObject) {
    return this.start.isSameOrBefore(momentObject) && this.end.isSameOrAfter(momentObject)
  }
}
