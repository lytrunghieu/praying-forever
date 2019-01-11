// Libraries
import React, {PureComponent} from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import {View} from "react-native";
import {Colors, IconName} from '../../Themes';
import {TextBase, Icon} from "../Common";
import I18n from "../../I18n";


export default class NetworkBar extends PureComponent {


    render() {
        const {online} = this.props;
        return (
            <View style={[styles.container]}>
                <TextBase
                    highlight={true}
                    small={true}
                    success={online}
                    error={!online}
                > {online ? I18n.t("appOnline") : I18n.t("appOffline")}</TextBase>
                <View style ={styles.space}/>

                <Icon smallest={true} success={online} error={!online} name={IconName.onlineOfOffline}/>
                <View style ={styles.space}/>
            </View>
        )
    }
}

NetworkBar.defaultProps = {};

NetworkBar.propTypes = {
    online: PropTypes.bool
};

const styles = EStyleSheet.create({
    container: {
        height: 16,
        width: "100%",
        alignItems: "center",
        flexDirection:"row",
        justifyContent: "flex-end",
        backgroundColor: Colors.black
    },

    space :{
        marginLeft:"$paddingSmall",
    }

});