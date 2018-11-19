import React from "react";
import ModalBase from "./ModalBase";
import EStyleSheet from 'react-native-extended-stylesheet';
import {View, ActivityIndicator, TouchableOpacity, Text} from "react-native";
import {Colors, globalStyle, ApplicationStyles} from "../../Themes";
import PropTypes from 'prop-types';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Title from "./Title";
import Button from "./Button";
import ModalLoading from "./ModalLoading";
import I18n from '../../I18n';
import firebase from 'react-native-firebase';
import CommonUtils  from "../../Utils/CommonUtils"
import {EventRegisterTypes}  from "../../Constants"

const collect = firebase.firestore().collection('pray');


export default class ModalScanQR extends ModalBase {

    constructor(props) {
        super();
        this.fetching = false;
    }

    onSuccess(e) {
        if (e.type === "QR_CODE" && !this.fetching) {
            this.fetching = true;
            this.refs["loading"].open();
            collect.doc(e.data).get().then(snapshot => {
                let data = snapshot.data();
                let ref = snapshot.ref;
                if (data) {

                    const {uid, owner} = data;
                    const httpsCallable = firebase.functions(firebase.app()).httpsCallable("following");
                    return httpsCallable({userUID: firebase.auth().currentUser.uid, prayUID: uid,userOtherUID :owner.uid})
                        .then(data => {
                            CommonUtils.sendEvent({type : EventRegisterTypes.GET_PRAY});
                        })
                        .catch(httpsError => {
                            console.log("ERROR :", httpsError);
                            console.log(httpsError.code);
                            console.log(httpsError.message);
                            console.log(httpsError.details.errorDescription);
                            throw "error"
                        });
                }
                throw "error"
            }).finally(res => {
                this.refs["loading"].close();
                if(res ==="error"){
                    alert("following failed");
                }
                this.fetching = false;
                this.close();
            });
        }

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
                <ModalLoading
                    ref ="loading"
                />
            </View>
        )
    }
}

ModalScanQR.defaultProps = {}

ModalScanQR.propTypes = {}


const styles = EStyleSheet.create({


    container: {},

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