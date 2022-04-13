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
import styles from './CartOverlay.module.css';

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
    resizeItemFromCart: (item, newSize) =>
      dispatch(ResizeItemFromCart(item, newSize)),
    cartSwitcherAction: () => dispatch(CartSwitcherAction()),
    currencySwitcherAction: () => dispatch(CurrencySwitcherAction()),
  };
};

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
    this.selectedSize = this.selectedSize.bind(this);
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

  selectedSize(product, newSize) {
    this.props.resizeItemFromCart(product, newSize);
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

  renderProductSizesButtons(product) {
    return (
      <div className={styles.size_section}>
        {product.attributes[0]?.items[0].value.includes('#')
          ? product.attributes[0]?.items.map((size) => (
              <button
                onClick={() => this.selectedSize(product, size)}
                key={size.id}
                style={{backgroundColor: size.value}}
                className={`${styles.color_button} ${
                  product.selectedSize.value === size.value
                    ? styles.active_color_size
                    : ''
                }`}
              />
            )) // Else
          : product.attributes[0]?.items.map((size) => (
              <button
                onClick={() => this.selectedSize(product, size)}
                key={size.id}
                className={`${
                  product.attributes[0]?.id === 'Capacity'
                    ? styles.capacity_size_button
                    : styles.size_button
                } ${
                  product.selectedSize.value === size.value
                    ? styles.active_button_size
                    : ''
                }`}
                style={{width: size.value.length > 2 ? '34px' : '24px'}}
              >
                {size.value}
              </button>
            ))}
      </div>
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

  renderProductBox(product) {
    return (
      <div className={styles.row + ' ' + styles.product_box}>
        <div className={styles.col_6}>
          <p className={styles.product_cart_brand}>{product.brand}</p>
          <p className={styles.product_cart_name}>{product.name}</p>
          {this.renderProductCartPrice(product)}
          {this.renderProductSizesButtons(product)}
        </div>
        <div className={styles.col_6 + ' ' + styles.cart_product}>
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
          <span>My Bag,</span> {this.props.cart.itemsCount} items
        </li>
        {Object.keys(this.props.cart.items).map((key) => {
          let product = this.props.cart.items[key];
          return (
            <li
              className={styles.cart_list_item}
              key={product.id + product.selectedSize?.value}
            >
              {this.renderProductBox(product)}
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

export default connect(mapStateToProps, mapDispatchToProps)(CartOverlay);
