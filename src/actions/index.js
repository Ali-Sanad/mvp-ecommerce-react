import {
  CURRENCY_CHANGE,
  ADD,
  TOGGLE_CART,
  CURRENCY_SWITCHER,
  REMOVE,
  REMOVE_ITEM_DATA,
  RESIZE,
  GET_PRODUCTS_LIST,
  GET_PRODUCT_DESCRIPTION,
  GET_CATEGORIES,
  GET_CURRENCIES,
  PRODUCTS_LIST_DATA_ERROR,
  PRODUCT_DESCRIPTION_DATA_ERROR,
  CATEGORIES_DATA_ERROR,
  CURRENCIES_DATA_ERROR,
} from './types';
import client from '../utils/api';
import {gql} from '@apollo/client';
export const changeCurrency = (currency) => {
  return {
    type: CURRENCY_CHANGE,
    payload: currency,
  };
};

export const AddItemToCart = (product) => {
  return {
    type: ADD,
    payload: product,
  };
};

export const RemoveItemFromCart = (product) => {
  return {
    type: REMOVE,
    payload: product,
  };
};
export const removeItemData = (product) => {
  return {
    type: REMOVE_ITEM_DATA,
    payload: product,
  };
};

export const ResizeItemFromCart = (
  product,
  newSize,
  attributeName,
  oldSelectedAttributes
) => {
  return {
    type: RESIZE,
    payload: {product, newSize, attributeName, oldSelectedAttributes},
  };
};

export const CurrencySwitcherAction = () => {
  return {
    type: CURRENCY_SWITCHER,
  };
};

export const CartSwitcherAction = () => {
  return {
    type: TOGGLE_CART,
  };
};

export const getProductsListAction = () => async (dispatch) => {
  try {
    const res = await client.query({
      query: gql`
        query {
          category {
            name
            products {
              id
              name
              inStock
              gallery
              description
              category
              brand
              attributes {
                id
                name
                type
                items {
                  displayValue
                  value
                  id
                }
              }
              prices {
                currency {
                  label
                  symbol
                }
                amount
              }
            }
          }
        }
      `,
    });

    dispatch({
      type: GET_PRODUCTS_LIST,
      payload: res?.data,
    });
  } catch (err) {
    dispatch({
      type: PRODUCTS_LIST_DATA_ERROR,
      payload: {msg: 'Somthing went wrong, please try again!'},
    });
  }
};

export const getProductDercsiptionAction = (productId) => async (dispatch) => {
  try {
    const res = await client.query({
      query: gql`
      {
        product(id: "${productId}") {
          id
          name
          inStock
          gallery
          description
          category
          attributes {
            id
            name
            type
            items {
              displayValue
              id
              value
            }
          }
          prices {
            currency {
              label
              symbol
            }
            amount
          }
          brand
        }
      }
    `,
    });
    dispatch({
      type: GET_PRODUCT_DESCRIPTION,
      payload: res?.data?.product,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DESCRIPTION_DATA_ERROR,
      payload: {msg: 'Somthing went wrong, please try again!'},
    });
  }
};

export const getCurrenciesAction = () => async (dispatch) => {
  try {
    const res = await client.query({
      query: gql`
        query {
          currencies {
            label
            symbol
          }
        }
      `,
    });

    dispatch({
      type: GET_CURRENCIES,
      payload: res?.data?.currencies,
    });
  } catch (error) {
    dispatch({
      type: CURRENCIES_DATA_ERROR,
      payload: {msg: 'Somthing went wrong, please try again!'},
    });
  }
};

export const getCategoriesAction = () => async (dispatch) => {
  try {
    const res = await client.query({
      query: gql`
        query {
          categories {
            name
          }
        }
      `,
    });

    dispatch({
      type: GET_CATEGORIES,
      payload: res?.data?.categories,
    });
  } catch (error) {
    dispatch({
      type: CATEGORIES_DATA_ERROR,
      payload: {msg: 'Somthing went wrong, please try again!'},
    });
  }
};
