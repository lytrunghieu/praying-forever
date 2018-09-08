import React from "react";
import ModalBase from "./ModalBase";
import EStyleSheet from 'react-native-extended-stylesheet';
import {View,ActivityIndicator} from "react-native";
import {Colors,globalStyle ,ApplicationStyles} from "../../Themes";
import PropTypes from 'prop-types';


export default class ModalLoading extends ModalBase {

    constructor(props){
        super();
        this.backdropPressToClose = false;
        this.backButtonClose = false;
        this.animationDuration = 0;
        this.isCenter = true;
    }

    renderContent() {
        return (
            <View style ={styles.container}>
               <ActivityIndicator
                   size ={30}
                   color={Colors.white}
                   // color ={Colors.white}
               />
            </View>
        )
    }
}

ModalLoading.defaultProps = {
}

ModalLoading.propTypes = {
}


const styles = EStyleSheet.create({
    container: {
        height: "$heightRowNormal" ,
        width: "$heightRowNormal" ,
        backgroundColor: Colors.black,
        alignItems: "center",
        justifyContent:"center",
        borderRadius:"$borderRadiusNormal"
    },


});