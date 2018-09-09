export const openRecord = () => ({
  type: 'HEADER/OPEN_RECORD',
});

export const closeRecord = () => ({
  type: 'HEADER/CLOSE_RECORD',
});

export const sendingNotification = () => ({
  type: 'NOTIFICATION/SEND',
});

export const sendingNotificationDone = (response) => ({
  type: 'NOTIFICATION/DONE',
  response,
});

export const sendingNotificationError = (message) => ({
  type: 'NOTIFICATION/ERROR',
  message
});

export const resetNotification = (message) => ({
  type: 'NOTIFICATION/RESET',
});

export const addUserLocation = (latitude, longitude) => ({
  type: 'LOCATION/EDIT',
  latitude,
  longitude
});

export const onMediaGranted = (granted) => ({
  type: 'MEDIA/ON_GRANTED',
  granted
});

export const onMediaDenial = (reason) => ({
  type: 'MEDIA/ON_DENIAL',
  reason
});

export const sendNotification = (name, title, desc, location) => async (dispatch) => {
    try {
      dispatch(sendingNotification())

      const data = {
        app_id: "1e6fa0f6-237e-4a9d-8b89-78c6e6abae15",
        contents: { en: `${title ? title.substring(0, 15) : ''}. ${desc ? desc.substring(0, 30) : ''}` },
        headings: { en: `A New Video Posted by ${name}` },
      };
      
      if (location && location.longitude && location.latitude) {
        console.log(`Send to location: ${location.latitude}, ${location.longitude}`)
        data.filters = [
          { "field": "location", "radius": 5000, "lat": location.latitude, "long": location.longitude }
        ]
      } else {
        data.included_segments = ["All"];
      }

      const request = await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        body: JSON.stringify(data),
        mode: 'cors',
        redirect: 'follow',
        headers: new Headers({
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': 'Basic NmUxMzRmNTItYTliZC00MDc0LWFmMzYtN2YyNzUzNGI2ZGJj'
        })
      });
      const response = await request.json()
      console.log(response)
      if (response.id) {
        dispatch(sendingNotificationDone('Notification sent!'))
      }
    } catch (error) {
      dispatch(sendingNotificationError(error.message))
    }
}

export const getUserLocation = () => (dispatch) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        // Edit location
        dispatch(addUserLocation(latitude, longitude))
    });
  } else {
    
  }
}