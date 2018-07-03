// Libraries
import React, {PureComponent} from 'react';
import {
    View,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import {Colors} from "../../Themes"

// Utilities

//Components

export default class Separator extends PureComponent {

    constructor(props) {
        super(props);
    }

    render() {

        const {height} = this.props;
        return (
            <View style={[styles.main, {height: height}]}/>
        );
    }
}

Separator.defaultProps = {
    height: 1,
}

Separator.propTypes = {
    height: PropTypes.number
}

const styles = EStyleSheet.create({
    main: {
        backgroundColor: Colors.gray,
        width :"100%"
    }
});