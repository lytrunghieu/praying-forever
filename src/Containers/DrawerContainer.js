// Libraries
import React, {PureComponent} from 'react'
import {StyleSheet, Text, View, Image, ScrollView} from 'react-native'
import {connect} from 'react-redux';
import I18n from '../I18n';
import {ScreenKey, StatusOfPray} from '../Constants';
import {Images, Colors, Metrics} from '../Themes';
import {Option} from "../Components/Common";
import firebase from 'react-native-firebase';
import {NavigationActions} from "react-navigation";
import {bindActionCreators} from 'redux';
import {CommonActions} from '../actions';
import {Pray} from "../model";
import {EventRegisterTypes} from "../Constants";
import {EventRegister} from 'react-native-event-listeners';

const collect = firebase.firestore().collection('pray');

class DrawerContainer extends PureComponent {

    constructor(props) {
        super();
        this.onPressLogout = this.onPressLogout.bind(this);
    }

    componentDidMount() {
        const docOfCurrentUserPray = collect.doc(firebase.auth().currentUser.uid);
        docOfCurrentUserPray.collection("data").onSnapshot(snapshot => {
            let prayList = [];
            snapshot.forEach(e => {
                let data = new Pray({...e.data(), uid: e.id});
                if (data.owner && data.owner.uid == firebase.auth().currentUser.uid) {
                    prayList.push(data);
                }
            });

            if (prayList) {
                this.props.commonActions.updatePrayList(prayList);
            }
        });

        //Listen event
        this.listener = EventRegister.addEventListener("listener", async (action) => {

            if (!action || !action.type) {
                return;
            }

            const {type, params, callback} = action;
            switch (type) {
                case EventRegisterTypes.DELETE_ALL_PRAY_COMPLETED : {
                    const {isInprogress} = params;
                    const statusSelected = isInprogress ? StatusOfPray.INPROGRESS : StatusOfPray.COMPLETE;
                    docOfCurrentUserPray.collection("data").get().then(res => {
                        let docs = res.docs
                        docs.map(doc => {
                            const docRef = doc.ref;
                            const data = doc.data();
                            if (data.status === statusSelected) {
                                docRef.delete();
                            }
                        })
                    });
                    break;
                }

                case EventRegisterTypes.DELETE_PRAY : {
                    const {uid} = params;
                    const currentPray = docOfCurrentUserPray.collection("data").doc(uid);
                    currentPray.delete();
                    break;
                }

                case EventRegisterTypes.UPDATE_STATUS_PRAY : {
                    const {uid, status} = params;
                    const currentPray = docOfCurrentUserPray.collection("data").doc(uid);
                    currentPray.update("status", status).then(res => {
                        if (callback) {
                            callback({success: true, data: res});
                        }
                    });
                    break;
                }

                default : {
                    break;
                }

            }

        });
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.listener);
    }

    //region handle action press

    onPressOption(screen) {
        const {navigation: {navigate}} = this.props;
        navigate(screen);
    }

    onPressLogout() {
        firebase.auth().signOut().then(res => {
            this.props.navigation.dispatch({type: NavigationActions.RESET, routeName: ScreenKey.LOGIN_SCREEN});
        }).catch(err => {
            alert(err);
        });
    }

    //endregion

    render() {
        const {navigation: {navigate}, logout, activeItemKey, prays} = this.props;
        const praysFinished = prays.filter(e => e.status == StatusOfPray.COMPLETE);

        return (
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.body}>
                    <Option text={I18n.t("inprogress")} count={prays.length - praysFinished.length}
                            leftIcon={Images.inProgress}
                            onPress={this.onPressOption.bind(this, ScreenKey.PRAYING_INPROGESS)}/>
                    <Option text={I18n.t("finished")} count={praysFinished.length} leftIcon={Images.complete}
                            onPress={this.onPressOption.bind(this, ScreenKey.PRAY_FINISHED)}/>
                    <Option text={I18n.t("prayForOther")} leftIcon={Images.complete}
                            onPress={this.onPressOption.bind(this, ScreenKey.PRAY_FOR_OTHER)}/>
                    <Option text={I18n.t("setting")} leftIcon={Images.setting}/>
                    <Option text={I18n.t("about")} leftIcon={Images.about}/>
                    <Option text={I18n.t("logout")} leftIcon={Images.logout} onPress={this.onPressLogout}/>
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        prays: state.commonReducer.prays
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        commonActions: bindActionCreators(CommonActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContainer);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    body: {
        flex: 0.6
    }
})
