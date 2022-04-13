import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {AddItemToCart} from '../../actions';
import styles from './Product.module.css';
const mapStateToProps = (state) => {
  return {
    currency: state.currency,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addItemToCart: (item) => dispatch(AddItemToCart(item)),
  };
};

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderPrice = this.renderPrice.bind(this);
    this.renderProduct = this.renderProduct.bind(this);
    this.renderProductInfo = this.renderProductInfo.bind(this);
    this.addItem = this.addItem.bind(this);
  }

  renderPrice() {
    let price = this.props.product.prices.find((price) => {
      if (price.currency.label === this.props.currency.activeCurrency.label) {
        return price;
      } else {
        return '';
      }
    });
    if (price === undefined) price = this.props.product.prices[0];
    return (
      <p>
        <span>{price.currency.symbol}</span>
        {price.amount}
      </p>
    );
  }

  addItem() {
    if (!this.props.product) {
      return '';
    }
    let temp = Object.assign({}, this.props.product);

    temp.selectedSize = temp.attributes[0]?.items[0];
    this.props.addItemToCart(temp);
  }

  renderProductInfo() {
    return (
      <React.Fragment>
        <img
          className={styles.product_image}
          src={this.props.product.gallery[0]}
          alt=''
        />
        <p className={styles.product_card_title}>{this.props.product.name}</p>
        <span className={styles.product_card_price}>{this.renderPrice()}</span>
      </React.Fragment>
    );
  }

  renderProduct() {
    return (
      <div id='product' className={styles.product_card}>
        <img
          onClick={this.props.product.inStock ? this.addItem : () => {}}
          style={{
            opacity: this.props.product.inStock ? '1' : '0',
            cursor: 'pointer',
          }}
          className={styles.product_cart_icon}
          src={'/img/cart.png'}
          alt=''
        />
        {this.props.product.inStock ? (
          <Link to={`/product/${this.props.product.id}`}>
            {this.renderProductInfo()}
          </Link>
        ) : (
          <Link to={`/product/${this.props.product.id}`}>
            <div className={styles.inStock_box}>
              <p className={styles.inStock}>OUT OF STOCK</p>
              {this.renderProductInfo()}
            </div>
          </Link>
        )}
      </div>
    );
  }

  render() {
    return this.renderProduct();
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Product);
