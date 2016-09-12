import React from 'react';
import ReactDOM from 'react-dom';

import alt from 'dgx-alt-center';
import Iso from 'iso';

import './styles/main.scss';

import App from '../app/components/Application/Application.jsx';

import { ga } from 'dgx-react-ga';

import a11y from 'react-a11y';

if (loadA11y) {
  a11y(React, { ReactDOM, includeSrcNode: true });
}

window.onload = () => {
  // if (!window.ga) {
    // const gaOpts = { debug: false };
    // ga.initialize('UA-1420324-122', gaOpts);
  // }

  // Render Isomorphically
  Iso.bootstrap((state, container) => {
    alt.bootstrap(state);
    ReactDOM.render(React.createElement(App), container);
  });
};
