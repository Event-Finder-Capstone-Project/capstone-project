export const requestNotificationPermission = () => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  };
  
  export const sendNotification = (message) => {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications.");
      return;
    }
  
    if (Notification.permission === "granted") {
      new Notification(message);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification(message);
        } else {
          console.log("Notification permission denied.");
        }
      });
    } else {
      console.log("Notifications not permitted by user.");
    }
  };