import {TOGGLE_CART} from '../actions/types';

const toggleCartReducer = (state = false, action) => {
  if (action.type !== TOGGLE_CART) {
    return state;
  }

  return !state;
};
export default toggleCartReducer;
