// 格式化时间为 hh:mm
function formatDate(date) {
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

let buyTime
let isStart = false

chrome.runtime.onMessage.addListener(function (message) {
  if (message.type === 'SET_TIME') {
    const date = message.data
    if (date) {
      buyTime = date
      console.info(`设置在今日 ${formatDate(date)} 抢购手机，请保持此页面为激活状态且可见`)
      startBuy(true)
      isStart = true
    } else {
      buyTime = 0
      console.clear()
    }
  }
})

// 速度，数值越大越慢
const speed = 1
let buyCount = 0

function startBuy(isSource) {
  if (isSource && isStart) return
  window.requestAnimationFrame(function () {
    if (buyTime && buyTime > Date.now() - 2 * 60 * 1000) {
      if (buyTime <= Date.now()) {
        submitOrder(++buyCount)
      }
      startBuy()
    }
  })
}

let submitDOM

function submitOrder(count) {
  console.log(count)
  if (count % speed !== 0) return
  if (!submitDOM) {
    submitDOM = document.querySelector('#J_buyBtnBox a')
  }
  submitDOM.click()
}