// Libraries
import React from 'react';
import {
    View,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import OptionPopup from "./Option";

import {Colors, Fonts} from "../../Themes"
import ModalBase from "./ModalBase"

export default class DropdowPopup extends ModalBase {

    constructor(props) {
        super(props);
        this.state = {
            right: 0,
            top: 0,
        };
        this.onPressOption = this.onPressOption.bind(this);
        this.close = this.close.bind(this);

    }

    onPressOption(index) {
        this.close();
        this.props.onPress(index);
    }

    open({x, y}) {
        this.setState({
            right: x,
            top: y,
        }, () => {
            super.open();

        });

    }

    renderContent() {
        const {options} = this.props;
        return (
            <View style={[styles.content, {right: this.state.right, top: this.state.top}]}>
                {options.map((op, key) => {
                    return <OptionPopup key={key} index={key} text={op} onPress={this.onPressOption}/>
                })}
            </View>
        )
    }
}

DropdowPopup.defaultProps = {
    options: [],
    onPress: () => {
    }
}

DropdowPopup.propTypes = {
    options: PropTypes.array,
    onPress: PropTypes.func
}

const styles = EStyleSheet.create({
    modal: {
        backgroundColor: "rgba(0,0,0,0)",
        height: "100%",
    },

    container: {
        flex: 1,
    },

    content: {
        position: "absolute",
        width: 195,
        shadowOffset: {
            height: 1,
        },
        shadowRadius: 2,
        shadowColor: Colors.black,
        shadowOpacity: 1,
    },
});