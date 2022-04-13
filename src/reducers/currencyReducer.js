import {
  CURRENCIES_DATA_ERROR,
  CURRENCY_CHANGE,
  GET_CURRENCIES,
} from '../actions/types';

const initialState = {
  activeCurrency: {label: 'USD', symbol: '$'},
  currencies: [],
  error: {},
};
const currencyReducer = (state = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case CURRENCY_CHANGE:
      return {
        ...state,
        activeCurrency: {
          label: payload.label,
          symbol: payload.symbol,
        },
      };

    case GET_CURRENCIES:
      return {
        ...state,
        currencies: payload,
      };

    case CURRENCIES_DATA_ERROR:
      return {
        ...state,
        currencies: [],
        error: payload,
      };
    default:
      return state;
  }
};
export default currencyReducer;
