//////////////////////////////////////////////
// Clear Hour - Minute - Second Inputs
function clearTimeInputs() {
    hourInput.value = ''
    minuteInput.value = ''
    secondInput.value = ''
}

/////////////////////////////////////////////
// Start Btn Handler

let countdownConfig = document.querySelector('#countdown-config')
let showCountdownProcess = document.querySelector('#show-countdown-process')
let startCountdownBtn = document.querySelector('#start-countdown-btn')
let preMadeTimesHolder = document.querySelector('#pre-made-times-holder')

// if click On start ...
startCountdownBtn.addEventListener('click', () => {
    let totalTimeInSecond = (Number(hourInput.value) * 3600) + (Number(minuteInput.value) * 60) + (Number(secondInput.value))
    // Set Full Time / Remaining Time Again
    globalTimerFullValue = totalTimeInSecond
    globalTimerRemainingValue = totalTimeInSecond
    // Set Precess Percent 100% Again
    processPercent = 100
    startCountdown(totalTimeInSecond)
    // Add Recently Used Time To Pre-made times
    preMadeTimesHolder.lastElementChild.remove()
    let makeSpan = document.createElement('span')
    makeSpan.setAttribute('data-time-value', String(totalTimeInSecond))
    makeSpan.innerHTML = `${hourInput.value}:${minuteInput.value}:${secondInput.value}`
    makeSpan.addEventListener('click', startTimerWithPreMadeBtn)
    preMadeTimesHolder.appendChild(makeSpan)

})
////////////////////////////////////////////////
// Input Handlers
let hourInput = document.querySelector('#hour-input')
let minuteInput = document.querySelector('#minute-input')
let secondInput = document.querySelector('#second-input')


hourInput.addEventListener('input', hourHandlerOnInput)
hourInput.addEventListener('blur', hourHandlerOnBlur)

minuteInput.addEventListener('input', minuteHandlerOnInput)
minuteInput.addEventListener('blur', minuteHandlerOnBlur)

secondInput.addEventListener('input', secondHandlerOnInput)
secondInput.addEventListener('blur', secondHandlerOnBlur)


// On Input --> Hour
function hourHandlerOnInput() {
    if (hourInput.value.length > 1) {
        // if Length More than 2 --> no more number taken
        hourInput.value = hourInput.value.slice(0, 2)
        // Go for minute input
        minuteInput.select()
        minuteInput.focus()
    }
}

// On Blur --> Hour
function hourHandlerOnBlur() {
    if (hourInput.value) {
        if (hourInput.value > 23) { // if more than 23 --> set 23
            hourInput.value = 23
        } else if (hourInput.value < 0) { // if less than 0 --> set 0
            hourInput.value = 0
        }
        // Set Default Zero Before Number
        hourInput.value = hourInput.value.padStart(2, '0')
    }

    // Check Validation
    inputsValidation()
}


// On Input --> Minute
function minuteHandlerOnInput() {
    if (minuteInput.value.length > 1) {
        // if Length More than 2 --> no more number taken
        minuteInput.value = minuteInput.value.slice(0, 2)
        // Go for minute input
        secondInput.select()
        secondInput.focus()
    } else if (minuteInput.value.length < 1) { // Go last input
        hourInput.select()
        hourInput.focus()
    }
}

// On Blur --> Minute
function minuteHandlerOnBlur() {
    if (hourInput.value) {
        if (minuteInput.value > 59) { // if more than 59 --> set 59
            minuteInput.value = 59
        } else if (minuteInput.value < 0) { // if less than 0 --> set 0
            minuteInput.value = 0
        }
        // Set Default Zero Before Number
        minuteInput.value = minuteInput.value.padStart(2, '0')
    }

    // Check Validation
    inputsValidation()
}


// On Input --> Second
function secondHandlerOnInput() {
    if (secondInput.value.length > 1) {
        // if Length More than 2 --> no more number taken
        secondInput.value = secondInput.value.slice(0, 2)
        // UnFocus Input
        secondInput.blur()
    } else if (secondInput.value.length < 1) { // Go last input
        minuteInput.select()
        minuteInput.focus()
    }
}

