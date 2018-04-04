const __utils = {}

// 格式化时间为 hh:mm
__utils.formatDate = function (date) {
    let h = date.getHours()
    let m = date.getMinutes()
    if (h < 10) {
        h = '0' + h
    }
    if (m < 10) {
        m = '0' + m
    }
    return `${h}:${m}`
}

// 获取日期对象
__utils.getDate = function (hours, minutes) {
    hours = Number(hours)
    minutes = Number(minutes)
    const date = new Date()
    date.setHours(hours)
    date.setMinutes(minutes)
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date
}

// 保存时间到本地
__utils.setTimeFromStorage = function (date) {
    date = date && date.getTime()
    chrome.storage.local.set({
        'buy-miphone-time': date
    }, function () {
        sendRemoteMessage(date)
    })
}

// 从本地读取时间
__utils.getTimeFromStorage = function (cb) {
    chrome.storage.local.get('buy-miphone-time', function (ret) {
        if (cb instanceof Function) {
            cb(ret && ret['buy-miphone-time'])
        }
    })
}
