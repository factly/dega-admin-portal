import React from 'react';
import { BrowserRouter as Router, useHistory } from 'react-router-dom';
import renderer, { act } from 'react-test-renderer';
import { useDispatch, useSelector, Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import '../../matchMedia.mock';
import ClaimsList from './index';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn(),
}));

jest.mock('../../actions/claims', () => ({
  getClaims: jest.fn(),
  addClaim: jest.fn(),
}));

describe('Claims List component', () => {
  let store;
  let mockedDispatch;

  beforeEach(() => {
    store = mockStore({});
    store.dispatch = jest.fn(() => ({}));
    mockedDispatch = jest.fn();
    useDispatch.mockReturnValue(mockedDispatch);
  });
  it('should render the component', () => {
    useSelector.mockImplementation(() => ({}));
    const tree = renderer
      .create(
        <Provider store={store}>
          <Router>
            <ClaimsList />
          </Router>
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('should render the component with data', () => {
    useSelector.mockImplementation(() => ({
      claims: [
        { id: 1, title: 'claim', claimant: 'claimant', rating: 'rating', claim_date: '2017-12-12' },
      ],
      total: 1,
      loading: false,
    }));
    const tree = renderer
      .create(
        <Provider store={store}>
          <Router>
            <ClaimsList />
          </Router>
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});