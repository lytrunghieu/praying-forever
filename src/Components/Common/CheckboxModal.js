import React from "react";
import ModalBase from "./ModalBase";
import EStyleSheet from 'react-native-extended-stylesheet';
import {View, ScrollView} from "react-native";
import {Colors, globalStyle} from "../../Themes";
import PropTypes from 'prop-types';
import {Checkbox, TextBase} from "./";
import {ButtonFooter} from "../Modules";

export default class CheckboxModal extends ModalBase {

    constructor(props) {
        super();
        super.constructor();
        this.backdropOpacity = 0;
        this.isCenter = false;
        this.onPressSubmit = this.onPressSubmit.bind(this);
    }

    onPressSubmit() {
        this.close();
        this.props.onPressSubmit();
    }


    renderOption(option, index) {

        return (
            <Checkbox key={index} text={option.text} onPress={() => option.onPress(index)} checked={option.isChecked}/>
        );
    }

    renderContent() {
        const {options, textDone, limitShow, title} = this.props;
        let optionsComponent = (
            options.map((op, index) => {
                return this.renderOption(op, index);
            })
        )


        if (options.length > limitShow) {
            optionsComponent = (
                <ScrollView
                    contentContainerStyle={{width: "100%"}}
                    style={{height: limitShow * globalStyle.$heightRowNormal}}
                >
                    {optionsComponent}
                </ScrollView>
            );
        }

        return (
            <View style={styles.container}>
                <View style={styles.wrapper}>
                    <View style={styles.header}>
                        <TextBase large={true} highlight={true} bold={true} upperCase={true}>{title}</TextBase>
                    </View>

                    <View style={styles.content}>
                        {optionsComponent}
                        <ButtonFooter text={textDone} onPress={this.onPressSubmit}/>
                    </View>
                </View>
            </View>
        );

    }
}

CheckboxModal.defaultProps = {
    limitShow: 4,
    onPressSubmit: () => {
    }
}

CheckboxModal.propTypes = {
    options: PropTypes.array.isRequired,
    textDone: PropTypes.string.isRequired,
    limitShow: PropTypes.number,
    onPressSubmit: PropTypes.func,
    title: PropTypes.string,
}


const styles = EStyleSheet.create({
    container: {
        width: "100%",

    },
    wrapper: {
        paddingRight: "$padding",
        paddingLeft: "$padding",
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
        borderBottomLeftRadius: "$borderRadiusSmall",
        borderBottomRightRadius: "$borderRadiusSmall",
    }


});