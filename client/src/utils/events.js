function Event () {
  this.events = []
}

Event.prototype.listen = function (key, fn) {
  if (!this.events[key]) {
    this.events[key] = []
  }
  this.events[key].push(fn)
}

Event.prototype.trigger = function () {
  let key = Array.prototype.shift.call(arguments)
  let fns = this.events[key]

  if (!fns || fns.length === 0) {
    return false
  }

  /*eslint-disable */
  for (let i = 0, fn; fn = fns[i++]; ) {
    fn.apply(this, arguments)
  }
}

export default Event
