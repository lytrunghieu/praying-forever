import React from "react";
import ModalBase from "./ModalBase";
import EStyleSheet from 'react-native-extended-stylesheet';
import {View} from "react-native";
import {Colors, ApplicationStyles} from "../../Themes";
import PropTypes from 'prop-types';
import {Button, Text, Title} from "./";
import {ButtonFooter} from "../Modules"
import I18n from '../../I18n';
import {Body, Content, Container, Row, Grid} from "native-base";

export default class ActionSheet extends ModalBase {

    constructor(props) {
        super(props);
        super.constructor(props);
        this.isCenter = false;
        this.backdropOpacity = 0;
        this.onPressOption = this.onPressOption.bind(this);
    }

    onPressOption(cb) {
        //auto close when pressed
        if (this.props.closeWhenPress) {
            this.close();
        }
        //callback
        if (cb) {
            cb();
        }

    }

    renderOptionRow(option = {
        text: "", color: Colors.black, onPress: () => {
        }
    }, index) {


        return (

            <Button key={index} block style={styles.buttonOption}
                    onPress={this.onPressOption.bind(this, option.onPress)}>
                <Text style={[styles.textButtonOption, {color: option.color}]}>
                    {option.text}
                </Text>
            </Button>
        )
    }

    renderContent() {
        const {options, submitText, title} = this.props;
        return (
            <View style={[styles.container]}>
                <View style={styles.header}>
                    <Title>{title}</Title>
                </View>
                <View style={styles.content}>
                    {options.map((op, index) => {
                        return this.renderOptionRow(op, index);
                    })}

                    <ButtonFooter onPress={this.close} block
                    >
                        <Text>
                            {submitText}
                        </Text>
                    </ButtonFooter>
                </View>

            </View>
        );
    }
}

ActionSheet.defaultProps = {
    closeWhenPress: true,
    submitText: I18n.t("cancel"),
    title: I18n.t("selectAction")
}

ActionSheet.propTypes = {
    options: PropTypes.array,
    submitText: PropTypes.string,
    title: PropTypes.string
}

const styles = EStyleSheet.create({
    container: {
        width: "100%",
        // backgroundColor: Colors.primary,
        // alignItems: "center",
        paddingLeft: "$padding",
        paddingRight: "$padding",
    },

    header: {
        backgroundColor: Colors.primary,
        height: "$heightRowSmall",
        borderTopLeftRadius: "$borderRadiusSmall",
        borderTopRightRadius: "$borderRadiusSmall",

    },

    content: {
        backgroundColor: Colors.primary,
        borderRadius: "$borderRadiusSmall"
    },

    buttonSubmit: {
        margin: "$padding",
    },

    buttonOption: {
        borderBottomWidth: "$borderWidthSmall",
        borderColor: Colors.divider,
        backgroundColor: Colors.primary,
    },

    textButtonOption: {}

});