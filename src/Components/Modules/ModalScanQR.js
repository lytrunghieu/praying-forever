import React from "react";
import ModalBase from "../Common/ModalBase";
import EStyleSheet from 'react-native-extended-stylesheet';
import {View} from "react-native";
import {Colors} from "../../Themes/index";
import PropTypes from 'prop-types';
import QRCodeScanner from 'react-native-qrcode-scanner';
import TextBase from "../Common/TextBase";
import ButtonFooter from "../Modules/ButtonFooter";
import I18n from '../../I18n/index';

export default class ModalScanQR extends ModalBase {

    constructor(props) {
        super();
        this.fetching = false;
        this.onSuccess = this.onSuccess.bind(this);
    }

    onSuccess(e) {
        if (e.type === "QR_CODE") {
            const {followingPrayer} = this.props;
            const {data = ""} = e;
            const strs = data.toString().split(",");
            const prayerUID = strs[0] || "";
            const userOtherUID = strs[1] || "";
            if (prayerUID && userOtherUID) {
                followingPrayer({prayerUID, userOtherUID, follow: true});
                this.close();
            }
        }
    }

    renderContent() {
        return (
            <View
                style={styles.container}
            >
                <QRCodeScanner
                    topContent={
                        <TextBase  bold={true} largeX={true}>{I18n.t("scanQRCode")}</TextBase>
                    }
                    fadeIn={false}
                    topViewStyle={styles.topView}
                    onRead={this.onSuccess}
                    showMarker={true}
                    cameraStyle={styles.cameraStyle}
                    markerStyle={styles.marker}
                    bottomViewStyle={styles.bottomView}
                    bottomContent={
                        <ButtonFooter  onPress={this.close} text={I18n.t("cancel")}/>
                    }
                    cameraProps={{captureAudio: false}}
                />

            </View>
        )
    }
}

ModalScanQR.defaultProps = {
    followingPrayer: () => {
    }
};

ModalScanQR.propTypes = {
    followingPrayer: PropTypes.func
}


const styles = EStyleSheet.create({


    container: {
        height: "100%",
        width: "100%",
    },

    marker: {
        borderColor: Colors.blue
    },

    topView: {
        backgroundColor: Colors.white,
        height: "$heightRowNormal",
        flex: 0,
    },

    cameraStyle: {
        flex: 1
    },

    bottomView: {
        backgroundColor: "transparent",
        height: "$heightRowNormal",
        flex: 0,
        bottom: 0,
        left: 0,
        position: "absolute",
        marginBottom: "$padding"
    }

});