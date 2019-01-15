import React, {PureComponent} from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import SplashScreen from 'react-native-smart-splash-screen';
import {Provider} from 'react-redux';
import {globalStyle} from "../Themes"
import {AppState, AsyncStorage,View} from "react-native"
import {TextBase} from "../Components/Common";

import '../Config'
import DebugConfig from '../Config/DebugConfig'

import RootContainer from './RootContainer';

import {applyMiddleware, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import logger from "redux-logger"
import {persistReducer, persistStore, getStoredState} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import I18n from "../I18n";
import {Colors} from "../Themes";

import {expAppReducer} from "../reducers"

const whitelist = [
    "userReducer"
]

// Load middleware
let middleware = [
    thunk,// Allows action creators to return functions (not just plain objects)
    logger
];

// Init redux store (using the given reducer & middleware)


const persistConfig = {
    key: 'root',
    storage: storage,
    whitelist: whitelist,
    stateReconciler: autoMergeLevel2, // see "Merge Process" section for details.
    // getStoredState:
    //     (persistConfig,(err, initialState) => {
    //         const initialImmutableState = {};
    //         whitelist.forEach((key) => {
    //             if (initialState[key]) initialImmutableState[key] = initialState[key];
    //         });
    //         const store = createStore(pReducer, initialImmutableState);
    //         // const store = compose(
    //         //     applyMiddleware(...middleware)
    //         // )(createStore)(pReducer);
    //         persistStore(store, persistConfig)
    //
    //     })
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