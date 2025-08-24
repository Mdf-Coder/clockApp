//////////////////////////////////////////
// preload function
window.addEventListener('DOMContentLoaded', loadHandlerFunction)
let timezonesDiv = document.querySelector('#time-zones')

function loadHandlerFunction() {
    // Get Countries Code Like : IR For Timezone From "Moment"
    const countriesCode = moment.tz.countries();

    let timeZones = []
// Add timezone to list above
    countriesCode.forEach(country => {
        timeZones.push(moment.tz.zonesForCountry(country))
    })

// Add Each timezone to DOM
    timeZones.forEach(item => {
        for (let i in item) {

            let makeHtml =
                `<label class="text-sm sm:text-base md:text-lg">
                <span class="max-w-4/5 overflow-x-auto hide-scrollbar">${item[i]}</span>
                <span class="relative w-3 h-3 min-w-3 min-h-3 transition outline-2 outline-white/70 has-checked:outline-red-700 outline-offset-2 rounded-full">
                    <input class="hidden peer" type="checkbox" name="time-zone" value="${item[i]}">
                    <span class="absolute transition transform scale-0 inset-0 rounded-full peer-checked:bg-red-700 peer-checked:scale-100"></span>
                </span>
            </label>`

            timezonesDiv.insertAdjacentHTML('beforeend', makeHtml)
        }
    })

    allTimezonesCheckbox.forEach(item => {
        item.addEventListener('change', timezoneSelectionHandler)
    })

    // Handel Time And Date in current timezone
    liveClockHandleTime() // Time
    liveClockHandleDate() // Date

}

//////////////////////////////////////////////
let liveClockSecondDOM = document.querySelector('#live-clock-second')
let liveClockMinuteDOM = document.querySelector('#live-clock-minute')
let liveClockHourDOM = document.querySelector('#live-clock-hour')

// Shows Time in timezone And update every 1 second
function liveClockHandleTime() {
    const tz = 'Asia/Tehran';
    const now = new Date();

    //  Intl.DateTimeFormat : show time in a timezone
    const timeStr = new Intl.DateTimeFormat('en-GB', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: tz
    }).format(now);

    const [hour, minute, second] = timeStr.split(':');

    liveClockSecondDOM.innerHTML = second
    liveClockMinuteDOM.innerHTML = minute
    liveClockHourDOM.innerHTML = hour


    if (second === '00') {
        updateOtherTimezoneTimes()
    }

}

let liveClockHandlerInterval = setInterval(liveClockHandleTime, 1000)

///////////////////////////


// Shows Date in timezone
let currentTimezoneDateSpan = document.querySelector('#current-timezone-date')

function liveClockHandleDate() {
    const tz = 'Asia/Tehran';
    const today = new Date();

    const options = {year: 'numeric', month: 'long', day: 'numeric', timeZone: tz};
    const formatter = new Intl.DateTimeFormat('en-US', options);

    currentTimezoneDateSpan.innerHTML = formatter.format(today) //e.g "August 16, 2025"
}


///////////////////////////////////////////////
// Handel timezone selection
let allTimezonesCheckbox = document.getElementsByName('time-zone')
let timezonesSelectionModal = document.querySelector('#select-timezone-modal')
let overlay = document.querySelector('#overlay')


allTimezonesCheckbox.forEach(item => {
    item.addEventListener('change', timezoneSelectionHandler)
})

function timezoneSelectionHandler() {
    // Close Modal
    closeModal(true)

    // if Checked --> Select and show the timezone in other locations info
    if (event.target.checked) {
        addNewTimezoneToDOM(event.target.value)
    } else { // if unChecked --> remove the timezone from other locations info
        deleteTimezone(event.target.value)
    }
}

////////////// Delete Timezone //////////////
// 1. unCheck a checkbox to delete timezone
function deleteTimezone(timezone) {
    // Remove From DOM
    for (let child of otherLocationsInfoDiv.children) {
        if (child.getAttribute('data-timezone') === timezone) {
            child.classList.add('delete-timezone-animate')

            setTimeout(() => {
                child.remove()
            }, 310)
        }
    }
    // Remove Checkbox tik
    for (let checkbox of allTimezonesCheckbox) {
        if (checkbox.value === timezone) {
            checkbox.checked = false
        }
    }

}

// 2. click on delete btn on every timezone div


