import {ADD, REMOVE, RESIZE} from '../actions/types';

const initialState = {items: {}, itemsCount: 0};
const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD:
      const itemId = action.item.id + '-' + action.item.selectedSize?.value;
      if (itemId in state.items) {
        let newItem = {...state.items[itemId]};
        newItem.counter++;
        state.items[itemId] = newItem;
      } else {
        let newItem = {...action.item};
        newItem.counter = 1;
        state.items[itemId] = newItem;
      }

      state.itemsCount++;
      return {...state};
    case REMOVE:
      const removeItemId =
        action.item.id + '-' + action.item.selectedSize?.value;

      if (removeItemId in state.items) {
        let deletedItem = {...state.items[removeItemId]};
        deletedItem.counter--;
        if (!deletedItem.counter) {
          delete state.items[removeItemId];
        } else {
          state.items[removeItemId] = deletedItem;
        }
      }

      state.itemsCount--;
      return {...state};
    case RESIZE:
      const reSizeItemKey =
        action.item.id + '-' + action.item.selectedSize?.value;
      const newItemKey = action.item.id + '-' + action.newSize.value;
      let newItem = action.item;
      newItem.selectedSize = action.newSize;

      const updatedItems = Object.keys(state.items).reduce(
        (newState, oldProductInCartKey) => {
          if (newItemKey === oldProductInCartKey) {
            newItem.counter += state.items[oldProductInCartKey].counter;
            newState[newItemKey] = newItem;
          } else if (reSizeItemKey === oldProductInCartKey) {
            newState[newItemKey] = newItem;
          } else {
            newState[oldProductInCartKey] = state.items[oldProductInCartKey];
          }
          return newState;
        },
        {}
      );

      state.items = updatedItems;
      return {...state};
    default:
      return {...state};
  }
};
export default cartReducer;
