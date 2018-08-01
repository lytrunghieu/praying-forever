// Libraries
import React, {PureComponent} from 'react';
import {View, TouchableOpacity, Text, TouchableHighlight} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';

// Utilities
import {Colors, Fonts, ApplicationStyles} from '../../Themes';
import Swipeable from 'react-native-swipeable';

export default class PrayItem extends PureComponent {


    render() {
        const {title, content, date, onPress, lefttOptions} = this.props;

        let leftButtons = lefttOptions.map((e, index) => {
            let separated = false;
            let borderRadius = false;
            if (index < lefttOptions.length - 1) {
                separated = true;
            }
            if (index == lefttOptions.length - 1) {
                borderRadius = styles.borderRadius;
            }

            return (
                <TouchableHighlight
                    onPress={e.onPress}
                     style={[
                        styles.optionTextContainer,
                        separated && styles.separator,
                        borderRadius && borderRadius,
                        e.backgroundColor && {backgroundColor: e.backgroundColor}
                     ]}
                >
                    <Text style ={styles.optionText}>
                        {e.text}
                    </Text>
                </TouchableHighlight>);
        });


        const leftView = (
            <View style={styles.leftContainer}>
                <Text numberOfLines={1} style={styles.title}>{title}</Text>
                <Text numberOfLines={1} style={styles.content}>{content}</Text>
            </View>
        );

        const rightView = (
            <View style={styles.rightContainer}>
                <Text numberOfLines={1} style={styles.date}>{date}</Text>
            </View>
        );

        return (
            <View style={[styles.container, ApplicationStyles.screen.shadowContainer]}>
                <Swipeable
                    leftButtons={leftButtons}
                >
                    <TouchableOpacity style={[styles.containerButton]}
                                      ref="container"
                                      onPress={onPress}
                    >
                        {leftView}
                        {rightView}
                    </TouchableOpacity>
                </Swipeable>
            </View>
        )
    }
}

PrayItem.defaultProps = {
    title: "",
    content: "",
    date: "",
    onPress: () => {
    },
    lefttOptions: []
};

PrayItem.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    lefttOptions: PropTypes.array
}

const styles = EStyleSheet.create({
    container: {
        backgroundColor: Colors.primary,
        borderRadius: "$borderRadius",
    },

    containerButton: {
        flexDirection: 'row',
        width: "100%",
        height: "$heightRow",
        paddingLeft: "$paddingSmall",
        paddingRight: "$paddingSmall",
        alignItems: "center",
    },

    leftContainer: {
        flex: 1,
        justifyContent: "center",
    },

    rightContainer: {
        justifyContent: "center",
        width: 77,
        flex: -1,
        alignItems: "flex-end"
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
    },

    optionTextContainer: {
        alignSelf:"flex-end",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.black,
        width: 75,
        height: "$heightRow",
    },

    optionText: {
        fontFamily: Fonts.type.robotoRegular,
        fontSize: Fonts.size.normal,
        color: Colors.primary,
    },

    separator: {
        borderRightWidth: "$widthBorder",
        borderColor: Colors.white,
    },

    borderRadius: {
        borderTopLeftRadius: "$borderRadius",
        borderBottomLeftRadius: "$borderRadius",
    }


});