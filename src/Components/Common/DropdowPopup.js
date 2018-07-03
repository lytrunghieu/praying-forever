// Libraries
import React, {PureComponent} from 'react';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import Modal from 'react-native-modalbox';
import OptionPopup from "./OptionPopup";

import {Colors, Fonts} from "../../Themes"

// Utilities

//Components

export default class DropdowPopup extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            right: 0,
            top: 0,
        };
        this.onPressOption = this.onPressOption.bind(this);
        this.close = this.close.bind(this);

    }

    onPressOption(index){
        this.close();
        this.props.onPress(index);
    }

    open({x, y}) {
        this.setState({
            right: x,
            top: y,
        }, () => {
            this.refs["modal"].open();

        });

    }

    close() {
        this.refs["modal"].close();
    }

    render() {
        const {options} = this.props;
        return (
            <Modal
                style={[styles.modal]}
                ref={"modal"}
                animationDuration={0}
                swipeToClose={false}
                backdropOpacity={0}
            >
                <TouchableOpacity style={styles.container}
                                  activeOpacity={1}
                                  onPress={this.close}

                >
                    <View style={[styles.content, {right: this.state.right, top: this.state.top}]}>
                        {options.map((op, key) => {

                            return <OptionPopup key={key} index ={key} text={op} onPress={this.onPressOption}/>
                        })}
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    }
}

DropdowPopup.defaultProps = {
    options: [],
    onPress : ()=>{}
}

DropdowPopup.propTypes = {
    options: PropTypes.array,
    onPress : PropTypes.func
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