import React from 'react';
import ReactDOM from 'react-dom';

import alt from '../app/alt.js';
import Iso from 'iso';

import './styles/main.scss';

import App from '../app/components/Application/Application.jsx';
import ga from 'react-ga';
// import {config} from 'dgx-react-ga';

window.onload = () => {
  if (!window.ga) {
    console.log('Analytics not available - loading through React.');
    const gaOpts = { debug: true };
    // Passing in false for the dev GA code
    // ga.initialize(config.google.code(false), gaOpts);
    ga.initialize('UA-1420324-122', gaOpts);
  }

  // Render Isomorphically
  Iso.bootstrap((state, container) => {
    console.log('Application rendered Isomorphically.');
    alt.bootstrap(state);
    ReactDOM.render(<App />, container);
  });
};

