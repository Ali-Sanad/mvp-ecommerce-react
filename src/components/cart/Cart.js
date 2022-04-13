import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  AddItemToCart,
  CartSwitcherAction,
  RemoveItemFromCart,
  ResizeItemFromCart,
} from '../../actions';
import styles from './Cart.module.css';

const mapStateToProps = (state) => {
  return {
    currency: state.currency,
    cart: state.cart,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addItemToCart: (item) => dispatch(AddItemToCart(item)),
    removeItemFromCart: (item) => dispatch(RemoveItemFromCart(item)),
    resizeItemFromCart: (item, newSize) =>
      dispatch(ResizeItemFromCart(item, newSize)),
    cartSwitcherAction: () => dispatch(CartSwitcherAction()),
  };
};

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardPageImageIndexes: {},
    };
    this.renderProductPrice = this.renderProductPrice.bind(this);
    this.selectedSizeHandler = this.selectedSizeHandler.bind(this);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.renderCartItems = this.renderCartItems.bind(this);
    this.nextProductImage = this.nextProductImage.bind(this);
    this.prevProductImage = this.prevProductImage.bind(this);
    this.setCardPageImageIndexes = this.setCardPageImageIndexes.bind(this);
    this.getCurrentProductImage = this.getCurrentProductImage.bind(this);
    this.renderProductSizesSwitcher =
      this.renderProductSizesSwitcher.bind(this);
    this.renderProductInCartImage = this.renderProductInCartImage.bind(this);
    this.renderMainProductData = this.renderMainProductData.bind(this);
  }

  componentDidMount() {
    this.setState({
      cardPageImageIndexes: this.setCardPageImageIndexes(),
    });
  }

  renderProductPrice(product) {
    const price = product.prices.find(
      (price) =>
        price.currency.label === this.props.currency.activeCurrency.label
    );
    return price.amount;
  }

  setCardPageImageIndexes() {
    return Object.keys(this.props.cart.items).reduce((newImageIndexes, key) => {
      newImageIndexes[key] = {
        currentIndex: 0,
        imageCount: this.props.cart.items[key].gallery.length,
      };
      return newImageIndexes;
    }, {});
  }

  addItem(product) {
    this.props.addItemToCart(product);
    this.forceUpdate();
  }

  removeItem(product) {
    this.props.removeItemFromCart(product);
    this.forceUpdate();
  }

  selectedSizeHandler(product, newSize, oldKey) {
    this.props.resizeItemFromCart(product, newSize);
    let newKey = product.id + '-' + newSize.value;
    let temp = {...this.state.cardPageImageIndexes};
    let newIndex = {...temp[oldKey]};
    delete temp[oldKey];
    temp[newKey] = newIndex;
    this.setState({
      cardPageImageIndexes: temp,
    });

    this.forceUpdate();
  }

  nextProductImage(key) {
    let temp = {...this.state.cardPageImageIndexes};
    if (temp[key].imageCount - 1 > temp[key].currentIndex) {
      temp[key].currentIndex++;
      this.setState({
        cardPageImageIndexes: temp,
      });
    }
  }

  prevProductImage(key) {
    let temp = {...this.state.cardPageImageIndexes};
    if (0 < temp[key].currentIndex) {
      temp[key].currentIndex--;
      this.setState({
        cardPageImageIndexes: temp,
      });
    }
  }

  getCurrentProductImage(key) {
    return this.state.cardPageImageIndexes[key]?.currentIndex;
  }

  renderProductSizesSwitcher(product, key) {
    return (
      <div className={styles.size_section}>
        {product.attributes[0]?.items[0].value.includes('#')
          ? product.attributes[0]?.items.map((size) => (
              <button
                onClick={() => this.selectedSizeHandler(product, size, key)}
                key={size.id}
                style={{backgroundColor: size.value}}
                className={`${styles.color_button}  ${
                  product.selectedSize.value === size.value
                    ? styles.active_color_size
                    : ''
                }`}
              />
            ))
          : product.attributes[0]?.items.map((size) => (
              <button
                onClick={() => this.selectedSizeHandler(product, size, key)}
                key={size.id}
                className={`${styles.size_button}  ${
                  product.selectedSize.value === size.value
                    ? styles.active_button_size
                    : ''
                }`}
              >
                {size.value}
              </button>
            ))}
      </div>
    );
  }

  renderProductInCartImage(product, key) {
    return (
      <div className={styles.product_bag_image}>
        <img
          onClick={() => {
            this.prevProductImage(key);
          }}
          style={
            this.state.cardPageImageIndexes[key]?.currentIndex === 0
              ? {display: 'none'}
              : {}
          }
          className={styles.bag_image_left_arrow}
          src={'/img/left_arrow.png'}
          alt=''
        />
        <img
          onClick={() => {
            this.nextProductImage(key);
          }}
          style={
            this.state.cardPageImageIndexes[key]?.currentIndex ===
            this.state.cardPageImageIndexes[key]?.imageCount - 1
              ? {display: 'none'}
              : {}
          }
          className={styles.bag_image_right_arrow}
          src={'/img/right_arrow.png'}
          alt=''
        />
        <img
          className={styles.bag_main_product_image}
          src={product.gallery[this.getCurrentProductImage(key)]}
          alt=''
        />
      </div>
    );
  }

  renderCartCounterButtons(product) {
    return (
      <div className={styles.bag_counter_buttons}>
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

  renderMainProductData(product) {
    return (
      <React.Fragment>
        <p className={styles.product_brand}>{product.brand}</p>
        <p className={styles.product_name}>{product.name}</p>
        <p className={styles.product_price}>
          {this.props.currency.activeCurrency.symbol}
          {this.renderProductPrice(product)}
        </p>
      </React.Fragment>
    );
  }

  renderCartItems() {
    return (
      <div className={styles.bag_container}>
        <h3 className={styles.cart_title}>
          <b>Cart</b>
        </h3>
        <ul className={styles.bag_list}>
          {Object.keys(this.props.cart.items).map((key) => {
            let product = this.props.cart.items[key];
            return (
              <React.Fragment key={key}>
                <hr className={styles.horizontal_line} />
                <li key={key} className={styles.bag_list_item}>
                  <div className={styles.left_side}>
                    {this.renderMainProductData(product)}
                    {this.renderProductSizesSwitcher(product, key)}
                  </div>
                  <div className={styles.right_side}>
                    {this.renderCartCounterButtons(product)}
                    {this.renderProductInCartImage(product, key)}
                  </div>
                </li>
              </React.Fragment>
            );
          })}
        </ul>
      </div>
    );
  }

  render() {
    return this.renderCartItems();
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
