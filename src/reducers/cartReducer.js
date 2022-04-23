import {ADD, REMOVE, RESIZE} from '../actions/types';

const initialState = {items: {}, itemsCount: 0};
const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      //building unique product in cart id based on the selected attributes
      let itemId = action.item.id + '?';
      let ObjectArray = Object.keys(action.item.selectedAttributes);
      for (let attribute in action.item.selectedAttributes) {
        if (ObjectArray[ObjectArray.length - 1] === attribute) {
          itemId += `${attribute}=${action.item.selectedAttributes[attribute]}`;
        } else {
          itemId += `${attribute}=${action.item.selectedAttributes[attribute]}&`;
        }
      }

      let selectedAttributesArray = itemId.split('?')[1].split('&');
      let existedItemInCart = Object.keys(state.items).filter((item) =>
        selectedAttributesArray.every((attr) => item.includes(attr))
      );
      console.log(existedItemInCart);

      if (!!existedItemInCart.length) {
        let newItem = {...state.items[existedItemInCart[0]]};
        newItem.counter++;
        state.items[existedItemInCart[0]] = newItem;
      } else {
        let newItem = {...action.item};
        newItem.counter = 1;
        state.items[itemId] = newItem;
      }

      state.itemsCount++;
      return {...state};
    }
    case REMOVE: {
      let removeItemId = action.item.id + '?';
      let ObjectArray = Object.keys(action.item.selectedAttributes);
      for (let attribute in action.item.selectedAttributes) {
        if (ObjectArray[ObjectArray.length - 1] === attribute) {
          removeItemId += `${attribute}=${action.item.selectedAttributes[attribute]}`;
        } else {
          removeItemId += `${attribute}=${action.item.selectedAttributes[attribute]}&`;
        }
      }

      let selectedAttributesArray = removeItemId.split('?')[1].split('&');
      console.log(selectedAttributesArray);
      let existedItemInCart = Object.keys(state.items).filter((item) =>
        selectedAttributesArray.every((attr) => item.includes(attr))
      );

      if (!!existedItemInCart.length) {
        let deletedItem = {...state.items[existedItemInCart[0]]};
        deletedItem.counter--;

        if (!deletedItem.counter) {
          delete state.items[existedItemInCart[0]];
        } else {
          state.items[existedItemInCart[0]] = deletedItem;
        }

        state.itemsCount--;
      }
      return {...state};
    }
    case RESIZE: {
      /*  
       item,
      newSize,
      attributeName,
      oldKey
     */
      const reSizeItemKey =
        action.item.id + '-' + action.item.selectedAttributes?.value;
      const newItemKey = action.item.id + '-' + action.newSize.value;

      let newItem = action.item;
      newItem.selectedAttributes = {
        ...action.item.selectedAttributes,
        [action.attributeName]: action.newSize.value,
      };

      // const updatedItems = Object.keys(state.items).reduce(
      //   (newState, oldProductInCartKey) => {
      //     if (newItemKey === oldProductInCartKey) {
      //       newItem.counter += state.items[oldProductInCartKey].counter;
      //       newState[newItemKey] = newItem;
      //     } else if (reSizeItemKey === oldProductInCartKey) {
      //       newState[newItemKey] = newItem;
      //     } else {
      //       newState[oldProductInCartKey] = state.items[oldProductInCartKey];
      //     }
      //     return newState;
      //   },
      //   {}
      // );

      // state.items = updatedItems;
      return {...state};
    }
    default:
      return {...state};
  }
};
export default cartReducer;
