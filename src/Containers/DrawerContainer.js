// Libraries
import React, {PureComponent} from 'react'
import {StyleSheet, Text, View, Image, ScrollView} from 'react-native'
import {connect} from 'react-redux';
import I18n from '../I18n';
import {ScreenKey} from '../Constants';
import {Images, Colors, Metrics} from '../Themes';
import {Option} from "../Components/Common";
import firebase from 'react-native-firebase';
import {NavigationActions} from "react-navigation";

class DrawerContainer extends PureComponent {

    constructor(props) {
        super();
        this.onPressLogout = this.onPressLogout.bind(this);
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
        const praysFinished = prays.filter(e => e.isFinished);

        return (
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.body}>
                    <Option text={I18n.t("inprogress")} count={prays.length - praysFinished.length}
                            leftIcon={Images.inProgress}
                            onPress={this.onPressOption.bind(this, ScreenKey.PRAYING_INPROGESS)}/>
                    <Option text={I18n.t("finished")} count={praysFinished.length} leftIcon={Images.complete}
                            onPress={this.onPressOption.bind(this, ScreenKey.PRAY_FINISHED)}/>
                    <Option text={I18n.t("about")} leftIcon={Images.about}/>
                    <Option text={I18n.t("setting")} leftIcon={Images.setting}/>
                    <Option text={I18n.t("logout")} leftIcon={Images.setting} onPress={this.onPressLogout}/>
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
    return {}
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
