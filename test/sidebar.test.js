/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Sidebar from './../src/app/components/Sidebar/Sidebar.jsx';

describe('Sidebar', () => {
  let component;

  before(() => {
    component = shallow(<Sidebar />);
  });

  it('should be wrapped in a .sidebar class', () => {
    expect(component.find('.sidebar')).to.have.length(1);
  });

  it('should have a link', () => {
    const link = component.find('a');

    expect(link).be.defined;
    expect(link).to.have.length(1);
    expect(link.text()).to.equal('< BOOKS/MUSIC/DVDS');
    expect(link.prop('href')).to.equal('/browse');
    // Similar:
    // expect(link.props().href).to.equal('/browse');
  });

  it('should have a span', () => {
    const span = component.find('span');

    expect(span).be.defined;
    expect(span.prop('className')).to.equal('sidebar-landing');
    expect(span.text()).to.equal('New Arrivals');
  });
});
