// Polyfill Promise for legacy browsers
import "babel-polyfill";

import React from 'react';
import ReactDOM from 'react-dom';

import alt from 'dgx-alt-center';
import Iso from 'iso';

import './styles/main.scss';

import App from '../app/components/Application/Application.jsx';

import FeatureFlags from 'dgx-feature-flags';

import a11y from 'react-a11y';

import { gaUtils } from 'dgx-react-ga';

if (loadA11y) {
  a11y(React, { ReactDOM, includeSrcNode: true });
}

window.onload = () => {
  if (!window.dgxFeatureFlags) {
    window.dgxFeatureFlags = FeatureFlags.utils;
  }

  if (!window.ga) {
    const gaOpts = { debug: false, titleCase: false };

    gaUtils.initialize('UA-1420324-3', gaOpts);
  }

  // Render Isomorphically
  Iso.bootstrap((state, container) => {
    alt.bootstrap(state);
    ReactDOM.render(React.createElement(App), container);
  });

  gaUtils.trackPageview('send', 'pageview', window.location.pathname);
};
