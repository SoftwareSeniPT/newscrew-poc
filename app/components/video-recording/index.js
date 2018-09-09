import React from 'react';
import MediaCapturer from 'react-multimedia-capture';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Link } from 'react-router-dom'
import Slide from '@material-ui/core/Slide';
import './styles.scss';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class VideoCapture extends React.Component {
  constructor() {
    super();
    this.state = {
      granted: false,
      rejectedReason: '',
      recording: false,
      paused: false,
      isSupportRearCamera: null,
      done: false,
      videoStream: null,
    };

    this.handleGranted = this.handleGranted.bind(this);
    this.handleDenied = this.handleDenied.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handleResume = this.handleResume.bind(this);
    this.setStreamToVideo = this.setStreamToVideo.bind(this);
    this.uploadVideo = this.uploadVideo.bind(this);
  }
  componentDidMount() {
    this.checkRearCameraSupport();
  }
  async checkRearCameraSupport() {
    try {
      await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { facingMode: { exact: 'environment' } },
      });
      this.setState({
        isSupportRearCamera: true,
      });
    } catch (e) {
      this.setState({
        isSupportRearCamera: false,
      });
    }
  }
  getStreamUrl(stream) {
    return window.URL.createObjectURL(stream);
  }
  setStreamToVideo(stream) {
    this.setState({
      videoStream: stream,
    });
  }
  handleGranted() {
    const { onMediaGranted } = this.props;
    onMediaGranted(true)
  }

  handleDenied(err) {
    this.setState({ rejectedReason: err.name });
    const { onMediaDenial } = this.props;
    onMediaDenial(err.name)
  }
  handleStart(stream) {
    this.setState({
      recording: true,
      done: false,
    });
    const streamURL = this.getStreamUrl(stream);
    this.setStreamToVideo(streamURL);
    const video = document.getElementById('video-record');
    video.muted = 'muted';
  }
  handleStop(blob) {
    this.setState({
      recording: false,
      done: true,
    });
    const url = URL.createObjectURL(blob);
    this.setStreamToVideo(url);
    const video = document.getElementById('video-record');
    video.removeAttribute('muted');
    video.muted = false;
  }
  handlePause() {
    this.setState({
      paused: true,
    });
  }
  handleResume(stream) {
    const streamURL = this.getStreamUrl(stream);
    this.setStreamToVideo(streamURL);
    this.setState({
      paused: false,
    });
  }
  handleError(err) {
    console.log(err);
  }
  uploadVideo() {
    const { onClose } = this.props;
    this.setState({
      done: false,
      videoStream: null,
    });
    onClose();
  }
  render() {
    const {
      granted,
      rejectedReason,
      recording,
      paused,
      isSupportRearCamera,
      done,
      videoStream,
    } = this.state;

    const { open, onClose } = this.props;

    if (isSupportRearCamera === null) return null;

    const videoConstrains = isSupportRearCamera
      ? { facingMode: { exact: 'environment' } }
      : true;

    return (
      <div>
        <MediaCapturer
          constraints={{
            audio: true,
            video: videoConstrains,
          }}
          timeSlice={10}
          onGranted={this.handleGranted}
          onDenied={this.handleDenied}
          onStart={this.handleStart}
          onStop={this.handleStop}
          onPause={this.handlePause}
          onResume={this.handleResume}
          onError={this.handleError}
          render={({ start, stop, pause, resume }) => {
            const videoAttr = {
              autoPlay: true,
              id: 'video-record',
              src: videoStream,
            };

            if (done) videoAttr.controls = 'controls';

            return (
              <Dialog
                fullScreen
                TransitionComponent={Transition}
                open={open}
                onClose={onClose}
                aria-labelledby="responsive-dialog-title"
              >
                <DialogContent className="videoRecording__root">
                  <IconButton
                    onClick={onClose}
                    className="videoRecording__close"
                    aria-label="Close"
                  >
                    <CloseIcon />
                  </IconButton>
                  <video {...videoAttr}>
                    <track kind="captions" />
                  </video>
                </DialogContent>
                <DialogActions>
                  {!recording && (
                    <Button onClick={start} color="primary">
                      {done ? 'Retake' : 'Start'}
                    </Button>
                  )}
                  {done && (
                    <Button
                      onClick={this.uploadVideo}
                      to="/form"
                      component={Link}
                      variant="contained"
                      color="primary"
                    >
                      Upload Video
                    </Button>
                  )}
                  {recording &&
                    !paused && (
                      <React.Fragment>
                        <Button onClick={pause} color="primary" autoFocus>
                          Pause
                          </Button>
                        <Button onClick={stop} color="primary" autoFocus>
                          Stop
                          </Button>
                      </React.Fragment>
                    )}
                  {recording &&
                    paused && (
                      <Button onClick={resume} color="primary" autoFocus>
                        Resume
                        </Button>
                    )}
                </DialogActions>
              </Dialog>
            );
          }}
        />
      </div>
    );
  }
}

export default VideoCapture;
