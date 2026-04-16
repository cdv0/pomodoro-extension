const timeOption = document.getElementById("timer-option")
timeOption.addEventListener("change", (event) => {
    const val = event.target.value
    console.log(val)

    if (val < 1 || val > 60) {
        timeOption.value = 25
    }
})

const statusMsgContainer = document.getElementById("status-msg-container")
const saveBtn = document.getElementById("save-btn")
saveBtn.addEventListener("click", () => {
    chrome.storage.local.set({
        timer: 0,
        timeOption: timeOption.value,
        isRunning: false
    }, () => {
        setStatusMsg();
    })
})

chrome.storage.local.get(["timeOption"], (res) => {
    timeOption.value = res.timeOption
})

function setStatusMsg() {
    // Clear previous message
    statusMsgContainer.textContent = "";

    const text = document.createElement("p")
    text.classList.add("status-msg")
    text.textContent = "Successfully changed the time!"

    statusMsgContainer.appendChild(text);
}