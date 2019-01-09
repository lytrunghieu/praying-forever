// Libraries
import React, {PureComponent} from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import globalStyle from '../../Themes/globalStyle';
import {View} from "react-native";
import {Colors} from '../../Themes';
import {TextBase} from "../Common";
import I18n from "../../I18n";


export default class NetworkBar extends PureComponent {


    render() {
        const {visible} = this.props;
        return (
            visible ?
            <View style={[styles.container]}>
                <TextBase small={true} italic={true} >{I18n.t("appOffline")}</TextBase>
            </View> :  null
        )
    }
}

NetworkBar.defaultProps = {};

NetworkBar.propTypes = {
    visible: PropTypes.bool
};

const styles = EStyleSheet.create({
    container: {
        height: 16,
        top: 0,
        left: 0,
        width: "100%",
        position: "absolute",
        alignItems: "center",
        justifyContent:"center",
        backgroundColor: Colors.grayBg
    }

});