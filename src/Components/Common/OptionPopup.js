// Libraries
import React, {PureComponent} from 'react';
import {
    View,
    Text
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import {Colors, Fonts} from "../../Themes"

// Utilities

//Components

export default class OptionPopup extends PureComponent {

    constructor(props) {
        super(props);
    }

    render() {

        const {text, hideDivider} = this.props;
        return (
            <View style={[styles.container, !hideDivider ? styles.divider : null]}>
                <Text style={styles.text}>{text}</Text>
            </View>
        );
    }
}

OptionPopup.defaultProps = {
    text: "",
    hideDivider: false,
}

OptionPopup.propTypes = {
    text: PropTypes.string.isRequired,
    hideDivider: PropTypes.bool,
}

const styles = EStyleSheet.create({
    container: {
        height: 56,
        width: "100%",
        backgroundColor: Colors.white,
        paddingLeft: 18,
        justifyContent: "center",
    },

    divider: {
        borderBottomWidth: 1,
        borderColor: Colors.gray,


    },

    text: {
        fontSize: 18,
        fontFamily: Fonts.type.robotoMedium,
        color: Colors.primary
    }
});