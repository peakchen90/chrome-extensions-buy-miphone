chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type === 'SET_TIME') {

    }
})

__utils.getTimeFromStorage(function (ret) {
    if (ret) {
        chrome.tabs.getCurrent(function (tab) {
            console.log(tab);
        });
    }
    console.log(ret)
})


chrome.tabs.query({
    active: true
}, function (tabArray) {
    const exist = tabArray.some(function (tab) {

    })
    console.log(tabArray)
})

chrome.tabs.onActivated.addListener(function (activeInfo) {
    setIconActive()
    chrome.tabs.get(activeInfo.tabId, function (tab) {
        if (/^https?\:\/\/(.+?)\.mi\.com/.test(tab.url)) {
            setIconActive(true)
        } else {
            setIconActive(false)
        }
        console.log(tab)
    });
});

// 设置 icon 是否激活状态
function setIconActive(active) {
    const icon = active ? 'icon' : 'icon-gray'
    chrome.browserAction.setIcon({
        path: {
            '19': `images/${icon}_19.png`,
            '38': `images/${icon}_38.png`
        }
    })
}