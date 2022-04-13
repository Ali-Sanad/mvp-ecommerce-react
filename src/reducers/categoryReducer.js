import {CATEGORIES_DATA_ERROR, GET_CATEGORIES} from '../actions/types';

const initialState = {
  data: [],
  error: {},
};
const categoryReducer = (state = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case GET_CATEGORIES:
      return {
        ...state,
        data: payload,
      };

    case CATEGORIES_DATA_ERROR:
      return {
        ...state,
        data: [],
        error: payload,
      };
    default:
      return state;
  }
};
export default categoryReducer;
