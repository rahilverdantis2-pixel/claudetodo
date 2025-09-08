let timerInterval = null;
let timeLeft = 0;

// Listen for messages from the main page
self.onmessage = function(e) {
    const { command, time } = e.data;

    if (command === 'start') {
        if (timeLeft === 0) {
            timeLeft = time;
        }
        // Clear any existing interval to prevent multiple timers
        clearInterval(timerInterval);
        
        // Start a new, reliable interval
        timerInterval = setInterval(() => {
            timeLeft--;
            if (timeLeft <= 0) {
                // Time is up! Stop the timer and notify the main page.
                clearInterval(timerInterval);
                self.postMessage({ type: 'update', timeLeft: 0 });
                self.postMessage({ type: 'done' });
            } else {
                // Send the updated time back to the main page for display
                self.postMessage({ type: 'update', timeLeft: timeLeft });
            }
        }, 1000);
    } 
    else if (command === 'pause') {
        clearInterval(timerInterval);
    }
    else if (command === 'stop') {
        clearInterval(timerInterval);
        timeLeft = 0;
    }
    else if (command === 'reset') {
        clearInterval(timerInterval);
        timeLeft = time;
        // Send the reset time back immediately for UI update
        self.postMessage({ type: 'update', timeLeft: time });
    }
};
