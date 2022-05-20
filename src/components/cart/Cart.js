import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  AddItemToCart,
  CartSwitcherAction,
  removeItemData,
  RemoveItemFromCart,
  ResizeItemFromCart,
} from '../../actions';
import isEqual from 'lodash/isEqual';
import styles from './Cart.module.css';

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productsInCartActiveImageIndexs: [],
    };
    this.renderProductPrice = this.renderProductPrice.bind(this);
    this.resizeAttributeHandler = this.resizeAttributeHandler.bind(this);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.renderCartItems = this.renderCartItems.bind(this);
    this.nextProductImage = this.nextProductImage.bind(this);
    this.prevProductImage = this.prevProductImage.bind(this);
    this.setProductInCartImageActiveIndexs =
      this.setProductInCartImageActiveIndexs.bind(this);
    this.getCurrentProductImageIndex =
      this.getCurrentProductImageIndex.bind(this);
    this.renderProductSizesSwitcher =
      this.renderProductSizesSwitcher.bind(this);
    this.renderProductInCartImage = this.renderProductInCartImage.bind(this);
    this.renderMainProductData = this.renderMainProductData.bind(this);
    this.renderCartTotalProductsPriceAndQuantity =
      this.renderCartTotalProductsPriceAndQuantity.bind(this);
    this.getTotal = this.getTotal.bind(this);
  }

  componentDidMount() {
    this.setProductInCartImageActiveIndexs();
  }

  renderProductPrice(product) {
    const price = product?.prices?.find(
      (price) =>
        price?.currency?.label === this.props.currency.activeCurrency.label
    );
    return price?.amount;
  }

  getTotal() {
    let total = 0;
    this.props.cart.products?.filter((product) => {
      let price = product?.prices.find(
        (price) =>
          price.currency.label === this.props.currency.activeCurrency.label
      );
      total += price?.amount * product?.count;
      return total;
    });
    return total.toFixed(2);
  }

  renderCartTotalProductsPriceAndQuantity() {
    return (
      <>
        <div className={styles.total_box}>
          <div className={styles.total_title}>Tax 21%: </div>
          <div className={styles.total_amount}>
            {this.props.currency.activeCurrency.symbol}
            {(this.getTotal() * 0.21).toFixed(2)}
          </div>
        </div>
        <div className={styles.total_box}>
          <div className={styles.total_title}>Qty: </div>
          <div className={styles.total_amount}>
            {this.props?.cart?.productsCount}
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

  setProductInCartImageActiveIndexs() {
    return this.props.cart.products?.map((product) => {
      return this.setState((prev) => ({
        productsInCartActiveImageIndexs: [
          ...prev.productsInCartActiveImageIndexs,
          {
            id: product.id,
            activeImageIndex: 0,
            selectedAttributes: product.selectedAttributes,
          },
        ],
      }));
    });
  }

  addItem(product) {
    this.props.addItemToCart(product);
    this.forceUpdate();
  }

  removeItem(product) {
    this.props.removeItemFromCart(product);
    this.forceUpdate();
  }

  resizeAttributeHandler(
    product,
    newSize,
    attributeName,
    oldSelectedAttributes
  ) {
    this.props.resizeItemFromCart(
      product,
      newSize,
      attributeName,
      oldSelectedAttributes
    );

    this.forceUpdate();
  }

  nextProductImage(product) {
    let currentActiveIndex = this.getCurrentProductImageIndex(product);
    if (currentActiveIndex === product.gallery.length - 1) {
      currentActiveIndex = 0;
    } else {
      currentActiveIndex++;
    }
    this.setState((prev) => ({
      productsInCartActiveImageIndexs: prev.productsInCartActiveImageIndexs.map(
        (item) => {
          if (
            item.id === product.id &&
            isEqual(item.selectedAttributes, product.selectedAttributes)
          ) {
            return {
              ...item,
              activeImageIndex: currentActiveIndex,
            };
          }
          return item;
        }
      ),
    }));
    this.forceUpdate();
  }

  prevProductImage(product) {
    let currentActiveIndex = this.getCurrentProductImageIndex(product);
    if (currentActiveIndex === 0) {
      currentActiveIndex = product.gallery.length - 1;
    } else {
      currentActiveIndex--;
    }
    this.setState((prev) => ({
      productsInCartActiveImageIndexs: prev.productsInCartActiveImageIndexs.map(
        (item) => {
          if (
            item.id === product.id &&
            isEqual(item.selectedAttributes, product.selectedAttributes)
          ) {
            return {
              ...item,
              activeImageIndex: currentActiveIndex,
            };
          }
          return item;
        }
      ),
    }));
    this.forceUpdate();
  }

  getCurrentProductImageIndex(product) {
    const activeIndex = this.state.productsInCartActiveImageIndexs?.filter(
      (productInCart) =>
        productInCart.id === product.id &&
        isEqual(productInCart.selectedAttributes, product.selectedAttributes)
    )[0]?.activeImageIndex;

    return activeIndex;
  }

  renderRemoveItemDataFromCartButton(product) {
    return (
      <div className={styles.remove_view_bag_button}>
        <button onClick={() => this.props.removeItemData(product)}>
          REMOVE
        </button>
      </div>
    );
  }

  renderProductSizesSwitcher(product) {
    const colorAttribute = product?.attributes?.filter(
      (attribute) => attribute.name === 'Color'
    );
    const allAttributesWithoutColor = product?.attributes?.filter(
      (attribute) => attribute.name !== 'Color'
    );
    return (
      <>
        {!!allAttributesWithoutColor?.length && (
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
                        attribute?.name,
                        product?.selectedAttributes
                      )
                    }
                    key={size.id}
                    className={`${styles.size_button}  ${
                      product?.selectedAttributes[attribute?.name] ===
                      size?.value
                        ? styles.active_button_size
                        : ''
                    }`}
                  >
                    {size.value}
                  </button>
                ))}
              </div>
            ))}
          </>
        )}

        {!!colorAttribute?.length && (
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
                      colorAttribute[0]?.name,
                      product?.selectedAttributes
                    )
                  }
                  key={size.id}
                  style={{backgroundColor: size.value}}
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

  renderProductInCartImage(product) {
    return (
      <div className={styles.product_bag_image}>
        <img
          onClick={() => {
            this.prevProductImage(product);
          }}
          className={styles.bag_image_left_arrow}
          src={'/img/left_arrow.png'}
          alt=''
        />
        <img
          onClick={() => {
            this.nextProductImage(product);
          }}
          className={styles.bag_image_right_arrow}
          src={'/img/right_arrow.png'}
          alt=''
        />
        <img
          className={styles.bag_main_product_image}
          src={product?.gallery[this.getCurrentProductImageIndex(product)]}
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
        {product.count}
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
          {this.props.cart.products?.map((product, idx) => {
            return (
              <React.Fragment key={product.id + idx}>
                <hr className={styles.horizontal_line} />
                <li key={product.id + idx} className={styles.bag_list_item}>
                  <div className={styles.left_side}>
                    {this.renderMainProductData(product)}
                    {this.renderProductSizesSwitcher(product)}
                    {this.renderRemoveItemDataFromCartButton(product)}
                  </div>
                  <div className={styles.right_side}>
                    {this.renderCartCounterButtons(product)}
                    {this.renderProductInCartImage(product)}
                  </div>
                </li>
              </React.Fragment>
            );
          })}
        </ul>
        {this.props?.cart?.productsCount > 0 ? (
          <>
            <hr className={styles.horizontal_line} />
            <div className={styles.totalProductsPriceAndQuantity}>
              {this.renderCartTotalProductsPriceAndQuantity()}
              {this.renderOrderButton()}
            </div>
          </>
        ) : (
          <h4 className={styles.noItemsInCart}>
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
    resizeItemFromCart: (item, newSize, attributeName, oldKey, newKey) =>
      dispatch(
        ResizeItemFromCart(item, newSize, attributeName, oldKey, newKey)
      ),
    cartSwitcherAction: () => dispatch(CartSwitcherAction()),
    removeItemData: (id) => dispatch(removeItemData(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
