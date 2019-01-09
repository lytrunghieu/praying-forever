// Libraries
import React, {PureComponent} from 'react';
import {StatusBar,View,Dimensions} from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';

import {Colors, IconName} from '../../Themes';

import {Icon, TextBase, TextLink,} from "../Common";
import LoadingIndicator from "./loadingIndicator";

import {Header as HeaderBase, Left, Body, Right, Item} from 'native-base';



export default class EmptyHolder extends PureComponent {

    render() {
        const {h1,h2,link,onPressLink , ...rest} = this.props;
        const {height} = Dimensions.get("window");

        return (
            <View style={[styles.container,{minHeight : height/ 2}]}>
                <Icon name={IconName.empty} largeX={1}/>
                <TextBase bold={true} largeX={true}>{h1}</TextBase>
                <TextBase numberOfLines={0} large={true}>{h2}</TextBase>
                <TextLink bold={true} large={true} text={link} onPress ={onPressLink}/>
            </View>
        );
    }
}

EmptyHolder.defaultProps = {
    onPressLink : () =>{},
};

EmptyHolder.propTypes = {
    h1 : PropTypes.string,
    h2 : PropTypes.string,
    link : PropTypes.string,
    onPressLink: PropTypes.func,
}

const styles = EStyleSheet.create({

    container :{
        alignItems:"center",
        justifyContent:"center"
    }
});