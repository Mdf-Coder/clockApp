/////////////////////////////////////////
// Start Stop Watch Btn
let startStopwatchBtn = document.querySelector('#start-stop-watch')
let notStartedBtnDiv = document.querySelector('#not-started-btns')

startStopwatchBtn.addEventListener('click', () => {
    changeBtnOrganisation()
    stopWatchInterval(0, 0, 0, 0)
})


//////////////////////////////////
// Change Btn Organisation
function changeBtnOrganisation() {
    notStartedBtnDiv.classList.toggle('hide-btn')
    startStopwatchBtn.classList.toggle('hide-btn')
    document.querySelector('#timer-holder').classList.toggle('translate-y-20')
    document.querySelector('#timer-holder').classList.toggle('scale-125')
    organiseBtnOrders('resume')
}

///////////////////////////////////
// Start Timer
let stopWatchTimerDiv = document.querySelector('#stop-watch-timer')
let milliSecondDiv = document.querySelector('#milli-second')
let TimerInterval = null;
let globalHour, globalMinute, globalSecond, globalMillisecond


function stopWatchInterval(hours, minutes, seconds, milliseconds) {

    // Stop Watch
    TimerInterval = setInterval(() => {
        console.log('Interval')
        milliseconds += 10;
        if (milliseconds === 1000) {
            milliseconds = 0;
            seconds++;
            if (seconds === 60) {
                seconds = 0;
                minutes++;
                if (minutes === 60) {
                    minutes = 0;
                    hours++;
                }
            }
        }

        // Format time to start with 0 if length is low
        let h = String(hours).padStart(2, '0');
        let m = String(minutes).padStart(2, '0');
        let s = String(seconds).padStart(2, '0');
        let ms = String(Math.floor(milliseconds / 10)).padStart(2, '0');

        // Update DOM
        stopWatchTimerDiv.innerHTML = `${h}:${m}:${s}`
        milliSecondDiv.innerHTML = ms

        // ReAssigning Global Variables
        globalHour = hours
        globalMinute = minutes
        globalSecond = seconds
        globalMillisecond = milliseconds
    }, 10)
}

///////////////////////////////////////////
// Pause Stop-Watch
let pauseResumeStopWatchBtn = document.querySelector('#pause-resume-stopwatch')
let pauseBtn = document.querySelector('#pause-svg-btn')
let resumeBtn = document.querySelector('#start-svg-btn')
let resetBtn = document.querySelector('#reset-svg-btn')
let flagBtn = document.querySelector('#flag-svg-btn')

// Control Which Btn Show To User --> Pause/Resume . Flag/Reset
pauseResumeStopWatchBtn.addEventListener('click', () => {
    organiseBtnOrders(pauseResumeStopWatchBtn.getAttribute('data-active-svg'))
})

// Show Needed Btn To User (Pause & Flag Together , Resume & Reset Together)
function organiseBtnOrders(condition) {
    if (condition === 'pause') {
        // Hide Pause Btn
        pauseBtn.classList.add('hide-btn')
        // Show Resume Btn
        resumeBtn.classList.remove('hide-btn')
        // Change Data To --> Resume
        pauseResumeStopWatchBtn.setAttribute('data-active-svg', 'resume')
        // Show Reset Btn
        resetBtn.classList.remove('hide-btn')
        // Hide Flag Btn
        flagBtn.classList.add('hide-btn')

    } else if (condition === 'resume') {
        // Show Pause Btn
        pauseBtn.classList.remove('hide-btn')
        // Hide Resume Btn
        resumeBtn.classList.add('hide-btn')
        // Change Data To --> Pause
        pauseResumeStopWatchBtn.setAttribute('data-active-svg', 'pause')
        // Hide Reset Btn
        resetBtn.classList.add('hide-btn')
        // Show Flag Btn
        flagBtn.classList.remove('hide-btn')
    }
}


//////////////////////////////////////
// Pause StopWatch
pauseBtn.addEventListener('click', pauseStopwatch)

function pauseStopwatch() {
    clearInterval(TimerInterval)
    document.querySelector('#timer-holder').classList.add('animate-pulse')
}

// Resume StopWatch
resumeBtn.addEventListener('click', resumeStopWatch)

function resumeStopWatch() {
    stopWatchInterval(globalHour, globalMinute, globalSecond, globalMillisecond)
    document.querySelector('#timer-holder').classList.remove('animate-pulse')
}

//////////////////////////////////////
// Reset StopWatch
resetBtn.addEventListener('click', resetStopWatch)

function resetStopWatch() {
    // Clear Interval
    clearInterval(TimerInterval)
    // Change Timer Text
    stopWatchTimerDiv.innerHTML = '00:00:00'
    milliSecondDiv.innerHTML = '00'
    // Remove Pause Animation
    document.querySelector('#timer-holder').classList.remove('animate-pulse')
    // Config (Show & Hide) Btn to default
    changeBtnOrganisation()
    organiseBtnOrders('resume')
    // Clear Records Div
    recordsDiv.innerHTML = ''
}

////////////////////////////////////////
// Flag (Set Record)
let recordsDiv = document.querySelector('#records')
let recordNumber = 1
let lastRecordSaved = 0
flagBtn.addEventListener('click', () => {
    setRecord(lastRecordSaved, stopWatchTimerDiv.innerHTML)
})

// Calculate Difference Of This Record From Last one And add that to DOm
function setRecord(time_1, time_2) {

    // Turn time from 00:00:00 to ...Second
    let returnToSecond = (time) => {
        // Get Each Part (Hour, Minute, Second) & Turn To Second
        const [h, m, s] = time.split(':').map(Number);
        return h * 3600 + m * 60 + s;
    }

    // Calculate Difference
    let difference = returnToSecond(time_2) - time_1;

    // Calculate Hour , Minute , Second From Difference (Second)
    let hour = Math.floor(difference / 3600);
    difference %= 3600;
    let minute = Math.floor(difference / 60);
    let second = difference % 60;

    // Add Default 0 Add the Beginning if length === 1
    hour = hour.toString().padStart(2, '0')
    minute = minute.toString().padStart(2, '0')
    second = second.toString().padStart(2, '0')


    // Add Record Tp DOM
    let formatText =
        `<span class="animate-bounce-in">
                    <span>${String(recordNumber).padStart(2, '0')}</span>
                    <span class="text-gray-400">+ ${hour}:${minute}:${second}</span>
                    <span>${time_2}</span>
                </span>`

    recordsDiv.insertAdjacentHTML('afterbegin', formatText)

    lastRecordSaved = returnToSecond(time_2)
    recordNumber += 1
}

//////////////////////////////////
// Pause While On other Page
window.stopTimerOnOtherPage = (act) => {
    if (act === false) {
        pauseStopwatch()
    } else if (act === true){
        document.querySelector('#timer-holder').classList.remove('animate-pulse')
        organiseBtnOrders('pause')
    }
}
