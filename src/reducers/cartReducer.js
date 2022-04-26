import {ADD, REMOVE, RESIZE, REMOVE_ITEM_DATA} from '../actions/types';

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
    case REMOVE_ITEM_DATA: {
      const {itemId} = action;

      const clonedItems = {...state.items};
      const toBeDeletedItem = clonedItems[itemId];
      const toBeDeletedItemCounter = toBeDeletedItem.counter;

      delete clonedItems[itemId];
      return {
        ...state,
        items: clonedItems,
        itemsCount: state.itemsCount - toBeDeletedItemCounter,
      };
    }

    case RESIZE: {
      const newState = {...state};

      let selectedAttributesArray = action.newKey.split('?')[1].split('&');
      let existedItemInCart = Object.keys(state.items).filter((item) =>
        selectedAttributesArray.every((attr) => item.includes(attr))
      );

      Object.keys(state.items).forEach((existedItemInCartKey) => {
        if (
          existedItemInCartKey === action.newKey &&
          !!existedItemInCart.length
        ) {
          newState.items[existedItemInCartKey] = {
            ...newState.items[existedItemInCartKey],
            counter:
              newState.items[existedItemInCartKey].counter +
              action.item.counter,
          };
        } else if (
          existedItemInCartKey !== action.newKey &&
          !!existedItemInCart.length
        ) {
          let newItem = {...newState.items[existedItemInCartKey]};

          newItem = {
            ...newItem,
            counter: newItem.counter + action.item.counter,
          };
          newState.items[existedItemInCartKey] = newItem;
          delete newState.items[action.oldKey];
        } else {
          newState.items[action.newKey] = newState.items[action.oldKey];
          newState.items[action.newKey] = {
            ...action.item,
            selectedAttributes: {
              ...action.item.selectedAttributes,
              [action.attributeName]: action.newSize.value,
            },
          };
          delete newState.items[action.oldKey];
        }
      });

      return {...state, ...newState};
    }
    default:
      return {...state};
  }
};
export default cartReducer;
