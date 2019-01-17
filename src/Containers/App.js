import React, {PureComponent} from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import SplashScreen from 'react-native-smart-splash-screen';
import {Provider} from 'react-redux';
import {globalStyle} from "../Themes"
import {AppState, AsyncStorage,View} from "react-native"
import {TextBase} from "../Components/Common";
import Immutable from 'seamless-immutable';

import '../Config'
import DebugConfig from '../Config/DebugConfig'

import RootContainer from './RootContainer';

import {applyMiddleware, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import logger from "redux-logger"
import {persistReducer, persistStore, getStoredState, createTransform} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import I18n from "../I18n";
import {Colors} from "../Themes";
import {expAppReducer} from "../reducers";
import firebase  from "react-native-firebase";
const whitelist = [
    "userReducer",
    "prayerReducer",
    "notificationReducer",
]

// Load middleware
let middleware = [
    thunk,// Allows action creators to return functions (not just plain objects)
    logger
];

// custome state return
const myTransform = createTransform(
    // transform state on its way to being serialized and persisted.
    (inboundState, key) => {
        // convert mySet to an Array.
        let _inboundState= inboundState;
        if(!Immutable.isImmutable(inboundState)){
            _inboundState = Immutable(inboundState);
        }
        return _inboundState;
    },
    // transform state being rehydrated
    (outboundState, key) => {
        // convert mySet back to a Set.
        let _outboundState= outboundState;
        if(!Immutable.isImmutable(_outboundState)){
            _outboundState = Immutable(_outboundState);
        }
        return  _outboundState;
    },
    // define which reducers this transform gets called for.
    { whitelist: whitelist }
);

// Init redux store (using the given reducer & middleware)

const persistConfig = {
    key: 'root',
    storage: storage,
    whitelist: whitelist,
    // stateReconciler: autoMergeLevel2, // see "Merge Process" section for details.
    transforms: [myTransform],
};

const pReducer = persistReducer(persistConfig, expAppReducer);

EStyleSheet.build(globalStyle);

// create our store

const store = compose(
    applyMiddleware(...middleware)
)(createStore)(pReducer);

class App extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isStoreLoading: true,
            store: store
        }
    }

    componentWillMount() {
        const persistor = persistStore(store, null, cb => {
            this.setState({isStoreLoading: false});
        });

    }

    componentDidMount() {
        SplashScreen.close({
            animationType: SplashScreen.animationType.scale,
            duration: 850,
            delay: 500
        });
    }

    componentWillUnmount() {
    }

    renderLoadingView (){
        return (
            <View style ={{flex : 1 , alignItems:"center",justifyContent:"center" , backgroundColor:Colors.white}}>
                <TextBase>{I18n.t("prayingForever")}</TextBase>
            </View>
        )
    }

    render() {
        if (this.state.isStoreLoading) {
            return this.renderLoadingView()
        } else {
            return (

                <Provider store={this.state.store}>
                    <RootContainer/>
                </Provider>
            )
        }
    }
}

// allow reactotron overlay for fast design in dev mode
export default DebugConfig.useReactotron
    ? console.tron.overlay(App)
    : App