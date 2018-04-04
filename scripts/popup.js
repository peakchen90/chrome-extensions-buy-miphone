// 屏蔽右键
document.oncontextmenu = function (e) {
    e.preventDefault()
    return false
}

const timeInput = document.querySelector('.time input')
const confirm = document.querySelector('.buttons .primary')
const reset = document.querySelector('.buttons .plain')

confirm.addEventListener('click', function (e) {
    const time = timeInput.value
    if (/^(\d{1,2})[\:\.](\d{1,2})$/.test(time)) {
        setTime(__utils.getDate(RegExp.$1, RegExp.$2))
    } else {
        resetTime()
    }
})

reset.addEventListener('click', function (e) {
    resetTime()
})

__utils.getTimeFromStorage(function (ret) {
    if (ret && ret >= Date.now()) {
        setTime(new Date(ret))
    } else {
        resetTime()
    }
})

//　确定设置抢购时间
function setTime(date) {
    timeInput.value = __utils.formatDate(date)
    timeInput.setAttribute('readonly', 'readonly')
    confirm.disabled = true
    reset.disabled = false
    __utils.setTimeFromStorage(date)
    sendRemoteMessage(date.getTime())
}

// 重置抢购时间
function resetTime() {
    const date = __utils.getDate(10, 0)
    timeInput.value = __utils.formatDate(date)
    timeInput.removeAttribute('readonly')
    confirm.disabled = false
    reset.disabled = true
    __utils.setTimeFromStorage('')
}

// 发送通信消息
function sendRemoteMessage(timestamp) {
    chrome.runtime.sendMessage({
        type: 'SET_TIME',
        date: timestamp
    }, function (res) {
        console.log('res', res)
    })
}