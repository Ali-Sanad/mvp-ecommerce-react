import {
  GET_PRODUCTS_LIST,
  GET_PRODUCT_DESCRIPTION,
  PRODUCTS_LIST_DATA_ERROR,
  PRODUCT_DESCRIPTION_DATA_ERROR,
} from '../actions/types';

const initialState = {
  products: [],
  productDescription: {},
  error: {},
};

const productsListReducer = (state = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case GET_PRODUCTS_LIST:
      return {
        ...state,
        products: payload,
      };
    case GET_PRODUCT_DESCRIPTION:
      return {
        ...state,
        productDescription: payload,
      };
    case PRODUCTS_LIST_DATA_ERROR:
      return {
        ...state,
        products: [],
        error: payload,
      };
    case PRODUCT_DESCRIPTION_DATA_ERROR:
      return {
        ...state,
        productDescription: {},
        error: payload,
      };
    default:
      return state;
  }
};
export default productsListReducer;
