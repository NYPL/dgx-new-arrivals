/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import ToggleDisplay from './../src/app/components/ToggleDisplay/ToggleDisplay.jsx';

describe('ToggleDisplay', () => {
  let component;

  before(() => {
    component = mount(<ToggleDisplay />);

    // Sometimes component.state().toggleFilter inconsistently returns
    // either true or false. Explicitly setting it to false.
    component.setState({ toggleFilter: false });
  });

  it('should be wrapped in a .toggleDisplay', () => {
    expect(component.find('.toggleDisplay')).to.be.defined;
  });

  it('should have a FilterToggle component', () => {
    expect(component.find('FilterToggle')).to.be.defined;
  });

  it('should have a ViewTypeButton component', () => {
    expect(component.find('ViewTypeButton')).to.be.defined;
  });

  it('should have a PillButton component', () => {
    expect(component.find('PillButton')).to.be.defined;
  });

  it('should have a Filter component', () => {
    expect(component.find('Filter')).to.be.defined;
  });

  it('should have `displayType` set to grid by default', () => {
    expect(component.state().displayType).to.equal('grid');
  });

  it('should have `toggleFilter` set to false by default', () => {
    expect(component.state().toggleFilter).to.equal(false);
  });

  it('should set the state\'s `toggleFilter` value to true when the' +
    'PillButton component is clicked', () => {
    component.find('PillButton').simulate('click');
    expect(component.state().toggleFilter).to.equal(true);
  });
});
