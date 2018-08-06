import React, {PureComponent} from "react";
import {Text, TouchableOpacity, Image} from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import {Colors, Fonts, ApplicationStyles, Images} from '../../Themes';
import PropTypes from 'prop-types'

class RowItem extends PureComponent {

    render() {
        const {title = "", titleBold, icon, value, onPress, scaled,canPress} = this.props;
        return (
            <TouchableOpacity
                style={[styles.container, ApplicationStyles.screen.shadowContainer, scaled && styles.containerScale]}
                onPress={onPress}
                disabled ={!canPress}
            >
                {
                    title &&
                    <Text numberOfLines={1} style={[styles.text, titleBold && styles.textBold]}>{title}</Text> || null
                }

                {value &&
                <Text style={[styles.value]}>{value}</Text> || null

                }
                {icon &&
                <Image
                    source={icon}
                /> || null
                }


            </TouchableOpacity>
        )
    }
}

RowItem.propsType = {
    title: PropTypes.string,
    icon: PropTypes.number,
    onPress: PropTypes.func,
    value: PropTypes.string,
    titleBold: PropTypes.bool,
    scaled: PropTypes.bool,
    canPress: PropTypes.bool,

}

RowItem.defaultProps = {
    onPress: () => {
    },
    title: "",
    icon: null,
    value: "",
    titleBold: false,
    scaled: false,
    canPress : true,
}

const styles = EStyleSheet.create({

    container: {
        height: "$heightRow",
        width: "100%",
        paddingLeft: "$padding",
        paddingRight: "$padding",
        backgroundColor: Colors.primary,
        flexDirection: "row",
        alignItems: "center",
    },

    containerScale: {
        height: null,

    },

    text: {
        flex: 1,
        fontFamily: Fonts.type.robotoRegular,
        fontSize: Fonts.size.normal,
        color: Colors.black,
    },

    value: {
        marginTop: "$padding",
        marginBottom: "$padding",
        fontFamily: Fonts.type.robotoRegular,
        fontSize: Fonts.size.normal,
        color: Colors.black,
    },

    textBold: {
        fontFamily: Fonts.type.robotoMedium,
    }

});

export default RowItem;