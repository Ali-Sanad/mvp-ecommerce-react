import React from 'react';
import CurrencySwitcher from '../currencySwitcher/CurrencySwitcher';
import {NavLink} from 'react-router-dom';
import CartOverlay from '../cartOverlay/CartOverlay';
import {connect} from 'react-redux';
import styles from './Navbar.module.css';
import {
  CartSwitcherAction,
  CurrencySwitcherAction,
  getCategoriesAction,
} from '../../actions';
import SvgIcon from './SvgIcon';

const mapStateToProps = (state) => {
  return {
    currency: state.currency,
    categories: state.categories,
    currencySwitcherState: state.currencySwitcherReducer,
    toggleCartReducer: state.toggleCartReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    currencySwitcherAction: () => dispatch(CurrencySwitcherAction()),
    cartSwitcherAction: () => dispatch(CartSwitcherAction()),
    getCategoriesAction: () => dispatch(getCategoriesAction()),
  };
};

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.renderNavigationLinks = this.renderNavigationLinks.bind(this);
    this.renderNavbar = this.renderNavbar.bind(this);
    this.renderNavbarCenterIcon = this.renderNavbarCenterIcon.bind(this);
  }

  componentDidMount() {
    this.props.getCategoriesAction();
  }

  renderNavigationLinks() {
    let links = this.props.categories?.data.map((category) => (
      <NavLink
        key={category.name}
        to={`/${category.name}`}
        className={({isActive}) => (isActive ? styles.navbar_link_active : '')}
      >
        {category.name}
      </NavLink>
    ));
    return links ?? [];
  }

  renderNavbarCenterIcon() {
    return (
      <div className={styles.icon}>
        <SvgIcon />
      </div>
    );
  }

  renderNavbar() {
    return (
      <nav className={styles.navbar}>
        <div className={styles.navbar_links}>
          {this.renderNavigationLinks()}
        </div>
        {this.renderNavbarCenterIcon()}
        <div className={styles.currency_cart}>
          <span className={styles.navbar_CurrencySign}>
            {this.props.currency.activeCurrency.symbol}
          </span>
          <CurrencySwitcher />
          <CartOverlay />
        </div>
      </nav>
    );
  }

  render() {
    return <div className={styles.navbar_container}>{this.renderNavbar()}</div>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
