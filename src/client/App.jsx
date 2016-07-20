import React from 'react';
import ReactDOM from 'react-dom';
import a11y from 'react-a11y';

import alt from 'dgx-alt-center';
import Iso from 'iso';

import './styles/main.scss';

import App from '../app/components/Application/Application.jsx';
import FeatureFlags from 'dgx-feature-flags';
import ga from 'react-ga';

a11y(React, { ReactDOM, includeSrcNode: true });

window.onload = () => {
  if (!window.ga) {
    console.log('Analytics not available - loading through React.');
    // const gaOpts = { debug: false };
    // Passing in false for the dev GA code
    // ga.initialize('UA-1420324-122', gaOpts);
  }

  if (!window.dgxFeatureFlags) {
    window.dgxFeatureFlags = FeatureFlags.utils;
  }

  // Render Isomorphically
  Iso.bootstrap((state, container) => {
    alt.bootstrap(state);
    ReactDOM.render(React.createElement(App), container);
  });
};
