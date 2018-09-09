const initialState = {
  recordOpen: false,
  notificationSending: false,
  notificationResponse: null,
  notificationError: null,
};

function homeReducer(state = initialState, action) {
  switch (action.type) {
    /* istanbul ignore next */
    case 'HEADER/OPEN_RECORD':
      return {
        ...state,
        recordOpen: true,
      };
    case 'HEADER/CLOSE_RECORD':
      return {
        ...state,
        recordOpen: false,
      };
    case 'NOTIFICATION/SEND':
      return {
        ...state,
        notificationSending: true,
        notificationResponse: null,
        notificationError: null,
      };
    case 'NOTIFICATION/DONE':
      return {
        ...state,
        notificationSending: false,
        notificationResponse: action.response,
      };
    case 'NOTIFICATION/ERROR':
      return {
        ...state,
        notificationSending: false,
        notificationError: action.message,
      };
    case 'NOTIFICATION/RESET':
      return {
        ...state,
        notificationSending: false,
        notificationError: null,
        notificationResponse: null,
      };
    case 'LOCATION/EDIT':
      return {
        ...state,
        userLatitude: action.latitude,
        userLongitude: action.longitude,
      };
    case 'MEDIA/ON_GRANTED':
      return {
        ...state,
        mediaGranted: action.granted,
      };
    case 'MEDIA/ON_DENIAL':
      return {
        ...state,
        mediaDenialReason: action.reason,
      };
    default:
      return state;
  }
}

export default homeReducer;
