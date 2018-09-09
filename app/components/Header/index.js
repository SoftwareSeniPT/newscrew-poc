import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import VideoCapture from 'components/video-recording';
import MenuIcon from '@material-ui/icons/Menu';
import { connect } from 'react-redux';
import { openRecord, closeRecord, getUserLocation, onMediaGranted, onMediaDenial } from 'containers/home/actions';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class Header extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getUserLocation());
  }
  render() {
    const { classes, dispatch, recordOpen, mediaGranted } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex}>
              NewsCrew
          </Typography>
          {mediaGranted && (
            <Button color="inherit" onClick={() => dispatch(openRecord())}>
              Record
            </Button>
          )}
          </Toolbar>
          <VideoCapture
            onMediaGranted={(granted) => dispatch(onMediaGranted(granted))}
            onMediaDenial={(reason) => dispatch(onMediaDenial(reason))}
            open={recordOpen}
            onClose={() => dispatch(closeRecord())}
          />
        </AppBar>
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
};

export default connect(state => ({
  recordOpen: state.home.recordOpen,
  mediaGranted: state.home.mediaGranted,
}))(withStyles(styles)(Header));
