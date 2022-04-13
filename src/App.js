import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {CurrencySwitcherAction, CartSwitcherAction} from './actions';
import {connect} from 'react-redux';
import client from './utils/api';

//components
import Navbar from './components/navbar/Navbar';
//pages
import {Cart, PLP, PDP} from './pages';

import './App.css';

const mapStateToProps = (props) => {
  return {
    currencySwitcherState: props.currencySwitcherReducer,
    toggleCartReducer: props.toggleCartReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    currencySwitcherAction: () => dispatch(CurrencySwitcherAction()),
    cartSwitcherAction: () => dispatch(CartSwitcherAction()),
  };
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      client: client,
    };
  }

  setCurrencyCartSwitcherState() {
    if (this.props.currencySwitcherState) {
      this.props.currencySwitcherAction();
    }

    if (this.props.toggleCartReducer) {
      this.props.cartSwitcherAction();
    }
  }

  render() {
    return (
      <BrowserRouter>
        <div
          className='App'
          onClick={() => this.setCurrencyCartSwitcherState()}
        >
          <Navbar client={this.state.client} />
          <Routes>
            <Route path='/' element={<PLP client={this.state.client} />} />
            <Route
              path='/:category'
              element={<PLP client={this.state.client} />}
            />
            <Route
              path='/product/:id'
              element={<PDP client={this.state.client} />}
            />
            <Route path='/cart' element={<Cart />} />

            <Route path='*' element={<PLP client={this.state.client} />} />
          </Routes>
        </div>
      </BrowserRouter>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
