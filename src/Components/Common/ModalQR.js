import React from "react";
import ModalBase from "./ModalBase";
import EStyleSheet from 'react-native-extended-stylesheet';
import {View, ActivityIndicator, TouchableOpacity} from "react-native";
import {Colors, globalStyle, ApplicationStyles, Metrics} from "../../Themes";
import PropTypes from 'prop-types';
import Title from "./Title";;
import PlaceHolder from "./PlaceHolder";
import Text from "./Text";
import I18n from '../../I18n';
import QRCode from 'react-native-qrcode';
import {ButtonFooter} from "../Modules";


export default class ModalQR extends ModalBase {

    constructor(props) {
        super();
    }

    open(text) {
        this.setState({
            text : text
        });
        super.open();
    }

    renderContent() {
        return (
            <View
                style={styles.container}>
                <View style={styles.topView}>
                    <Title>{I18n.t("QRCode")}</Title>
                </View>
                <Text>{I18n.t("scanQRCodeIntro")}</Text>
                <View style={styles.QRCodeView}>
                    <QRCode
                        value={this.state.text}
                        size={Metrics.screenWidth * 0.75}
                        bgColor='black'
                        fgColor='white'/>
                </View>
                <ButtonFooter  onPress={this.close} text ={I18n.t("cancel")}/>
            </View>
        )
    }
}

ModalQR.defaultProps = {}

ModalQR.propTypes = {}


const styles = EStyleSheet.create({


    container: {
        height: "100%",
        width: Metrics.screenWidth,
        backgroundColor: Colors.white,
        alignItems: "center",
        justifyContent: "center"
    },

    topView: {
        height: "$heightRowNormal",
        alignItems: "center"
    },

    QRCodeView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    bottomView: {
        backgroundColor: "transparent",
        height: "$heightRowNormal",
        alignItems: "center"
    }

});