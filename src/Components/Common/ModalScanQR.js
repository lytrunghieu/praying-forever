import React from "react";
import ModalBase from "./ModalBase";
import EStyleSheet from 'react-native-extended-stylesheet';
import {View, ActivityIndicator, TouchableOpacity, Text} from "react-native";
import {Colors, globalStyle, ApplicationStyles} from "../../Themes";
import PropTypes from 'prop-types';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Title from "./Title";
import Button from "./Button";
import I18n from '../../I18n';

export default class ModalScanQR extends ModalBase {

    constructor(props) {
        super();
    }

    onSuccess(e) {
        console.log(e);
    }

    renderContent() {
        return (<View
                style={styles.container}
            >
                <QRCodeScanner
                    topContent={
                        <Title>{I18n.t("scanQRCode")}</Title>
                    }
                    fadeIn={false}
                    topViewStyle={styles.topView}
                    onRead={this.onSuccess.bind(this)}
                    showMarker={true}
                    // containerStyle={}
                    cameraStyle={styles.cameraStyle}
                    markerStyle={styles.marker}
                    bottomViewStyle={styles.bottomView}
                    bottomContent={
                        <Button onPress={this.close} text={I18n.t("cancel")}/>
                    }
                />
            </View>
        )
    }
}

ModalScanQR.defaultProps = {}

ModalScanQR.propTypes = {}


const styles = EStyleSheet.create({


    container: {
    },

    marker: {
        borderColor: Colors.blue
    },

    topView :{
        backgroundColor: Colors.white,
        height : "$heightRowNormal",
        flex : 0,
    },

    cameraStyle :{
      flex : 1
    },

    bottomView:{
        backgroundColor: "transparent",
        height : "$heightRowNormal",
        flex :0,
        bottom :0,
        left : 0,
        position:"absolute",
        marginBottom:"$padding"
    }

});