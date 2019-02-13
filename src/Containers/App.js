import React, {PureComponent} from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import SplashScreen from 'react-native-smart-splash-screen';
import {Provider} from 'react-redux';
import {globalStyle} from "../Themes"
import {AppState, AsyncStorage, View, Platform} from "react-native"
import {TextBase} from "../Components/Common";
import Immutable from 'seamless-immutable';
import '../Config'
import DebugConfig from '../Config/DebugConfig';
import RootContainer from './RootContainer';
import {applyMiddleware, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import logger from "redux-logger"
import {persistReducer, persistStore, createTransform} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import I18n from "../I18n";
import {Colors} from "../Themes";
import {expAppReducer} from "../reducers";
import firebase from "react-native-firebase";
import DeviceInfo from 'react-native-device-info';

const whitelist = [
    "userReducer",
    "prayerReducer",
    "profilesReducer",
    "notificationReducer",
    "loginReducer",
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
        let _inboundState = inboundState;
        if (!Immutable.isImmutable(inboundState)) {
            _inboundState = Immutable(inboundState);
        }
        _inboundState = _inboundState.set("fetching", false);
        _inboundState = _inboundState.set("statusCode", null);
        _inboundState = _inboundState.set("message", null);
        return _inboundState;
    },
    // transform state being rehydrated
    (outboundState, key) => {
        // convert mySet back to a Set.
        let _outboundState = outboundState;
        if (!Immutable.isImmutable(_outboundState)) {
            _outboundState = Immutable(_outboundState);
        }
        _outboundState = _outboundState.set("fetching", false);
        _outboundState = _outboundState.set("statusCode", null);
        _outboundState = _outboundState.set("message", null);
        return _outboundState;
    },
    // define which reducers this transform gets called for.
    {whitelist: whitelist}
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
            store: store,
            pendingForUpdateServer: false,
            forceUpdateApp: false,
        };
    }


    componentWillMount() {
        const pathVersion = "app/version";
        firebase.firestore().doc(pathVersion).onSnapshot(snap => {
            if(snap.data()){
                const {android, ios} = snap.data();
                if (Platform.OS === "android") {
                    if (DeviceInfo.getBuildNumber() != android) {
                        this.setState({
                            forceUpdateApp: true
                        });
                    }
                    else {
                        this.setState({
                            forceUpdateApp: false
                        });
                    }
                }
            }
        });


        const pathStatus = "app/status";
        firebase.firestore().doc(pathStatus).onSnapshot(snap => {
            if (snap.data()) {
                const {serverStatusPending} = snap.data();
                if (serverStatusPending) {
                    this.setState({
                        pendingForUpdateServer: true
                    });
                }
                else {
                    this.setState({
                        pendingForUpdateServer: false
                    });

                }
            }
        });


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

    componentWillUpdate(nextProps, nextState) {
    }


    renderLoadingView(text) {
        return (
            <View style={styles.placeHolder}>
                <TextBase bold={true} large={true}
                          numberOfLines={5}> {text ? text : I18n.t("prayingForever")}</TextBase>
            </View>
        )
    }

    render() {

        const {isStoreLoading, forceUpdateApp, pendingForUpdateServer} = this.state;
        if (isStoreLoading) {
            return this.renderLoadingView()
        } else {

            if (forceUpdateApp) {
                return this.renderLoadingView(I18n.t("appNeedUpdate"))
            }
            if (pendingForUpdateServer) {
                return this.renderLoadingView(I18n.t("serverUpdating"))
            }
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


const styles = EStyleSheet.create({
    placeHolder: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.white,
        padding: "$padding",
    }
})