// On Blur --> Second
function secondHandlerOnBlur() {
    if (hourInput.value) {
        if (secondInput.value > 59) { // if more than 59 --> set 59
            secondInput.value = 59
        } else if (secondInput.value < 0) { // if less than 0 --> set 0
            secondInput.value = 0
        }

        // Set Default Zero Before Number
        secondInput.value = secondInput.value.padStart(2, '0')
    }

    // Check Validation
    inputsValidation()
}

//////////////////////////////////////////////////////////////////
// Inputs Validation --> Show Start Btn
function inputsValidation() {

    if (hourInput.value && minuteInput.value && secondInput.value) { // Is all inputs Filled?
        if (Number(hourInput.value) === 0 && Number(minuteInput.value) === 0 && Number(secondInput.value) === 0) { // if values are Not Ok
            startCountdownBtn.classList.remove('start-btn-active')
            startCountdownBtn.classList.add('start-btn-not-active')
            startCountdownBtn.classList.add('animate-shake')
            startCountdownBtn.setAttribute('disabled', true)
        } else { // If Values are Ok!
            startCountdownBtn.classList.add('start-btn-active')
            startCountdownBtn.classList.remove('start-btn-not-active')
            startCountdownBtn.classList.remove('animate-shake')
            startCountdownBtn.removeAttribute('disabled')
        }
    }
}

/////////////////////////////////////////////////////////////////
let currentLeftTime = document.querySelector('#current-left-time')
let countdownSetTime = document.querySelector('#countdown-set-time')

// Variable For Wheel Process Interval
let processWheelInterval = null
// Variable For Wheel Process Percent
let processPercent = 100

// Do Presets of Stating timer --> Handel Process Wheel, Update DOM, ...
function startCountdown(remaining) {
    let totalTime = globalTimerFullValue
    let remainingTime = remaining
    // Calculate Time in hour, minute, second
    const [hours, minutes, seconds] = calcTimeInPeaces(globalTimerFullValue)

    // Prepare DOM
    countdownConfig.classList.add('hide-modal')
    showCountdownProcess.classList.remove('hide-modal')

    // Countdown Set Time In DOM
    countdownSetTime.innerHTML = `${hours}:${minutes}:${seconds}`

    // Update Timer Process Wheel Each 10ms
    const minusEachTime = 100 / (totalTime * 10)

    function showPrecess() {
        // Minus a Value Each 100ms
        processPercent -= minusEachTime
        // Set New Css Variable
        document.documentElement.style.setProperty('--mask-process', `${processPercent}%`)
        // Clear Interval if Time is over
        if (processPercent <= 0) {
            clearInterval(processWheelInterval)
        }
    }

    showPrecess()
    processWheelInterval = setInterval(showPrecess, 100)

    // Update Timer Number Each 1000ms
    globalTimerRemainingValue = remainingTime
    countdownTimerHandler();
    timer = setInterval(countdownTimerHandler, 1000);

}

/////////////////////////////////////////////////////////////////
// Choose a random Color
let colors = [
    'oklch(64.5% 0.246 16.439)',
    'oklch(70.5% 0.213 47.604)',
    'oklch(76.9% 0.188 70.08)',
    'oklch(69.6% 0.17 162.48)',
    'oklch(68.5% 0.169 237.323)',
    'oklch(60.6% 0.25 292.717)',
    'oklch(58.5% 0.233 277.117)',
]

function chooseRandomColor() {
    // Select Random Number
    let randomIndex = Math.floor(Math.random() * colors.length)
    // Set Color To DOM
    document.documentElement.style.setProperty('--mask-color', colors[randomIndex])
    // Delete Selected Color From List
    colors.splice(randomIndex, 1)
}

// Make The Timer Global
let timer = null

// Countdown Timer
function countdownTimerHandler() {
    // Calculate Hour Minute Second Base on Remaining Time

    const [hours, minutes, seconds] = calcTimeInPeaces(globalTimerRemainingValue)

    currentLeftTime.textContent = `${hours}:${minutes}:${seconds}`

    // Update Wheel Each ... Second (Base On full Time)
    let changeColorDuration = Math.floor(globalTimerFullValue / 3)
    // Change Wheel Color
    if (globalTimerRemainingValue % changeColorDuration === 0) {
        chooseRandomColor()
    }

    globalTimerRemainingValue--;

    // When Timer Is over!
    if (globalTimerRemainingValue < 0) {
        playRingtone()
        showNotification()
        resetTimer()
    }

}

