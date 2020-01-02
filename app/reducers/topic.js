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

    case types.EXAM_LOADED:
      if (action.data) return {...state, exam: action.data};
      return state;
    case types.EXAM_NEW:
      return {...state, exam: null};
    default:
      return state;
  }
};

export default topics;
