import React from "react";
import { unmountComponentAtNode } from "react-dom";

import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Home from "./components/Home";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

Enzyme.configure({ adapter: new Adapter() });

test('it rendeer input field', () => {
  const wrapper = shallow(<Home />);
  expect(wrapper.find('#search-input').exists()).toBeTruthy();
  expect(wrapper.find('#search-input').prop('placeholder')).toEqual('Falcon9');
});

test('it rendeer submit button', () => {
    const wrapper = shallow(<Home />);
    expect(wrapper.find('#submit-btn').exists()).toBeTruthy();
    expect(wrapper.find('#submit-btn').text()).toEqual('Submit');
});

