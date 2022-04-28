import isEqual from 'lodash/isEqual';
import {ADD, REMOVE, RESIZE, REMOVE_ITEM_DATA} from '../actions/types';
const initialState = {products: [], productsCount: 0};
const cartReducer = (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case ADD: {
      let clonedProducts = [...state.products];
      if (!clonedProducts.length) {
        clonedProducts = [...clonedProducts, {...payload, count: 1}];
      } else {
        const product = clonedProducts.find(
          (item) =>
            item.id === payload.id &&
            isEqual(item.selectedAttributes, payload.selectedAttributes)
        );
        if (product) {
          product.count += 1;
        } else {
          clonedProducts = [...clonedProducts, {...payload, count: 1}];
        }
      }
      state.productsCount++;
      return {...state, products: clonedProducts};
    }
    case REMOVE: {
      const clonedProducts = [...state.products];
      const product = clonedProducts.find(
        (item) =>
          item.id === payload.id &&
          isEqual(item.selectedAttributes, payload.selectedAttributes)
      );
      if (product) {
        product.count -= 1;
        state.productsCount--;
        if (product.count === 0) {
          clonedProducts.splice(clonedProducts.indexOf(product), 1);
        }
      }
      return {...state, products: clonedProducts};
    }

    case REMOVE_ITEM_DATA: {
      const clonedProducts = [...state.products];
      const product = clonedProducts.find(
        (item) =>
          item.id === payload.id &&
          isEqual(item.selectedAttributes, payload.selectedAttributes)
      );
      if (product) {
        clonedProducts.splice(clonedProducts.indexOf(product), 1);
        state.productsCount -= product.count;
      }
      return {...state, products: clonedProducts};
    }

    case RESIZE: {
      console.log({payload});
      //payload ==> product, newSize, oldSelectedAttributes, attributeName

      const clonedProducts = [...state.products];

      //if the same products is in cart with the same incoming new size - change it's count
      const productInCartWithTheSameIncomingAttributes = clonedProducts.find(
        (item) =>
          item.id === payload.product.id &&
          isEqual(
            item.selectedAttributes[payload.attributeName],
            payload.newSize.value
          )
      );
      if (productInCartWithTheSameIncomingAttributes) {
        productInCartWithTheSameIncomingAttributes.count +=
          payload.product.count;
        clonedProducts.splice(clonedProducts.indexOf(payload.product), 1);
      }

      //if the same products is in cart with different incoming new size - change it's selectedAttributes
      const productInCartWithDifferentIncomingAttributes = clonedProducts.find(
        (item) =>
          item.id === payload.product.id &&
          isEqual(
            item.selectedAttributes[payload.attributeName],
            payload.oldSelectedAttributes[payload.attributeName]
          )
      );

      if (productInCartWithDifferentIncomingAttributes) {
        productInCartWithDifferentIncomingAttributes.selectedAttributes[
          payload.attributeName
        ] = payload.newSize.value;
      }
      return {...state, products: clonedProducts};
    }
    default:
      return {...state};
  }
};
export default cartReducer;
