import React from 'react';
import { connect } from 'react-redux';
import './styles.scss'

class Home extends React.Component {
  render() {
    const { mediaDenialReason, mediaGranted } = this.props;
    return (
      <div class="Home__root">
        {mediaGranted && (
          <div className="Home_splash">
            <h4>Record your news!</h4>
            <p>Click record button above to start record your news and send it to people</p>
          </div>
        )}
        {mediaDenialReason && (
          <div className="Home_splash">
            <h4>App cannot be used!</h4>
            <p>Your device may not supported or you've denied access to device camera. Reason: {mediaDenialReason}</p>
          </div>
        )}
      </div>
    );
  }
}

export default connect(state => ({
  mediaGranted: state.home.mediaGranted,
  mediaDenialReason: state.home.mediaDenialReason,
}))(Home);
