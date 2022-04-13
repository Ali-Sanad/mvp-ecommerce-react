import React from 'react';
import {
  changeCurrency,
  CurrencySwitcherAction,
  getCurrenciesAction,
} from '../../actions';
import {connect} from 'react-redux';
import styles from './CurrencySwitcher.module.css';

const mapStateToProps = (state) => {
  return {
    currency: state.currency,
    currencySwitcherState: state.currencySwitcherReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    currencyChange: (name) => dispatch(changeCurrency(name)),
    currencySwitcherAction: () => dispatch(CurrencySwitcherAction()),
    getCurrenciesAction: () => dispatch(getCurrenciesAction()),
  };
};

class CurrencySwitcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
    this.renderCurrencyContextMenu = this.renderCurrencyContextMenu.bind(this);
    // this.getCurrencies = this.getCurrencies.bind(this);
    this.renderArrow = this.renderArrow.bind(this);
    this.showContextMenu = this.showContextMenu.bind(this);
    this.changeCurrency = this.changeCurrency.bind(this);
  }

  componentDidMount() {
    this.props.getCurrenciesAction();
  }

  showContextMenu() {
    this.props.currencySwitcherAction();
    this.setState((state) => ({
      active: !state.active,
    }));
  }

  changeCurrency(currency) {
    this.props.currencyChange(currency);
    this.props.currencySwitcherAction();
    this.setState({
      active: false,
    });
  }

  renderCurrencyContextMenu() {
    if (!this.props.currencySwitcherState || !this.state.active) {
      return null;
    }
    return (
      <div>
        <ul className={styles.currencyContextMenu}>
          {this.props.currency?.currencies.map((cur) => (
            <li
              key={cur.label}
              onClick={() => {
                this.changeCurrency(cur);
              }}
            >
              <span>
                {cur.symbol} {cur.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  renderArrow() {
    if (this.state.active && this.props.currencySwitcherState) {
      return (
        <img src={'/img/arrowUP.png'} alt='' style={{cursor: 'pointer'}} />
      );
    }
    return <img src={'/img/arrow.png'} alt='' style={{cursor: 'pointer'}} />;
  }

  renderSelector() {
    return (
      <div className={styles.currencySelector} onClick={this.showContextMenu}>
        {this.renderArrow()}
        {this.renderCurrencyContextMenu()}
      </div>
    );
  }

  render() {
    return this.renderSelector();
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrencySwitcher);
