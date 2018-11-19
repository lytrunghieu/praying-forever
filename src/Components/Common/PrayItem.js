// Libraries
import React, {PureComponent} from 'react';
import {View, TouchableOpacity, Text, TouchableHighlight} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';

// Utilities
import {Colors, Fonts, ApplicationStyles, Images} from '../../Themes';
import Swipeable from 'react-native-swipeable';
import {TextIcon} from "../Modules"
import moment from "moment";

export default class PrayItem extends PureComponent {

    constructor(props) {
        super();
        this.swipeable = null;
        this.recenter = this.recenter.bind(this);
        this.onPress = this.onPress.bind(this);
    }

    recenter() {
        this.swipeable.recenter();
    }

    onPress(callback) {
        this.recenter();
        callback();
    }

    renderBottomActions(options) {
        return (
            <View style={styles.bottomActionsContainer}>
                {options.map((op, index) => {
                    return ([
                        <TouchableOpacity
                            onPress={op.onPress}
                            key={index}
                            style={styles.bottomActionsOptionContainer}>
                            <TextIcon text={op.text} leftIcon={op.img}/>
                        </TouchableOpacity>,
                        index < options.length -1 ? <View key ={"divider".concat(index)} style ={styles.dividerSeparateBottomAction}/> : null

                    ]);
                })}
            </View>
        )
    }


    render() {

        const {title, content, date, onPress, leftOptions} = this.props;
        const leftView = (
            <View style={styles.leftContainer}>
                <Text numberOfLines={1} style={styles.title}>{title}</Text>
                <Text numberOfLines={1} style={styles.content}>{content}</Text>
            </View>
        );

        const rightView = (
            <View style={styles.rightContainer}>
                <Text numberOfLines={1} style={styles.date}>{moment(date).fromNow()}</Text>
            </View>
        );

        return (
            <View style={[styles.container, ApplicationStyles.screen.shadowContainer]}>
                <TouchableOpacity style={[styles.containerButton]}
                                  ref="container"
                                  onPress={onPress}
                >
                    {leftView}
                    {rightView}
                </TouchableOpacity>
                {this.renderBottomActions(leftOptions)}
            </View>
        );
    }
}

PrayItem.defaultProps = {
    title: "",
    content: "",
    date: "",
    onPress: () => {
    },
    leftOptions: []
};

PrayItem.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    date: PropTypes.oneOfType([PropTypes.string,PropTypes.number, PropTypes.date]),
    onPress: PropTypes.func,
    leftOptions: PropTypes.array
};

const styles = EStyleSheet.create({
    container: {
        backgroundColor: Colors.primary,
        borderRadius: "$borderRadiusSmall",
    },

    containerButton: {
        flexDirection: 'row',
        width: "100%",
        minHeight: "$heightRowNormal",
        padding: "$paddingSmall"
        // alignItems: "center",
    },

    leftContainer: {
        flex: 1,
        // justifyContent: "center",
    },

    rightContainer: {
        // justifyContent: "center",
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
        alignSelf: "flex-end",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.black,
        width: 75,
        height: "$heightRowNormal",
    },

    optionText: {
        fontFamily: Fonts.type.robotoRegular,
        fontSize: Fonts.size.normal,
        color: Colors.primary,
    },

    separator: {
        borderRightWidth: "$borderWidthSmall",
        borderColor: Colors.white,
    },

    borderRadius: {
        borderTopLeftRadius: "$borderRadiusSmall",
        borderBottomLeftRadius: "$borderRadiusSmall",
    },

    bottomActionsContainer: {
        flexDirection: "row",
        height: "$heightRowSmall",
        justifyContent: "center",
        borderTopWidth:"$borderWidthSmall",
    },

    bottomActionsOptionContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",

    },

    dividerSeparateBottomAction :{
        height :"100%",
        width :1,
        backgroundColor: Colors.gray
    }


});