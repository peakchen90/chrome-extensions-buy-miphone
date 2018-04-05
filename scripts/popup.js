// 屏蔽右键
document.oncontextmenu = function (e) {
    e.preventDefault()
    return false
}

const mainDOM = document.querySelector('.main')
const alertDOM = document.querySelector('.alert')
const timeInput = document.querySelector('.time input')
const confirm = document.querySelector('.buttons .primary')
const reset = document.querySelector('.buttons .plain')
const goMiWebSite = document.querySelector('.go-mi-website')

// 初始化执行
utils.getMiTabs(false).then(function (tabs) {
    if (tabs.length > 0) {
        mainDOM.style.display = 'block'
        alertDOM.style.display = 'none'
    } else {
        mainDOM.style.display = 'none'
        alertDOM.style.display = 'block'
    }
})
confirm.addEventListener('click', function (e) {
    const time = timeInput.value
    if (/^(\d{1,2})[\:\.](\d{1,2})$/.test(time)) {
        setTime(utils.getDate(RegExp.$1, RegExp.$2))
    } else {
        resetTime()
    }
})
reset.addEventListener('click', function (e) {
    resetTime()
})
timeInput.addEventListener('keyup', function (e) {
    if (e.keyCode === 13) {
        const time = timeInput.value
        if (/^(\d{1,2})[\:\.](\d{1,2})$/.test(time)) {
            setTime(utils.getDate(RegExp.$1, RegExp.$2))
        } else {
            resetTime()
        }
    }
})
goMiWebSite.addEventListener('click', function () {
    utils.getMiTabs().then(function (tabs) {
        if (tabs.length) {
            chrome.tabs.update(tabs[0].id, {
                active: true
            })
        } else {
            window.open('https://www.mi.com')
        }
        window.close()
    })
})

// 从本地读取抢购时间
utils.getTimeFromStorage(function (ret) {
    if (ret) {
        setTime(new Date(ret), false)
    } else {
        resetTime()
    }
})

//　确定设置抢购时间
function setTime(date, isSend) {
    if (isSend === undefined) isSend = true
    timeInput.value = utils.formatDate(date)
    timeInput.setAttribute('readonly', 'readonly')
    confirm.disabled = true
    reset.disabled = false
    if (isSend) {
        utils.setTimeFromStorage(date)
        sendRemoteMessage(date.getTime())
    }
}

// 重置抢购时间
function resetTime() {
    const hours = new Date().getHours()
    let date
    if (hours < 10) {
        date = utils.getDate(10, 0)
    } else {
        date = utils.getDate(hours + 1, 0)
    }
    timeInput.value = utils.formatDate(date)
    timeInput.removeAttribute('readonly')
    confirm.disabled = false
    reset.disabled = true
    utils.setTimeFromStorage()
    sendRemoteMessage()
}

// 发送通信消息（设置时间）
function sendRemoteMessage(timestamp) {
    if (timestamp === undefined) {
        timestamp = 0
    }
    utils.sendToContent({
        type: 'SET_TIME',
        data: timestamp
    })
}