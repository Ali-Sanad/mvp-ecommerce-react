import React, {Component} from 'react';
import {connect} from 'react-redux';
import parser from 'html-react-parser';
import {withParams} from '../../utils/hoc';
import {AddItemToCart, getProductDercsiptionAction} from '../../actions';
import Spinner from '../spinner/Spinner';
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
      selectedAttributes: {},
      selectedImage: null,
      isLoading: false,
    };
    this.renderMainImage = this.renderMainImage.bind(this);
    this.renderPrice = this.renderPrice.bind(this);
    this.renderAttributesList = this.renderAttributesList.bind(this);
    this.addItem = this.addItem.bind(this);
    this.selectedAttributesHandler = this.selectedAttributesHandler.bind(this);
    this.renderProductDescription = this.renderProductDescription.bind(this);
    this.renderProductInfo = this.renderProductInfo.bind(this);
  }

  async componentDidMount() {
    try {
      const productId = this.props?.params?.id;
      this.setState({isLoading: true});
      await this.props.getProductDercsiptionAction(productId);
      this.setState({
        selectedImage: this.props.productDescription?.gallery[0],
        isLoading: false,
      });
    } catch (error) {
      this.setState({isLoading: true});
    }
  }

  selectedAttributesHandler(attributeName, value) {
    let clonedSelectedAttributes = JSON.parse(
      JSON.stringify(this.state.selectedAttributes)
    );
    clonedSelectedAttributes[attributeName] = value;
    this.setState((prev) => ({
      ...prev,
      selectedAttributes: clonedSelectedAttributes,
    }));
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

  renderAttributesList() {
    if (!this.props.productDescription?.attributes?.length) {
      return '';
    }
    const colorAttribute = this.props.productDescription?.attributes?.filter(
      (attribute) => attribute.name === 'Color'
    );
    const allAttributesWithoutColor =
      this.props.productDescription?.attributes?.filter(
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
                      this.selectedAttributesHandler(attribute.name, size.value)
                    }
                    key={size.id}
                    className={`${styles.size_button}  ${
                      this.state.selectedAttributes[size?.name] === size?.value
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
                  this.state?.selectedAttributes[size?.name] === size?.value
                    ? styles.active_color
                    : ''
                }`}
                style={{cursor: 'pointer'}}
              >
                <button
                  onClick={() =>
                    this.selectedAttributesHandler(
                      colorAttribute[0].name,
                      size.value
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

  addItem() {
    if (!this.props.productDescription) {
      return '';
    }
    let temp = Object.assign({}, this.props.productDescription);
    temp.selectedAttributes = this.state.selectedAttributes;
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
        {this.renderAttributesList()}
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
                style={{cursor: 'pointer'}}
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
                  style={{cursor: 'pointer'}}
                />
              </div>
            ) : (
              <img
                id='mainImage'
                className={styles.main_img}
                src={this.state.selectedImage}
                alt='Active product'
                style={{cursor: 'pointer'}}
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
    return this.state.isLoading ? <Spinner /> : this.renderProductDescription();
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withParams(ProductDescription));
