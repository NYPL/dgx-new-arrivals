/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import ViewTypeButton from './../src/app/components/ToggleDisplay/ViewTypeButton.jsx';

describe('ViewTypeButton', () => {
  let component;

  before(() => {
    component = mount(<ViewTypeButton />);
  });

  it('should be wrapped in a .switch and .viewType class', () => {
    expect(component.find('.switch')).to.be.defined;
    expect(component.find('.viewType')).to.be.defined;
  });

  it('should be wrapped in a fieldset', () => {
    expect(component.find('fieldset')).to.be.defined;
    expect(component.find('fieldset')).to.have.length(1);
  });

  it('should have two radio buttons', () => {
    expect(component.find('input')).to.have.length(2);
  });

  it('should have two labels, one for each radio button', () => {
    expect(component.find('label')).to.have.length(2);
  });

  it('should have the Grid view active by default', () => {
    expect(component.props().type).to.equal('grid');

    expect(component.find('#listInput').props().checked).to.equal(false);
    expect(component.find('#gridInput').props().checked).to.equal(true);
  });

  it('should activate the List option when it is passed as a prop', () => {
    // Set to Grid by default
    expect(component.props().type).to.equal('grid');

    component.setProps({ type: 'list' });

    expect(component.props().type).to.equal('list');

    expect(component.find('#listInput').props().checked).to.equal(true);
    expect(component.find('#gridInput').props().checked).to.equal(false);
  });

  it('should activate the Grid option when it is passed as a prop', () => {
    component.setProps({ type: 'list' });

    expect(component.props().type).to.equal('list');

    component.setProps({ type: 'grid' });

    expect(component.props().type).to.equal('grid');

    expect(component.find('#listInput').props().checked).to.equal(false);
    expect(component.find('#gridInput').props().checked).to.equal(true);
  });
});
