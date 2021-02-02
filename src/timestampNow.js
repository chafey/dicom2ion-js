const ion = require("ion-js");

const timestampNow = () => {
    const now = new Date()
    const seconds = new ion.Decimal("" + (now.getSeconds() + (now.getMilliseconds() / 1000)))
    return new ion.Timestamp(
        now.getTimezoneOffset() / 60,
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate(),
        now.getHours(),
        now.getMinutes(),
        seconds)
}

module.exports = timestampNow