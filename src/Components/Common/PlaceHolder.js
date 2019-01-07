// Libraries
import React, { PureComponent } from 'react';
import {
    View,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';

// Utilities

//Components

export default class PlaceHolder extends PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        let props = this.props;
        const {small} = props;
        return (
            <View style={[styles.container , small ? styles.smallStyle : {height : props.height}]} />
        );
    }
}

PlaceHolder.defaultProps = {
    height : 10,
}

PlaceHolder.propTypes = {
    height : PropTypes.number,
    small : PropTypes.bool

}

const styles = EStyleSheet.create({
    container :{
        backgroundColor:"transparent"
    },
    smallStyle :{
        height : 4,
    }

});