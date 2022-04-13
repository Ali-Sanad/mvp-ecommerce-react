import {CURRENCY_SWITCHER} from '../actions/types';

const currencySwitcherReducer = (state = false, action) => {
  if (action.type !== CURRENCY_SWITCHER) {
    return state;
  }

  return !state;
};
export default currencySwitcherReducer;