//////////////////////////////////////////////////////
// Per-Made Time (In DOM) Control
let preMadeTimes = document.querySelectorAll('.pre-made-times')
// Set Event on each Element
for (let pmTime of preMadeTimes) {
    pmTime.addEventListener('click', startTimerWithPreMadeBtn)
}

function startTimerWithPreMadeBtn(event) {
    // Start With 200ms Delay
    setTimeout(() => {
        // Get Needed data from event.target
        let totalTime = event.target.getAttribute('data-time-value')
        globalTimerFullValue = totalTime
        // Set Precess Percent 100% Again
        processPercent = 100
        // Start Timer
        startCountdown(totalTime)
    }, 200)
}

////////////////////////////////////////////////////////
// Pause - Resume Btn In DOM => Which one shows in DOM

let pauseResumeBtn = document.querySelector('#pause-resume-btn')

pauseResumeBtn.addEventListener('click', () => {
    if (pauseResumeBtn.getAttribute('data-active-svg') === 'pause') { // if === pause
        // show pause Svg
        pauseResumeBtn.firstElementChild.classList.remove('opacity-0')
        // remove resume svg
        pauseResumeBtn.lastElementChild.classList.add('opacity-0')
        // change data
        pauseResumeBtn.setAttribute('data-active-svg', 'resume')
    } else { // if === resume
        // show pause Svg
        pauseResumeBtn.lastElementChild.classList.remove('opacity-0')
        // remove resume svg
        pauseResumeBtn.firstElementChild.classList.add('opacity-0')
        // change data
        pauseResumeBtn.setAttribute('data-active-svg', 'pause')
    }
})

////////////////////////////////////////////////////
// Pause / Resume timer
let pauseTimeBtn = document.querySelector('#pause-timer-btn')
let resumeTimeBtn = document.querySelector('#resume-timer-btn')
let resetCountdownBtn = document.querySelector('#reset-countdown-btn')

pauseTimeBtn.addEventListener('click', pauseTimer)
resumeTimeBtn.addEventListener('click', resumeTimer)
resetCountdownBtn.addEventListener('click', resetTimer)

let globalTimerRemainingValue
let globalTimerFullValue

let timerDiv = document.querySelector('#timer-div')

// Control Pause Btn
function pauseTimer() {
    clearInterval(timer)
    clearInterval(processWheelInterval)
    timerDiv.classList.add('animate-pulse')
    timer = null
    processWheelInterval = null
}

// Control Resume Btn
function resumeTimer() {
    startCountdown(globalTimerRemainingValue)
    timerDiv.classList.remove('animate-pulse')
}

// Control Reset Btn
function resetTimer() {
    // Update DOM and go back to select time page
    countdownConfig.classList.remove('hide-modal')
    showCountdownProcess.classList.add('hide-modal')
    timerDiv.classList.remove('animate-pulse')

    // Clear Intervals and remove them
    clearInterval(timer)
    clearInterval(processWheelInterval)
    timer = null
    processWheelInterval = null

    // Assign Global Full Time / Remaining Time
    globalTimerRemainingValue = 0
    globalTimerFullValue = 0

    // Set Colors Again
    colors = [
        'oklch(64.5% 0.246 16.439)',
        'oklch(70.5% 0.213 47.604)',
        'oklch(76.9% 0.188 70.08)',
        'oklch(69.6% 0.17 162.48)',
        'oklch(68.5% 0.169 237.323)',
        'oklch(60.6% 0.25 292.717)',
        'oklch(58.5% 0.233 277.117)',
    ]

    // Clear Time Inputs
    clearTimeInputs()
}

//////////////////////////////////////////////
// Show Finished Notification
let countdownTimerNotifBar = document.querySelector('#countdown-timer-notification')

