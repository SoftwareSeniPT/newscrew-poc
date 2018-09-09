import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import { sendNotification, resetNotification } from 'containers/home/actions';
import './styles.scss'

class VideoUploadForm extends Component {
  state = {
    title: '',
    desc: '',
    name: '',
    sendTo: 'all'
  }
  titleOnChange = (event) => {
    this.setState({
      title: event.target.value
    })
  }
  descOnChange = (event) => {
    this.setState({
      desc: event.target.value
    })
  }
  nameOnChange = (event) => {
    this.setState({
      name: event.target.value
    })
  }
  sendTohandleChange = (event) => {
    this.setState({
      sendTo: event.target.value
    })
  }
  onClick = () => {
    const { dispatch, userLatitude, userLongitude } = this.props;
    const { name, title, desc, sendTo } = this.state
    if (name && title && desc) {
      // Send notification
      const location = sendTo === 'radius' ? {
        latitude: userLatitude,
        longitude: userLongitude,
      } : null
      dispatch(sendNotification(name, title, desc, location))
      this.setState({
        title: '',
        desc: '',
        name: ''
      })
    }
  }
  render() {
    const { notificationSending, notificationResponse, notificationError, dispatch, userLatitude, userLongitude } = this.props;
    const { name, title, desc, sendTo } = this.state
    const fieldNotEmpty = name && title && desc
    return (
      <div className="VideoUploadForm__root">
        <div>
          <TextField
            value={this.state.name}
            onChange={this.nameOnChange}
            label="Your Name"
            className="VideoUploadForm__formField" />
        </div>
        <div>
          <TextField
            value={this.state.title}
            onChange={this.titleOnChange}
            label="Video Title"
            className="VideoUploadForm__formField" />
        </div>
        <div>
          <TextField
            value={this.state.desc}
            onChange={this.descOnChange}
            label="Video Description"
            className="VideoUploadForm__formField" />
        </div>
        <div>
          <RadioGroup
            aria-label="Gender"
            name="location"
            value={this.state.sendTo}
            onChange={this.sendTohandleChange}>
            <FormControlLabel value="all" control={<Radio />} label="Send to all user" />
            {userLatitude && userLongitude && (
              <FormControlLabel value="radius" control={<Radio />} label={`Send to user on radius 5KM (Lat: ${userLatitude}, Long: ${userLongitude})`} />
            )}
          </RadioGroup>
        </div>
        <Button
          onClick={this.onClick}
          variant="contained"
          className="VideoUploadForm__button"
          disabled={notificationSending || !fieldNotEmpty}
          color="primary">
          {`${notificationSending ? 'Sending...' : 'Send Video'}`}
        </Button>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={notificationResponse || notificationError}
          autoHideDuration={6000}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{notificationResponse || notificationError}</span>}
          action={[
            <Button
              to="/"
              component={Link}
              key="undo"
              color="secondary"
              size="small">
              BACK TO HOME
            </Button>,
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={() => dispatch(resetNotification())}>
              <CloseIcon />
            </IconButton>
          ]} />  
      </div>
    );
  }
}

export default connect(state => ({
  notificationSending: state.home.notificationSending,
  notificationResponse: state.home.notificationResponse,
  notificationError: state.home.notificationError,
  userLatitude: state.home.userLatitude,
  userLongitude: state.home.userLongitude,
}))(VideoUploadForm);
