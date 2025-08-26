//////////////////////////////////////////
// Control Menu

let menuRadioInput = document.getElementsByName('clock-menu')
let liveClockSection = document.querySelector('#live-clock-section')
let countdownTimerSection = document.querySelector('#countdown-timer-section')
let stopWatchSection = document.querySelector('#stop-watch-section')
let appContainer = document.querySelector('#app-container')

// This will close all menu items like: live clock, ...
function closeAllApps() {
    for (let i of appContainer.children) {
        i.classList.add('app-popup')
    }
}

// Select which menu item shows to user
menuRadioInput.forEach(item => {
    // Add Event to all 3 menu items
    item.addEventListener('change', function () {
        showMenuItem()
    })
})

// show selected Item in DOM
function showMenuItem() {
    let selected = document.querySelector('input[name="clock-menu"]:checked').value;

    switch (selected) {
        case 'liveClock':
            closeAllApps()
            liveClockActivity(true)
            stopWatchActivity(false)
            liveClockSection.classList.remove('app-popup')
            break
        case 'countdownTimer':
            closeAllApps()
            liveClockActivity(false)
            stopWatchActivity(false)
            countdownTimerSection.classList.remove('app-popup')
            break
        case 'stopWatch':
            closeAllApps()
            liveClockActivity(false)
            stopWatchActivity(true)
            stopWatchSection.classList.remove('app-popup')
    }
}

/////////////////////////////////////////////////////
// Stop Live Clock Activity While Visiting other page
function liveClockActivity(act) {
    window.stopLiveClockOnOtherPage(act)
}

/////////////////////////////////////////////////////////
// Stop StopWatch Activity While Visiting other page
function stopWatchActivity(act) {
    window.stopTimerOnOtherPage(act)
}








