function requestPermission() {
    console.log('Requesting permission...');
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            console.log('Notification permission granted.');
            // You can now proceed to send notifications.
        } else {
            console.log('Notification permission denied or dismissed.');
        }
    });
}