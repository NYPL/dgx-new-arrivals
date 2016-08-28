/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Application from './../src/app/components/Application/Application.jsx';

describe('Application', () => {
  let component;

  before(() => {
    component = shallow(<Application />);
  });

  it('should be wrapped in a .nyplNewArrivalsApp class', () => {
    expect(component.find('.nyplNewArrivalsApp')).to.have.length(1);
  });

  it('should render a <Header /> components', () => {
    expect(component.find('Header')).to.be.defined;
  });

  it('should render a <Sidebar /> components', () => {
    expect(component.find('Sidebar')).to.be.defined;
  });

  it('should render a <NewArrivals /> components', () => {
    expect(component.find('NewArrivals')).to.be.defined;
  });

  it('should render a <Footer /> components', () => {
    expect(component.find('Footer')).to.be.defined;
  });
});
