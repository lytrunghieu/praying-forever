import React from "react";
import ModalBase from "./ModalBase";
import EStyleSheet from 'react-native-extended-stylesheet';
import {View, ActivityIndicator} from "react-native";
import {Colors} from "../../Themes";
import PropTypes from 'prop-types';
import {Button, TextBase} from "./";
import {ButtonFooter} from "../Modules"
import I18n from '../../I18n';

export default class ActionSheet extends ModalBase {

    constructor(props) {
        super(props);
        super.constructor(props);
        this.isCenter = false;
        this.backdropOpacity = 0;
        this.onPressOption = this.onPressOption.bind(this);
        this.cb = null;
    }

    componentDidUpdate(preProps, preState) {
        if (preState.visible !== this.state.visible && preState.visible) {
            if (this.cb) {
                this.cb();
                this.cb = null;
            }
        }
    }

    onPressOption(cb) {
        //auto close when pressed
        if (this.props.closeWhenPress) {
            this.close();
        }
        //callback
        if (cb) {
            this.cb = cb;
        }
    }

    renderOptionRow(option = {
        text: "", color: Colors.black, onPress: () => {
        }
    }, index) {
        return (
            <Button key={index} block style={styles.buttonOption}
                    onPress={this.onPressOption.bind(this, option.onPress)}
            >
                <TextBase>{option.text}</TextBase>
            </Button>
        )
    }

    renderContent() {
        const {options, submitText, title, fetching} = this.props;
        return (
            <View style={[styles.container]}>
                <View style={styles.header}>
                    <TextBase large={true} highlight={true} bold={true}
                              upperCase={true}>{title || I18n.t("selectAction")}</TextBase>
                </View>
                <View style={styles.content}>
                    {
                        fetching ? <View style={styles.fetchingWrapper}>
                            <ActivityIndicator size="large" color={Colors.blue}/>

                        </View> : Array.isArray(options) &&  options.length > 0 && options.map((op, index) => {
                            return this.renderOptionRow(op, index);
                        })
                    }
                    <ButtonFooter onPress={this.close} text={submitText || I18n.t("cancel")}/>
                </View>
            </View>
        );
    }
}

ActionSheet.defaultProps = {
    closeWhenPress: true,
    options: [],
}

ActionSheet.propTypes = {
    options: PropTypes.array,
    submitText: PropTypes.string,
    title: PropTypes.string,
    fetching: PropTypes.bool
}

const styles = EStyleSheet.create({
    container: {
        width: "100%",
        paddingLeft: "$padding",
        paddingRight: "$padding",
    },

    header: {
        backgroundColor: Colors.black,
        height: "$heightRowSmall",
        borderTopLeftRadius: "$borderRadiusSmall",
        borderTopRightRadius: "$borderRadiusSmall",
        alignItems: "center",
        justifyContent: "center",


    },

    content: {
        backgroundColor: Colors.primary,
        borderRadius: "$borderRadiusSmall"
    },

    buttonOption: {
        borderBottomWidth: "$borderWidthSmall",
        borderColor: Colors.divider,
        backgroundColor: Colors.primary,
        borderRadius: 0,
    },

    fetchingWrapper: {
        height: "$heightRowNormal",
        width: "100%",
        alignItems: "center",
        justifyContent: "center"

    }

});