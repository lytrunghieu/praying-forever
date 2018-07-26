
import React, { PureComponent } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import SplashScreen from 'react-native-smart-splash-screen';
import { Provider } from 'react-redux';
import {globalStyle} from "../Themes"

import '../Config'
import DebugConfig from '../Config/DebugConfig'

import RootContainer from './RootContainer';

import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import {expAppReducer} from "../reducers"


// Load middleware
let middleware = [
    thunk // Allows action creators to return functions (not just plain objects)
];

// Init redux store (using the given reducer & middleware)
const store = compose(
    applyMiddleware(...middleware)
)(createStore)(expAppReducer);

EStyleSheet.build(globalStyle);
// create our store

class App extends PureComponent {

  componentDidMount() {
    SplashScreen.close({
      animationType: SplashScreen.animationType.scale,
      duration: 850,
      delay: 500
    })
  }

  render() {
    return (
      <Provider store={store}>
        <RootContainer/>
      </Provider>
    )
  }
}

// allow reactotron overlay for fast design in dev mode
export default DebugConfig.useReactotron
  ? console.tron.overlay(App)
  : App