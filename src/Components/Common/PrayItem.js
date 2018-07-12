// Libraries
import React, {PureComponent} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';

// Utilities
import {Colors, Fonts,ApplicationStyles} from '../../Themes';

export default class NavBar extends PureComponent {


    render() {
        const {title, content, date, onPress} = this.props;

        const leftView = (
            <View style={styles.leftContainer}>
                <Text numberOfLines={1} style={styles.title}>{title}</Text>
                <Text numberOfLines={1} style={styles.content}>{content}</Text>
            </View>
        );

        const rightView = (
            <View style={styles.rightContainer}>
                <Text numberOfLines={1} style={styles.title}>{date}</Text>
            </View>
        );

        return (
            <TouchableOpacity style={[styles.container , ApplicationStyles.screen.shadowContainer]}
                              ref="container"
                              onPress={onPress}
            >
                {leftView}
                {rightView}
            </TouchableOpacity>
        )
    }
}

NavBar.defaultProps = {
    title: "",
    content: "",
    date: "",
    onPress: () => {
    }
};

NavBar.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    onPress: PropTypes.func,
}

const styles = EStyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: Colors.primary,
        width: "100%",
        height: "$heightRow",
        paddingLeft: "$padding",
        paddingRight: "$padding",
        alignItems: "center",
        borderRadius : 5,

    },

    leftContainer: {
        flex: 1,
        justifyContent: "center",
    },

    rightContainer: {
        justifyContent: "center",
        width: 77,
        flex: -1,
    },

    title: {
        fontFamily: Fonts.type.robotoRegular,
        fontSize: Fonts.size.normal,
        color: Colors.black
    },

    content: {
        fontFamily: Fonts.type.robotoRegular,
        fontSize: Fonts.size.small,
        color: Colors.gray
    },

    date: {
        fontFamily: Fonts.type.robotoRegular,
        fontSize: Fonts.size.small,
        color: Colors.black,
        textAlign: "right"
    }


});