/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import IconButton from './../src/app/components/Buttons/IconButton.jsx';

describe('IconButton', () => {
  let component;

  before(() => {
    component = mount(<IconButton />);
  });

  it('should be wrapped in a .svgIcon', () => {
    expect(component.find('.svgIcon')).to.be.defined;
  });

  it('should activate the Grid option when it is passed as a prop', () => {
    expect(component.find(<button />)).to.be.defined;
  });

  it('should render the passed props', () => {
    const spy = sinon.spy();

    component.setProps({
      label: 'Reset',
      className: 'resetBtn',
      onClick: spy,
    });

    component.simulate('click');

    expect(component.props().label).to.be.equal('Reset');
    expect(component.props().className).to.be.equal('resetBtn');
  });

  it('should call the function when it is clicked', () => {
    const spy = sinon.spy();

    component.setProps({ onClick: spy });

    component.simulate('click');

    expect(spy.calledOnce).to.be.true;
  });
});

