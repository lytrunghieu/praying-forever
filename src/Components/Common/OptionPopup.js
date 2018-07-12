// Libraries
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

// Utilities

//Components

export default class OptionPopup extends PureComponent {

    constructor(props) {
        super(props);
    }

    render() {

        const {text, hideDivider, onPress, index, leftIcon, count} = this.props;
        let textCount = count;
        if(textCount > 99){
            textCount="99+";
        }
        else{
            if(textCount ==0){
                textCount ="";
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

                <Text style={styles.text}>{text}</Text>
                <Text style={styles.count}>{textCount}</Text>
            </TouchableOpacity>
        );
    }
}

OptionPopup.defaultProps = {
    text: "",
    index: 0,
    hideDivider: false,
    onPress: () => {
    },
    leftIcon: null,
    count : 0,
}

OptionPopup.propTypes = {
    text: PropTypes.string.isRequired,
    hideDivider: PropTypes.bool,
    onPress: PropTypes.func,
}

const styles = EStyleSheet.create({
    container: {
        height: "$heightRow",
        width: "100%",
        backgroundColor: Colors.primary,
        // paddingLeft: "$padding",
        // justifyContent: "center",
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
        paddingLeft : "$padding",
        fontSize: Fonts.size.large,
        fontFamily: Fonts.type.robotoMedium,
        color: Colors.black,
        flex : 1,
    },

    count :{
        fontFamily: Fonts.type.robotoRegular,
        fontSize: Fonts.size.large,
        color : Colors.gray,
        width: 50,
        paddingRight: "$padding",
        textAlign:"right"
    }

});