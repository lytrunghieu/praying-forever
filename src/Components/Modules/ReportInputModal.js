import React from "react";

import {EventRegisterTypes} from '../../Constants';
import {View} from "react-native";
import {Colors} from '../../Themes';
import I18n from '../../I18n/index';
import Proptypes from "prop-types";
import {CommonUtils} from "../../Utils";
import { TextArea, TextBase} from "../Common";
import  ModalBase from "../Common/ModalBase";
import ButtonFooter from "./ButtonFooter";
import EStyleSheet from 'react-native-extended-stylesheet';

export default  class ReportInputModal extends ModalBase {

    constructor(props) {
        super();
        this.onChangeContent = this.onChangeContent.bind(this);
        this.onPressSubmit = this.onPressSubmit.bind(this);
        this.containerStyle = styles.customeContainerStyle;
        this.backdropOpacity = 0.3;
    }

    onChangeContent(text) {
        this.setState({
            data: text
        });
    }

    onPressSubmit() {
        const {data} = this.state;
        const {prayer, user} = this.params;
        CommonUtils.sendEvent({type : EventRegisterTypes.ADD_REPORT , params :{data :{user,prayer, reportMessage : data}}})
        super.close();
    }

    open(data) {
        this.params = data;
        super.open();
    }

    renderContent() {
        const {data} = this.state;
        return (
            <View
                style={styles.rootContainer}>
                <View style={styles.headerContainer}>
                    <TextBase highlight={true} bold={true} largeX={true}>{I18n.t("report")}</TextBase>
                </View>
                <TextArea
                    ref="_description"
                    placeholder={I18n.t("inputDescription")}
                    value={data}
                    onChangeText={this.onChangeContent}
                    maxLength={5000}
                />
                <ButtonFooter onPress={this.onPressSubmit} text={I18n.t("send")}
                    disabled={!data}
                />
            </View>
        )
    }
}

ReportInputModal.defaultProps = {};

ReportInputModal.propTypes = {};

const styles = EStyleSheet.create({

    customeContainerStyle :{
        paddingLeft:"$padding",
        paddingRight:"$padding",

    },

    rootContainer: {
        backgroundColor:Colors.white,
        borderRadius :"$borderRadiusSmall",
    },

    headerContainer: {
        backgroundColor:Colors.black,
        alignItems:"center",
        justifyContent:"center",
        height:"$heightRowSmall",
    }

});

