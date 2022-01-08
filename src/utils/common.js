const convertDateTimeToUnixTimestamp = (dateObj) => {
    return parseInt((dateObj.getTime() / 1000).toFixed(0))
}

export default {
    convertDateTimeToUnixTimestamp
}