import React from "react";
import ModalBase from "./ModalBase";
import EStyleSheet from 'react-native-extended-stylesheet';
import {View, Text} from "react-native";
import {Colors, Fonts} from "../../Themes";
import PropTypes from 'prop-types';
import Button from "./Button";


export default class ConfirmModal extends ModalBase {


    renderContent() {
        const {title, content, acceptText, rejectText, onAccept} = this.props;
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{title}</Text>
                <Text style ={styles.content}>{content}</Text>
                <View style={styles.buttonsContainer}>
                    <Button
                        text={acceptText.toUpperCase()}
                        width={114}
                        onPress={onAccept}
                    />
                    <View style ={styles.space}/>
                    <Button
                        onPress={this.close}
                        text={rejectText.toUpperCase()}
                        width={114}
                        textColor={Colors.red}
                    />
                </View>
            </View>
        )
    }
}

ConfirmModal.defaultProps = {
    onAccept: () => {
    },
}

ConfirmModal.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    acceptText: PropTypes.string.isRequired,
    rejectText: PropTypes.string.isRequired,
}


const styles = EStyleSheet.create({
    container: {
        width: 283,
        height: 136,
        backgroundColor: Colors.primary,
        borderRadius: "$borderRadius",
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 20,
        alignItems: "center",
    },

    title: {
        color: Colors.red,
        fontFamily: Fonts.type.robotoMedium,
        fontSize: Fonts.size.large,
        marginBottom: 12,
    },

    content: {
        color: Colors.black,
        fontFamily: Fonts.type.robotoRegular,
        fontSize: Fonts.size.small,
        marginBottom: 20,
    },



    buttonsContainer: {
        flexDirection: "row",
    },

    space :{
        width: 32
    }

});