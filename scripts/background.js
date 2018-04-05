chrome.storage.local.clear()

// 监听 设置抢购时间
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type === 'SET_TIME') {
        // 向抢购页面的标签页发送抢购时间
        sendToContent(message)
        utils.setIconActive(!!message.data)
    }
})