import React, {Component} from 'react';
import {StyleSheet, AsyncStorage} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import I18n from '../../../I18n';
import {Images, Colors} from "../../../Themes";
import {NavigationActions} from "react-navigation";
import {ScreenKey,AsyncStoreKeys} from '../../../Constants';

const styles = StyleSheet.create({
    image: {
        width: 320,
        height: 320,
        tintColor: Colors.black
    },

    title: {
        color: Colors.black

    },
    description: {
        color: Colors.black
    },
    activeDotStyle: {
        backgroundColor: Colors.black
    },

    button: {
        color: Colors.black
    }

});

export default class Intro extends Component {

    constructor(props) {
        super(props);
        this.onPressDone = this.onPressDone.bind(this);
    }

    onPressDone() {
        AsyncStorage.setItem(AsyncStoreKeys.IS_STARTED, "true", (error =>{
            if(!error){
                this.props.navigation.dispatch({type: NavigationActions.RESET, routeName: ScreenKey.LOGIN_SCREEN});
            }
        }))
    }

    render() {

        const slides = [
            {
                key: 'step1',
                title: I18n.t("theApostlesCreed1Title"),
                titleStyle: styles.title,
                text: I18n.t("theApostlesCreed1Description"),
                image: Images.crown,
                imageStyle: styles.image,
                backgroundColor: Colors.white,
                textStyle: styles.description
            },
            {
                key: 'step2',
                title: I18n.t("theApostlesCreed2-1Title"),
                titleStyle: styles.title,
                text: I18n.t("theApostlesCreed2-1Description"),
                image: Images.cross,
                imageStyle: styles.image,
                backgroundColor: Colors.white,
                textStyle: styles.description
            },
            {
                key: 'step3',
                title: I18n.t("theApostlesCreed2-2Title"),
                titleStyle: styles.title,
                text: I18n.t("theApostlesCreed2-2Description"),
                image: Images.cross,
                imageStyle: styles.image,
                backgroundColor: Colors.white,
                textStyle: styles.description
            },
            {
                key: 'step4',
                title: I18n.t("theApostlesCreed3Title"),
                titleStyle: styles.title,
                text: I18n.t("theApostlesCreed3Description"),
                image: Images.church,
                imageStyle: styles.image,
                backgroundColor: Colors.white,
                textStyle: styles.description
            }
        ];

        return <AppIntroSlider buttonTextStyle={styles.button} activeDotStyle={styles.activeDotStyle} slides={slides}
                               doneLabel={I18n.t("accept")} nextLabel={I18n.t("next")} onDone={this.onPressDone}/>;
    }
}