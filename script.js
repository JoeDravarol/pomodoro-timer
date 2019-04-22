const eventHandler = {
    sessionIntervals: document.getElementById('session-intervals'),
    breakIntervals: document.getElementById('break-intervals'),
    timer: {
        type: document.getElementById('interval-type'),
        countdown: document.getElementById('countdown'),
        btns: {
            play: document.getElementById('play'),
            reset: document.getElementById('reset'),
            pause: document.getElementById('pause'),
            stop: document.getElementById('stop'),
        }
    }
}

const data = {
    session: 25,
    break: 5,
    isPaused: true,
}

function mainController(e) {
    const target = e.target;
    const btnType = target.id.split('-')[0];
    const btnAction = target.id.split('-')[1];

    // Disable action when timer is running
    if (typeof data.timer === 'undefined') {
        updateTimeData(btnType, btnAction);
        updateTimeUI()
    }  
}

function updateTimeData(btnType, btnAction) {

    if (data[btnType] > 1 && data[btnType] < 60) {
        if (btnAction === 'increment') {
            ++data[btnType];
        } else {
            --data[btnType];
        }
    } else if (data[btnType] === 1) {
        if (btnAction === 'increment') {
            ++data[btnType];
        }
    } else if (data[btnType] === 60) {
        if (btnAction === 'decrement') {
            --data[btnType];
        }
    }
}

function updateTimeUI() {
    eventHandler.sessionIntervals.textContent = data.session;
    eventHandler.breakIntervals.textContent = data.break;


    eventHandler.timer.type.textContent = 'session';
    eventHandler.timer.countdown.textContent = data.session < 10 ? "0" + data.session + ":00" : data.session + ":00";
    eventHandler.timer.countdown.style.color = 'white';
}

function startTimer() {
    let minutes, seconds, fiftyPercent, twentyPercent;
    let timerType = 'session';
    let text = 'Time to work!';
    let colour = 'green';
    data.isPaused = false;

    // If time hasn't been set
    if (typeof data.timer === 'undefined') {
        // Set new time
        data.timer = 60 * data[timerType]
        fiftyPercent = Math.floor( 0.5 * (data[timerType] * 60) );
        twentyPercent = Math.floor( 0.2 * (data[timerType] * 60) );
    }

    if (!data.isPaused) {
        // Timer countdown
        data.intervalID = setInterval(() => {
            // Calculate minutes and seconds
            minutes = parseInt(data.timer / 60, 10);
            seconds = parseInt(data.timer % 60, 10);
            
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            eventHandler.timer.countdown.textContent = minutes + ":" + seconds;
            eventHandler.timer.type.textContent = text;
            eventHandler.timer.countdown.style.color = colour;
    
            // Switch interval type and countdown time
            if (--data.timer < 0) {
                timerType = timerType === 'session' ? 'break' : 'session';      
                eventHandler.timer.type.textContent = timerType === 'session' ? text = 'Time to work!' : text = 'Take a break!';   
                data.timer = 60 * data[timerType];

                fiftyPercent = Math.floor( 0.5 * (data[timerType] * 60) );
                twentyPercent = Math.floor( 0.2 * (data[timerType] * 60) );
                colour = 'green';
            }

            // Change countdown colour
            if ( fiftyPercent === data.timer) {
                colour = 'yellow';
            } else if ( twentyPercent === data.timer) {
                colour = 'red';
            }
        }, 1000);
    }
}

function pauseTimer() {
    data.isPaused = true;
    clearInterval(data.intervalID);
}

function resetTimer() {
    data.session = 25;
    data.break = 5;
    data.isPaused = true;
    data.timer = undefined;
    clearInterval(data.intervalID);
    updateTimeUI();
}

function stopTimer() {
    data.timer = undefined;
    data.isPaused = true;
    clearInterval(data.intervalID);
    updateTimeUI();
}

document.querySelector('.session').addEventListener('click', mainController);
document.querySelector('.break').addEventListener('click', mainController);

eventHandler.timer.btns.play.addEventListener('click', () => {
    if (data.isPaused === true) {
        startTimer();
    }
});
eventHandler.timer.btns.pause.addEventListener('click', pauseTimer);
eventHandler.timer.btns.stop.addEventListener('click', stopTimer);
eventHandler.timer.btns.reset.addEventListener('click', resetTimer);