//////////////// Close Modal Handler //////////////////////
// 1. When Clicked on overlay
overlay.addEventListener('click', closeModal)
// 2. When Clicked on close btn in modal
let closeModalBtn = document.querySelector('#close-modal-btn')
closeModalBtn.addEventListener('click', closeModal)
// 3.When a location Selected --> used in function Above

// Handler Function --> close modal
function closeModal(isLocationSelected = false) {
    if (isLocationSelected === true) { // This Will add few moment for user to see which location it selected
        setTimeout(() => {
            overlay.classList.add('hidden')
            timezonesSelectionModal.classList.add('hide-modal')
        }, 150)
    } else {
        overlay.classList.add('hidden')
        timezonesSelectionModal.classList.add('hide-modal')
    }
}

//////////////////////////////////////////////////////
let otherLocationsInfoDiv = document.querySelector('#other-locations-info')

// Add new timezone to DOM
function addNewTimezoneToDOM(timezone) {
    // Date In selected zone
    const dateInZone = moment().tz(timezone).format('MMM D');
    // time in selected zone
    const timeInZone = moment().tz(timezone).format('HH:mm');

    function calcUtcOffset() {
        // Uts offset in Asia/Tehran
        const myTzUtcOffset = moment().tz('Asia/Tehran').utcOffset()
        // Get Timezone Offset if location
        const offsetMinutes = moment().tz(timezone).utcOffset();

        // Format Output
        let offsetDecimal = (offsetMinutes - myTzUtcOffset) / 60;
        // Round Number To 0.5 or 0
        offsetDecimal = Math.round(offsetDecimal * 2) / 2;
        // Add Sign + -
        const sign = offsetDecimal > 0 ? '+' : '';
        // Add hrs/hr
        const text = offsetDecimal >= -1 && offsetDecimal <= 1 ? ' hr' : ' hrs';
        // Last Formatting
        const offsetWithSign = offsetDecimal === 0 ? '±0' : sign + offsetDecimal + text;

        return offsetWithSign
    }

    let htmlFormat = `<div data-timezone="${timezone}" class="w-full transition transform duration-300 rounded-xl bg-gray-400/20 p-1.5 sm:p-2 flex items-center justify-between">
                    <span>
                        <span class="flex items-center justify-start gap-x-1 sm:gap-x-2">
                            <span class="text-lg sm:text-xl md:text-2xl">${timeInZone}</span>
                            <span class="text-sm sm:text-base md:text-lg text-blue-500">${timezone}</span>
                        </span>
                        <span class="flex items-center justify-start gap-x-1 sm:gap-x-2 text-xs sm:text-sm md:text-base text-gray-300/60">
                            <span class="">${dateInZone}</span>
                            <span>|</span>
                            <span class="">${calcUtcOffset()}</span>
                        </span>
                    </span>
                    <span>
                        <svg class="delete-timezone size-6 min-w-6 min-h-6 sm:size-8 sm:min-w-8 sm:min-h-8 text-rose-500 cursor-pointer"><use href="#delete-svg"></use></svg>
                    </span>
                </div>`

    otherLocationsInfoDiv.insertAdjacentHTML('afterbegin', htmlFormat)

    document.querySelector('.delete-timezone').addEventListener('click', () => {
        deleteTimezone(timezone)
    })

}

//////////////////////////////////////////////////////
// set Another Timezone
let setTimezoneBtn = document.querySelector('#set-another-timezone-btn')
setTimezoneBtn.addEventListener('click', openModal)

// Open Modal
function openModal() {
    overlay.classList.remove('hidden')
    timezonesSelectionModal.classList.remove('hide-modal')
}

//////////////////////////////////////////////////////
// Update other Timezones time
function updateOtherTimezoneTimes() {
    for (let tzItem of otherLocationsInfoDiv.children) {
        // Get Timezone
        let tz = tzItem.getAttribute('data-timezone')
        // Date In selected zone
        const dateInZone = moment().tz(tz).format('MMM D');
        // time in selected zone
        const timeInZone = moment().tz(tz).format('HH:mm');

        tzItem.firstElementChild.firstElementChild.firstElementChild.innerHTML = timeInZone
        tzItem.firstElementChild.lastElementChild.firstElementChild.innerHTML = dateInZone
    }
}

//////////////////////////
// Pause While On other Page
window.stopLiveClockOnOtherPage = (act) => {
    if (act === false) {
        clearInterval(liveClockHandlerInterval)
    } else if (act === true) {
        liveClockHandlerInterval = setInterval(liveClockHandleTime, 1000)
    }
}
