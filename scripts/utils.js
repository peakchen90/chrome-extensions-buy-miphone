const utils = {}

// 格式化时间为 hh:mm
utils.formatDate = function (date) {
    if (!(date instanceof Date)) {
        date = new Date(date)
    }
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
utils.getDate = function (hours, minutes) {
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
utils.setTimeFromStorage = function (date) {
    if (date instanceof Date) {
        date = date.getTime()
    } else {
        date = 0
    }
    chrome.storage.local.set({
        'buy-miphone-time': date
    })
}

// 从本地读取时间
utils.getTimeFromStorage = function (cb) {
    chrome.storage.local.get('buy-miphone-time', function (ret) {
        if (cb instanceof Function) {
            cb(ret && ret['buy-miphone-time'])
        }
    })
}

// 获取小米购买页面的标签页
utils.getMiTabs = function (allMiPage) {
    if (allMiPage === undefined) allMiPage = true
    return new Promise(function (resolve, reject) {
        chrome.tabs.query({
            currentWindow: true
        }, function (tabs) {
            const ret = tabs.filter(function (tab) {
                if (allMiPage) {
                    return /^https?\:\/\/(www|item|list)\.mi\.com/.test(tab.url)
                }
                return /^https?\:\/\/item\.mi\.com\/product\//.test(tab.url)
            })
            resolve(ret)
        })
    })
}

// 获取当前窗口激活页签
utils.getActiveTab = function () {
    return new Promise(function (resolve, reject) {
        chrome.tabs.query({
            currentWindow: true,
            active: true
        }, function (tabs) {
            resolve(tabs[0] || {})
        })
    })
}

// 设置 icon 是否激活状态
utils.setIconActive = function (active) {
    const icon = active ? 'icon' : 'icon-gray'
    chrome.browserAction.setIcon({
        path: {
            '19': `images/${icon}_19.png`,
            '38': `images/${icon}_38.png`
        }
    })
}

// 想页面发送消息
utils.sendToContent = function (message) {
    utils.getMiTabs(false).then(function (tabs) {
        tabs.forEach(function (tab) {
            chrome.tabs.sendMessage(tab.id, message)
        })
    })
}