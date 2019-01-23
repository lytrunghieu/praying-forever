import React from "react";
import ModalBase from "../Common/ModalBase";
import EStyleSheet from 'react-native-extended-stylesheet';
import {View,Text} from "react-native";
import {Colors, Metrics} from "../../Themes/index";
import TextBase from "../Common/TextBase";
import I18n from '../../I18n/index';
import QRCode from 'react-native-qrcode';
import {ButtonFooter} from "./index";


export default class ModalQR extends ModalBase {

    constructor(props) {
        super();
    }

    open(text) {
        this.setState({
            text: text
        });
        super.open();
    }

    renderContent() {
        return (
            <View
                style={styles.container}>
                <View style ={styles.topView}>
                <TextBase largeX={true} bold={true}>{I18n.t("QRCode")}</TextBase>
                <TextBase large={true} bold={true}>{I18n.t("scanQRCodeIntro")}</TextBase>
                </View>
                <View style ={styles.QRCodeView}>
                <QRCode
                    value={this.state.text}
                    size={Metrics.screenWidth * 0.75}
                    bgColor='black'
                    fgColor='white'/>
                </View>
                <ButtonFooter onPress={this.close} text={I18n.t("cancel")}/>
            </View>
        )
    }
}

ModalQR.defaultProps = {}

ModalQR.propTypes = {}


const styles = EStyleSheet.create({


    container: {
        height:"100%",
        width: Metrics.screenWidth,
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: Colors.white,

    },

    topView: {
        alignItems: "center",
        justifyContent: "center",
    },

    QRCodeView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        overflow:'hidden'

    },

    bottomView: {
        backgroundColor: "transparent",
        height: "$heightRowNormal",
        alignItems: "center"
    }

});