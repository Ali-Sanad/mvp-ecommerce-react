import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  AddItemToCart,
  CartSwitcherAction,
  removeItemData,
  RemoveItemFromCart,
  ResizeItemFromCart,
} from '../../actions';
import styles from './Cart.module.css';

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
    this.renderCartTotalProductsPriceAndQuantity =
      this.renderCartTotalProductsPriceAndQuantity.bind(this);
    this.getTotal = this.getTotal.bind(this);
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

  renderCartTotalProductsPriceAndQuantity() {
    return (
      <>
        <div className={styles.total_box}>
          <div className={styles.total_title}>Tax: </div>
          <div className={styles.total_amount}>
            {this.props.currency.activeCurrency.symbol} 15.00
          </div>
        </div>
        <div className={styles.total_box}>
          <div className={styles.total_title}>Qty: </div>
          <div className={styles.total_amount}>
            {this.props?.cart?.itemsCount}
          </div>
        </div>
        <div className={styles.total_box}>
          <div className={styles.total_title}>Total: </div>
          <div className={styles.total_amount}>
            {this.props.currency.activeCurrency.symbol}
            {this.getTotal()}
          </div>
        </div>
      </>
    );
  }

  renderOrderButton() {
    return (
      <div className={styles.checkout_view_bag_button}>
        <button className={styles.checkout} onClick={() => {}}>
          ORDER
        </button>
      </div>
    );
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

  selectedSizeHandler(product, newSize, oldKey, attributeName) {
    console.log({product, newSize, oldKey, attributeName});
    this.props.resizeItemFromCart(product, newSize, attributeName, oldKey);
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

  renderRemoveItemDataFromCartButton(id) {
    return (
      <div className={styles.remove_view_bag_button}>
        <button onClick={() => this.props.removeItemData(id)}>REMOVE</button>
      </div>
    );
  }

  renderProductSizesSwitcher(product, key) {
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
                    onClick={() =>
                      this.selectedSizeHandler(
                        product,
                        size,
                        key,
                        attribute.name
                      )
                    }
                    key={size.id}
                    className={`${styles.size_button}  ${
                      product?.selectedAttributes[attribute?.name] ===
                      size?.value
                        ? styles.active_button_size
                        : ''
                    }`}
                    style={{cursor: 'pointer'}}
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
                key={size.id}
                style={{cursor: 'pointer'}}
              >
                <button
                  onClick={() =>
                    this.selectedSizeHandler(
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

  renderProductInCartImage(product, key) {
    return (
      <div className={styles.product_bag_image}>
        <img
          onClick={() => {
            this.prevProductImage(key);
          }}
          // style={
          //   this.state.cardPageImageIndexes[key]?.currentIndex === 0
          //     ? {display: 'none'}
          //     : {}
          // }
          className={styles.bag_image_left_arrow}
          src={'/img/left_arrow.png'}
          alt=''
        />
        <img
          onClick={() => {
            this.nextProductImage(key);
          }}
          // style={
          //   this.state.cardPageImageIndexes[key]?.currentIndex ===
          //   this.state.cardPageImageIndexes[key]?.imageCount - 1
          //     ? {display: 'none'}
          //     : {}
          // }
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
                    {this.renderRemoveItemDataFromCartButton(key)}
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
        {this.props?.cart?.itemsCount > 0 ? (
          <>
            <hr className={styles.horizontal_line} />
            <div className={styles.totalProductsPriceAndQuantity}>
              {this.renderCartTotalProductsPriceAndQuantity()}
              {this.renderOrderButton()}
            </div>
          </>
        ) : (
          <h4 style={{marginTop: '50px', textAlign: 'center'}}>
            No Items Available in the Cart
          </h4>
        )}
      </div>
    );
  }

  render() {
    return this.renderCartItems();
  }
}

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
    resizeItemFromCart: (item, newSize, attributeName, oldKey) =>
      dispatch(ResizeItemFromCart(item, newSize, attributeName, oldKey)),
    cartSwitcherAction: () => dispatch(CartSwitcherAction()),
    removeItemData: (id) => dispatch(removeItemData(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
