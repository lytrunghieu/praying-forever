
import React, {PureComponent} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import {Colors, Fonts} from "../../Themes"

export default class OptionPopup extends PureComponent {

    constructor(props) {
        super(props);
    }

    render() {

        const {text, hideDivider, onPress, index, leftIcon, count, textIsCenter, textColor} = this.props;
        let textCount = count;
        if (textCount > 99) {
            textCount = "99+";
        }
        else {
            if (textCount <= 0) {
                textCount = "";
            }
        }
        return (
            <TouchableOpacity style={[styles.container, !hideDivider ? styles.divider : null]}
                              onPress={onPress.bind(this, index)}
            >
                {leftIcon &&
                <View style={styles.leftIcon}>
                    <Image source={leftIcon}/>
                </View>
                }

                <Text style={[styles.text, textIsCenter && styles.textCenter ,{color :textColor}]}>{text}</Text>
                {
                    textCount ?
                    <Text style ={styles.count}>{textCount}</Text> : null
                }

            </TouchableOpacity>
        );
    }
}

OptionPopup.defaultProps = {
    text: "",
    textColor :Colors.black,
    index: 0,
    hideDivider: false,
    onPress: () => {
    },
    leftIcon: null,
    count: 0,
    textIsCenter: false

}

OptionPopup.propTypes = {
    text: PropTypes.string.isRequired,
    hideDivider: PropTypes.bool,
    onPress: PropTypes.func,
    textIsCenter: PropTypes.bool,
    textColor: PropTypes.string,
    count: PropTypes.oneOfType([PropTypes.string, PropTypes.number])

}

const styles = EStyleSheet.create({
    container: {
        height: "$heightRow",
        width: "100%",
        backgroundColor: Colors.primary,
        flexDirection: "row",
        alignItems: "center",
    },

    divider: {
        borderBottomWidth: 1,
        borderColor: Colors.gray,
    },

    leftIcon: {
        paddingLeft: "$padding",
    },

    text: {
        paddingLeft: "$padding",
        fontSize: Fonts.size.normal,
        fontFamily: Fonts.type.robotoRegular,
        flex: 1,
    },

    textCenter: {
        paddingLeft: 0,
        textAlign :"center",
        alignSelf:"center"
    },

    count: {
        fontFamily: Fonts.type.robotoRegular,
        fontSize: Fonts.size.normal,
        color: Colors.gray,
        width: 50,
        paddingRight: "$padding",
        textAlign: "right"
    }

});