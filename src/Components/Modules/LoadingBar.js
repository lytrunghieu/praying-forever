import React, {PureComponent} from 'react';
import {ActivityIndicator, View} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import globalStyle from '../../Themes/globalStyle';

import {Colors, Fonts} from '../../Themes';
import {Button, TextBase} from "../Common";

export default class LoadingBar extends PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        const {visible} = this.props;
        if(!visible){
            return null
        }
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <ActivityIndicator size="large" color={Colors.white}/>
                    <TextBase highlight ={true} bold ={true} >Loading</TextBase>
                </View>
            </View>)
    }
}

LoadingBar.defaultProps = {
    visible : false
};

LoadingBar.propTypes = {
    visible: PropTypes.bool
};

const styles = EStyleSheet.create({
    container: {
        width: "100%",
        paddingLeft: "$padding",
        paddingRight: "$padding",
    },

    content: {
        flexDirection: "row",
        height: "$heightRowNormal",
        backgroundColor: Colors.black,
        alignItems: "center",
        width: "100%",
        marginBottom:"$padding",
    }

});