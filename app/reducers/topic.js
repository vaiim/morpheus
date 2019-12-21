import { combineReducers } from 'redux';
import * as types from '../types';

const topics = (
  state = {},
  action
) => {
  switch (action.type) {
    case types.REQUEST_SUCCESS:
      if (action.data) return {...state, [action.data.topic]: action.data.data};
      return state;
    default:
      return state;
  }
};

export default topics;
