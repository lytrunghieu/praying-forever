// Libraries
import React, { PureComponent } from 'react';
import {
    View,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';

// Utilities

//Components

export default class Separator extends PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        let props = this.props;
        return (
            <View style={[styles.container , {height : props.height}]} />
        );
    }
}

Separator.defaultProps = {
    height : 10,
}

Separator.propTypes = {
    height : PropTypes.number,

}

const styles = EStyleSheet.create({
    container :{
        backgroundColor:"transparent"
    }

});