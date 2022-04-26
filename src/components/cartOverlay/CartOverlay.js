import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {
  AddItemToCart,
  CartSwitcherAction,
  CurrencySwitcherAction,
  RemoveItemFromCart,
  ResizeItemFromCart,
} from '../../actions';
import {transformProductInCartAttributeKey} from '../../utils/helpers';
import styles from './CartOverlay.module.css';

class CartOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      inMouseOver: false,
    };
    this.renderCartContent = this.renderCartContent.bind(this);
    this.setActiveContextMenu = this.setActiveContextMenu.bind(this);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.getTotal = this.getTotal.bind(this);
    this.resizeAttributeHandler = this.resizeAttributeHandler.bind(this);
    this.setMouseOver = this.setMouseOver.bind(this);
    this.hideActiveContextMenu = this.hideActiveContextMenu.bind(this);
    this.renderProductCartPrice = this.renderProductCartPrice.bind(this);
    this.renderProductCounterButton =
      this.renderProductCounterButton.bind(this);
    this.renderTotalProductsPrice = this.renderTotalProductsPrice.bind(this);
    this.renderCartCheckoutButtons = this.renderCartCheckoutButtons.bind(this);
    this.renderProductBox = this.renderProductBox.bind(this);
    this.renderCartItems = this.renderCartItems.bind(this);
  }

  addItem(product) {
    this.props.addItemToCart(product);
    this.forceUpdate();
  }

  removeItem(product) {
    this.props.removeItemFromCart(product);
    this.forceUpdate();
  }

  getTotal() {
    let total = 0;
    Object.keys(this.props.cart.items).filter((key) => {
      let product = this.props.cart.items[key];
      let price = product?.prices.find(
        (price) =>
          price.currency.label === this.props.currency.activeCurrency.label
      );
      total += price?.amount * product?.counter;
      return total;
    });
    return total.toFixed(2);
  }

  resizeAttributeHandler(product, newSize, oldKey, attributeName) {
    const newKey = transformProductInCartAttributeKey(
      product,
      newSize,
      oldKey,
      attributeName
    );
    this.props.resizeItemFromCart(
      product,
      newSize,
      attributeName,
      oldKey,
      newKey
    );
    this.forceUpdate();
  }

  setMouseOver() {
    this.setState((state) => ({
      inMouseOver: !state.inMouseOver,
    }));
  }

  hideActiveContextMenu() {
    if (!this.state.inMouseOver) {
      this.setState({
        active: false,
      });
    }
  }

  setActiveContextMenu(event) {
    event.stopPropagation();
    this.props.cartSwitcherAction();
    if (this.props.currencySwitcherState) {
      this.props.currencySwitcherAction();
    }
  }

  renderProductCartPrice(product) {
    return (
      <p className={styles.product_cart_price}>
        {product.prices.map((price) => {
          if (
            price.currency.label === this.props.currency.activeCurrency.label
          ) {
            return (
              <React.Fragment key={price.currency}>
                {price.currency.symbol} {price.amount}
              </React.Fragment>
            );
          }
          return '';
        })}
      </p>
    );
  }

  renderProductSizesButtons(product, key) {
    const colorAttribute = product?.attributes?.filter(
      (attribute) => attribute.name === 'Color'
    );
    const allAttributesWithoutColor = product?.attributes?.filter(
      (attribute) => attribute.name !== 'Color'
    );
    return (
      <>
        {!!allAttributesWithoutColor.length && (
          <>
            {allAttributesWithoutColor.map((attribute) => (
              <div className={styles.size_section} key={attribute.name}>
                <p className={styles.size_title}>{attribute?.name}:</p>
                {attribute?.items.map((size) => (
                  <button
                    disabled={
                      product?.selectedAttributes[attribute?.name] ===
                      size?.value
                    }
                    onClick={() =>
                      this.resizeAttributeHandler(
                        product,
                        size,
                        key,
                        attribute?.name
                      )
                    }
                    key={size.id}
                    className={`${styles.size_button}  ${
                      product?.selectedAttributes[attribute?.name] ===
                      size?.value
                        ? styles.active_button_size
                        : ''
                    } ${
                      product.selectedAttributes[attribute?.name] === 'Capacity'
                        ? styles.capacity_size_button
                        : ' '
                    }
                    
                    `}
                    style={{
                      width: size.value.length > 2 ? '46px' : '24px',
                      cursor: 'pointer',
                    }}
                  >
                    {size.value}
                  </button>
                ))}
              </div>
            ))}
          </>
        )}

        {!!colorAttribute.length && (
          <div className={styles.size_section} key={colorAttribute[0]?.name}>
            <p className={styles.size_title}>{colorAttribute[0]?.name}:</p>
            {colorAttribute[0]?.items.map((size) => (
              <div
                className={`${styles.color_button_Wrapper} ${
                  product?.selectedAttributes[colorAttribute[0]?.name] ===
                  size?.value
                    ? styles.active_color
                    : ''
                }`}
                style={{cursor: 'pointer'}}
                key={size.id}
              >
                <button
                  disabled={
                    product?.selectedAttributes[colorAttribute[0]?.name] ===
                    size?.value
                  }
                  onClick={() =>
                    this.resizeAttributeHandler(
                      product,
                      size,
                      key,
                      colorAttribute[0]?.name
                    )
                  }
                  key={size.id}
                  style={{backgroundColor: size.value, cursor: 'pointer'}}
                  className={`${styles.color_button} 
                `}
                />
              </div>
            ))}
          </div>
        )}
      </>
    );
  }

  renderProductCounterButton(product) {
    return (
      <div className={styles.counter}>
        <button
          onClick={() => {
            this.addItem(product);
          }}
          className={styles.counter_increment}
        >
          +
        </button>
        {product.counter}
        <button
          onClick={() => {
            this.removeItem(product);
          }}
          className={styles.counter_decrement}
        >
          -
        </button>
      </div>
    );
  }

  renderTotalProductsPrice() {
    return (
      <div className={styles.total_box}>
        <div className={styles.total_title}>Total</div>
        <div className={styles.total_amount}>
          {this.props.currency.activeCurrency.symbol}
          {this.getTotal()}
        </div>
      </div>
    );
  }

  renderCartCheckoutButtons() {
    return (
      <div className={styles.checkout_view_bag_button}>
        <Link to={`/cart`}>
          <button
            onClick={this.props.cartSwitcherAction}
            className={styles.viewBag}
          >
            VIEW BAG
          </button>
        </Link>
        <button
          className={styles.checkout}
          onClick={this.props.cartSwitcherAction}
        >
          CHECKOUT
        </button>
      </div>
    );
  }

  renderProductBox(product, key) {
    return (
      <div className={styles.row + ' ' + styles.product_box}>
        <div className={styles.col_6}>
          <p className={styles.product_cart_brand}>{product.brand}</p>
          <p className={styles.product_cart_name}>{product.name}</p>
          {this.renderProductCartPrice(product)}
          {this.renderProductSizesButtons(product, key)}
        </div>
        <div
          className={`${styles.col_6} ${styles.cart_product} ${
            product?.attributes?.length > 2 ? styles.col_6_3_items : ''
          }`}
        >
          {this.renderProductCounterButton(product)}
          <div className={styles.product_cart_image}>
            <img src={product.gallery[0]} alt='' />
          </div>
        </div>
      </div>
    );
  }

  renderCartItems() {
    return (
      <ul className={styles.cart_items_list}>
        <li className={styles.cart_items_list_title}>
          <span style={{fontWeight: 'bold'}}>My Bag,</span>{' '}
          {this.props.cart.itemsCount} items
        </li>
        {Object.keys(this.props.cart.items).map((key, idx) => {
          let product = this.props.cart.items[key];
          return (
            <li
              className={`${styles.cart_list_item} ${
                product?.attributes?.length > 2 ? styles.cart_list_3item : ' '
              }`}
              key={product.id + idx}
            >
              {this.renderProductBox(product, key)}
            </li>
          );
        })}
      </ul>
    );
  }

  preventClose(event) {
    event.stopPropagation();
  }

  renderCartContent() {
    if (!this.props.toggleCartReducer) {
      return null;
    }
    if (Object.keys(this.props.cart).length) {
      return (
        <div className={styles.cart_items}>
          <div
            className={styles.cart_items_container}
            onClick={this.preventClose}
          >
            {this.renderCartItems()}
            {this.renderTotalProductsPrice()}
            {this.renderCartCheckoutButtons()}
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div className={styles.cart_box_navbar}>
        <div className={styles.cart_items_count}>
          <span>{this.props.cart.itemsCount}</span>
        </div>
        <img
          onClick={this.setActiveContextMenu}
          className={styles.navbar_cart_icon}
          src={'/img/cart_navbar.png'}
          alt=''
        />
        {this.renderCartContent()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currency: state.currency,
    cart: state.cart,
    toggleCartReducer: state.toggleCartReducer,
    currencySwitcherState: state.currencySwitcherReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addItemToCart: (item) => dispatch(AddItemToCart(item)),
    removeItemFromCart: (item) => dispatch(RemoveItemFromCart(item)),
    resizeItemFromCart: (item, newSize, attributeName, oldKey, newKey) =>
      dispatch(
        ResizeItemFromCart(item, newSize, attributeName, oldKey, newKey)
      ),
    cartSwitcherAction: () => dispatch(CartSwitcherAction()),
    currencySwitcherAction: () => dispatch(CurrencySwitcherAction()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CartOverlay);
