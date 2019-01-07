import React from "react";
import ModalBase from "../Common/ModalBase";
import EStyleSheet from 'react-native-extended-stylesheet';
import {View, Text} from "react-native";
import {Colors, Fonts} from "../../Themes/index";
import PropTypes from 'prop-types';
import {Button, TextBase} from "../Common";


export default class ConfirmModal extends ModalBase {


    constructor(props){
        super(props);
        super.constructor(props);

        this.onAccept = this.onAccept.bind(this);
    }

    onAccept(){
        const {onAccept} = this.props;
        const {data} = this.state;
        onAccept(data);
        this.close();
    }

    renderContent() {
        const {title, content, acceptText, rejectText, onAccept} = this.props;
        return (
            <View style={styles.container}>
                <TextBase error={true} largeX={true} bold={true}>{title}</TextBase>
                <TextBase>{content}</TextBase>
                {/*<Text style={styles.content}>{content}</Text>*/}
                <View style={styles.buttonsContainer}>
                    <Button
                        onPress={this.onAccept}
                        transparent={false}
                        block
                        style={styles.buttonWrapper}
                    >
                        <TextBase error={true}  bold={true} large={true}>{acceptText}</TextBase>
                    </Button>
                    {/*<View style={styles.space}/>*/}
                    <Button
                        onPress={this.close}
                        transparent={false}
                        block
                        style={styles.buttonWrapper}
                    >
                        <TextBase  highlight={true} bold={true} large={true}>{rejectText}</TextBase>
                    </Button>
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
    onAccept: PropTypes.func
}


const styles = EStyleSheet.create({
    container: {
        width: 283,
        minHeight: 136,
        backgroundColor: Colors.primary,
        borderRadius: "$borderRadiusSmall",
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 20,
        alignItems: "center",
        alignSelf: "center"
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
        width: "100%",
        justifyContent:"space-between",
        margin: "$padding",
    },

    buttonWrapper: {
        backgroundColor: Colors.black,
        width: "45%",
        // margin: "$padding",
    },

    space: {
        width: 32
    }

});