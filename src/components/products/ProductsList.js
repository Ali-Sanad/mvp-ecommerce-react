import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withLocation, withParams} from '../../utils/hoc';
import {CurrencySwitcherAction, getProductsListAction} from '../../actions';
import Product from './Product';
import styles from './Product.module.css';

const mapStateToProps = (state) => {
  return {
    currency: state.currency,
    currencySwitcherState: state.currencySwitcherReducer,
    products: state.productsList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    currencySwitcherAction: () => dispatch(CurrencySwitcherAction()),
    getProductsListAction: () => dispatch(getProductsListAction()),
  };
};

class ProductsList extends Component {
  constructor(...props) {
    super(...props);
    this.state = {filteredProducts: []};
    this.renderAllProducts = this.renderAllProducts.bind(this);
    this.setCurrencySwitcherState = this.setCurrencySwitcherState.bind(this);
  }

  componentDidMount() {
    this.props.getProductsListAction();
  }

  renderAllProducts() {
    const filteredProducts = [];
    if (this.props.params !== undefined) {
      this.props.products?.products?.category?.products?.map((product) => {
        if (
          product.category === this.props.params.category ||
          this.props.params.category === 'all' ||
          this.props.location.pathname === '/'
        ) {
          filteredProducts.push(product);
        }
        return '';
      });
    } else {
      this.props.products?.products?.category?.products?.map((product) =>
        filteredProducts.push(product)
      );
    }

    return filteredProducts?.map((product) => (
      <div key={product.id} className='col-3'>
        <Product product={product} />
      </div>
    ));
  }

  setCurrencySwitcherState() {
    if (this.props.currencySwitcherState) {
      this.props.currencySwitcherAction();
    }
  }

  render() {
    return (
      <div className={styles.products_container}>
        <h3 className={styles.category_name}>
          {this.props.location.pathname === '/' && 'All'}
          {this.props.params && this.props?.params.category}
        </h3>
        <div className={styles.row}>{this.renderAllProducts()}</div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withParams(withLocation(ProductsList)));
