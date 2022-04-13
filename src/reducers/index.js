import currencyReducer from './currencyReducer';
import cartReducer from './cartReducer';
import currencySwitcherReducer from './currencySwitcherReducer';
import {combineReducers} from 'redux';
import toggleCartReducer from './toggleCartReducer';
import productsListReducer from './productsListReducer';
import categoryReducer from './categoryReducer';

const rootReducers = combineReducers({
  currency: currencyReducer,
  cart: cartReducer,
  productsList: productsListReducer,
  categories: categoryReducer,
  currencySwitcherReducer: currencySwitcherReducer,
  toggleCartReducer: toggleCartReducer,
});

export default rootReducers;
