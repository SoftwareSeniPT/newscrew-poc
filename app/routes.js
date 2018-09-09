import React from 'react';
import { Helmet } from 'react-helmet';
import Header from 'components/header';
import { Switch, Route } from 'react-router-dom';

import Home from 'containers/home/loadable';
import VideoUploadForm from 'containers/form/loadable';

const App = () => (
  <div className="app-wrapper">
    <Helmet
      titleTemplate="%s - React.js Boilerplate"
      defaultTitle="React.js Boilerplate"
    >
      <meta name="description" content="A React.js Boilerplate application" />
    </Helmet>
    <Header />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/form" component={VideoUploadForm} />
    </Switch>
  </div>
);

export default App;
