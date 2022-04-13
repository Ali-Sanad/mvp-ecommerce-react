import React, {Component} from 'react';
import {connect} from 'react-redux';
import parser from 'html-react-parser';
import {withParams} from '../../utils/hoc';
import {AddItemToCart, getProductDercsiptionAction} from '../../actions';
import styles from './Product.module.css';

const mapStateToProps = (state) => {
  return {
    currency: state.currency,
    cart: state.cart,
    productDescription: state.productsList.productDescription,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addItemToCart: (item) => dispatch(AddItemToCart(item)),
    getProductDercsiptionAction: (id) =>
      dispatch(getProductDercsiptionAction(id)),
  };
};

class ProductDescription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSize: null,
      selectedImage: null,
    };
    this.renderMainImage = this.renderMainImage.bind(this);
    this.renderPrice = this.renderPrice.bind(this);
    this.renderSizeList = this.renderSizeList.bind(this);
    this.addItem = this.addItem.bind(this);
    this.selectedSizeHandler = this.selectedSizeHandler.bind(this);
    this.renderProductDescription = this.renderProductDescription.bind(this);
    this.renderProductInfo = this.renderProductInfo.bind(this);
  }

  async componentDidMount() {
    const productId = this.props?.params?.id;
    await this.props.getProductDercsiptionAction(productId);

    this.setState({
      selectedImage: this.props.productDescription?.gallery[0],
      selectedSize: this.props.productDescription?.attributes[0]?.items[0],
    });
  }

  selectedSizeHandler(size) {
    this.setState({
      selectedSize: size,
    });
  }

  renderMainImage(image) {
    this.setState({
      selectedImage: image,
    });
  }

  renderPrice() {
    if (this.props?.productDescription?.id === undefined) return;
    let price = this.props.productDescription?.prices?.find((price) => {
      if (price.currency.label === this.props.currency.activeCurrency.label) {
        return price;
      }
      return '';
    });

    if (price?.amount === undefined) {
      price = this.props.productDescription?.prices[0];
    }
    return (
      <p className={styles.price}>
        {price?.currency?.symbol}
        {price?.amount}
      </p>
    );
  }

  renderSizeList() {
    if (!this.props.productDescription?.attributes?.length) {
      return '';
    }

    return (
      <div className={styles.size_section}>
        <p className={styles.size_title}>
          {this.props.productDescription?.attributes[0]?.name}:
        </p>
        {this.props.productDescription?.attributes[0]?.items[0].value.includes(
          '#'
        )
          ? this.props.productDescription?.attributes[0]?.items.map((size) => (
              <button
                onClick={() => this.selectedSizeHandler(size)}
                key={size.id}
                style={{backgroundColor: size.value}}
                className={`${styles.color_button}  ${
                  this.state?.selectedSize?.id === size?.id
                    ? styles.active_color_size
                    : ''
                }`}
              />
            ))
          : this.props.productDescription?.attributes[0]?.items.map((size) => (
              <button
                onClick={() => this.selectedSizeHandler(size)}
                key={size.id}
                className={`${styles.size_button}  ${
                  this.state?.selectedSize?.id === size?.id
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

  addItem() {
    if (!this.props.productDescription) {
      return '';
    }
    let temp = Object.assign({}, this.props.productDescription);
    temp.selectedSize =
      this.state.selectedSize ??
      this.props.productDescription?.attributes[0]?.items[0];
    this.props.addItemToCart(temp);
  }

  renderProductInfo() {
    return (
      <div className={`${styles.col_3} ${styles.product_info}`}>
        <p className={styles.product_title}>
          {this.props.productDescription?.brand}
        </p>
        <p className={styles.product_name}>
          {this.props.productDescription?.name}
        </p>
        {this.renderSizeList()}
        <div className={styles.price_section}>
          <p className={styles.price_title}>PRICE:</p>
          {this.renderPrice()}
        </div>
        <button
          className={
            this.props.productDescription?.inStock
              ? styles.add_cart_button
              : styles.add_cart_button_disabled
          }
          onClick={
            this.props.productDescription?.inStock ? this.addItem : () => {}
          }
        >
          ADD TO CART
        </button>
        <div className={styles.product_desc}>
          {this.props.productDescription?.description
            ? parser(this.props.productDescription?.description)
            : ''}
        </div>
      </div>
    );
  }

  renderProductDescription() {
    return (
      <div className={styles.PDP}>
        <div className={styles.row}>
          <div className={styles.md}>
            {this.props.productDescription?.gallery?.map((image) => (
              <img
                key={image}
                onClick={() => this.renderMainImage(image)}
                className={styles.img_slider}
                src={image}
                alt='Product Thumbnail'
              />
            ))}
          </div>
          <div className={styles.col_6}>
            {!this.props.productDescription?.inStock ? (
              <div className={styles.inStock_box}>
                <p className={styles.inStock}>OUT OF STOCK</p>
                <img
                  id='mainImage'
                  className={styles.main_img}
                  src={this.state.selectedImage}
                  alt='Active product'
                />
              </div>
            ) : (
              <img
                id='mainImage'
                className={styles.main_img}
                src={this.state.selectedImage}
                alt='Active product'
              />
            )}
          </div>
          <div className={`${styles.col_1} ${styles.sm}`}>
            {this.props.productDescription?.gallery?.map((image) => (
              <img
                key={image}
                onClick={() => this.renderMainImage(image)}
                className={styles.img_slider}
                src={image}
                alt='Product Thumbnail mobile'
              />
            ))}
          </div>
          {this.renderProductInfo()}
        </div>
      </div>
    );
  }

  render() {
    return this.renderProductDescription();
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withParams(ProductDescription));
