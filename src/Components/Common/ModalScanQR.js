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
import firebase from 'react-native-firebase';

const collect = firebase.firestore().collection('pray');


export default class ModalScanQR extends ModalBase {

    constructor(props) {
        super();
        this.fetching = false;
    }

    onSuccess(e) {
        if(e.type ==="QR_CODE" && !this.fetching){
            this.fetching = true;
            collect.doc(e.data).get().then(snapshot =>{
                let data = snapshot.data();
                let ref = snapshot.ref;
                if(data){
                    const {following, uid} = data;
                    const exist = following.findIndex(e => e === firebase.auth().currentUser.uid);
                    if(exist === -1){
                        following.push(firebase.auth().currentUser.uid);
                        ref.update("following", following).then(success =>{
                            const _collect = firebase.firestore().collection("pray/"+firebase.auth().currentUser.uid+"/data");
                            _collect.add(data).finally(res =>{
                                this.fetching = false;
                                this.close();
                            });
                        })
                    }
                }
            })
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