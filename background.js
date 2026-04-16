chrome.alarms.create("focusTimer", { 
    periodInMinutes: 1/60,
})

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "focusTimer") {
        chrome.storage.local.get(["timer", "isRunning"], (res) => {
            if (res.isRunning) {
                let timer = (res.timer ?? 0) + 1
                console.log(timer)
                chrome.storage.local.set({
                    timer,
                })
            }
        })
    }
})

// Initializes default values in storage
// When extension runs for the first time, there's no timer or isRunning yet.
// So this code initializes it so there's no errors later on.
chrome.storage.local.get(["timer", "isRunning"], (res) => {
    chrome.storage.local.set({
        timer: "timer" in res ? res.timer : 0,
        isRunning: "isRunning" in res ? res.isRunning : false,
    })
})