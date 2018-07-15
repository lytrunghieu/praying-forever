import React from "react";
import {Text, TouchableOpacity, Image} from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import {Colors, Fonts, ApplicationStyles, Images} from '../../Themes';

const RowItem = ({title = "", icon = null, onPress}) => {
    return (
        <TouchableOpacity style={[styles.container, ApplicationStyles.screen.shadowContainer]}
                          onPress={onPress}
        >
            <Text numberOfLines={1} style={[styles.text]}>{title}</Text>
            {icon &&
            <Image
                source={icon}
            />
            }

        </TouchableOpacity>
    )
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

    text: {
        flex: 1,
        fontFamily: Fonts.type.robotoRegular,
        fontSize: Fonts.size.normal,
        color: Colors.black,
    },

});

export default RowItem;