//
function showNotification() {
    // Get Each Value From Full time
    let [hours, minutes, seconds] = calcTimeInPeaces(globalTimerFullValue, 1)

    // Message Text
    let message = formatNotifMessage(hours, minutes, seconds)

    // Stickers --> (Sister`s Suggestion :) )
    let stickers = ['😍', '🥰', '⏳', '⏰', '😊', '☺️', '😁']
    // ${stickers[Math.floor(Math.random() * 7)]} ==> Add In Svg Part
    // <svg class="text-sky-500 size-9 mih-w-9 min-h-9"><use href="#notif-svg"></use></svg>

    // Generate DOM Content
    let notifText =
        `<div id="notif-id" class="animate-bounce-in text-white p-1.5 sm:p-2 rounded-2xl bg-black/30 flex flex-col items-center justify-center gap-y-1.5 sm:gap-y-3">
        <span class="flex items-center justify-center gap-x-2 sm:gap-x-3">
            <span class="text-2xl sm:text-3xl">${stickers[Math.floor(Math.random() * 7)]}</span>
            <span class="flex flex-col items-start justify-center">
                <span class="text-lg sm:text-xl md:text-2xl">Times up!</span>
                <span class="text-sky-500 text-xs sm:text-sm min-w-[140px]">${message}</span>
            </span>
        </span>
        <button id="delete-notif-btn" class="cursor-pointer text-sm md:text-base bg-gray-400/30 p-1 sm:p-1.5 rounded-xl transform transition active:scale-90">Silence</button>
    </div>`

    // Add To DOM
    countdownTimerNotifBar.insertAdjacentHTML('beforeend', notifText)

    // Assign Variables
    let notifID = document.querySelector('#notif-id')
    let deleteNotifBtn = document.querySelector('#delete-notif-btn')

    // Add Event Listeners
    deleteNotifBtn.addEventListener('click', deleteNotificationHandler)

    // Delete Notif After 10s
    function deleteNotificationHandler() {
        // Add Animate To Go Out
        if (notifID) {
            notifID.classList.add('animate-blurred-out')
        }

        // Stop Audio
        fadeOutStopAudio(clockAlarm, 500)

        // Delete After 0.7s
        setTimeout(() => {
            notifID.remove()
        }, 500)
    }

    // Delete Automatically in 10s
    setTimeout(() => {
        deleteNotificationHandler()
    }, 10000)

}

/////////////////////////////////////////////////
// Calculate Time in hours minutes second
function calcTimeInPeaces(time, oneOrTwoDigit = 2) {
    let hours = (Math.floor(time / 3600))
    let minutes = (Math.floor((time % 3600) / 60))
    let seconds = (time % 60)

    if (oneOrTwoDigit === 2) { // If === 2, Make 2 Digits Out of any number
        hours = hours.toString().padStart(2, '0');
        minutes = minutes.toString().padStart(2, '0');
        seconds = seconds.toString().padStart(2, '0');
    } else { // When === 1
        // Do Nothing
    }

    return [hours, minutes, seconds]
}

///////////////////////////////////////////////////
// Format Notif Message
function formatNotifMessage(hours, minutes, seconds) {
    let textFormat = []

    if (hours && hours > 0) {
        textFormat.push(hours + " Hour" + (hours > 1 ? "s" : ""));
    }
    if (minutes && minutes > 0) {
        textFormat.push(minutes + " Minute" + (minutes > 1 ? "s" : ""));
    }
    if (seconds && seconds > 0) {
        textFormat.push(seconds + " Second" + (seconds > 1 ? "s" : ""));
    }

    return textFormat.join(" ");
}

///////////////////////////////////////////////////////
// Play Ringtone When Timer End
let clockAlarm = document.querySelector('#ringtone')
clockAlarm.loop = true
clockAlarm.volume = 0.8

// Play Audio
function playRingtone() {
    clockAlarm.play()
}

// Stop Audio With Fade Out
function fadeOutStopAudio(clockAlarm, duration = 500) {
    const stepTime = 50;
    const steps = duration / stepTime;
    let volume = clockAlarm.volume;
    const volumeStep = volume / steps;

    const fadeEffect = setInterval(() => {
        if (volume > volumeStep) {
            volume -= volumeStep;
            clockAlarm.volume = volume;
        } else {
            clockAlarm.volume = 0;
            clockAlarm.pause();
            clearInterval(fadeEffect);
            clockAlarm.volume = 1;
            clockAlarm.currentTime = 0
        }
    }, stepTime);
}

