import React, {PureComponent} from "react";
import Modal from 'react-native-modalbox';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
    TouchableOpacity,
    Keyboard
} from 'react-native';
import PropTypes from 'prop-types';

export default class ModalBase extends PureComponent {

    constructor(props) {
        super(props);
        this.state={
            visible :false
        };
        this.isCenter = true;
        this.animationDuration =200;
        this.backdropOpacity = 0.5;
        this.backdropPressToClose = true;
        this.backButtonClose = true;

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);

    }

    open(){
        this.refs["modal"].open();
        Keyboard.dismiss();
        // this.setState({
        //     visible :true
        // });
    }

    close(){
        this.refs["modal"].close();
        // this.setState({
        //     visible :false
        // });
    }

    renderContent(){
        return null;
    }

    render(){
        const {onClosed} = this.props;
        return (
            <Modal
                style={[styles.modal]}
                ref={"modal"}
                onClosed ={onClosed}
                // isOpen={this.state.visible}
                backdropPressToClose ={this.backdropPressToClose}
                animationDuration={this.animationDuration}
                swipeToClose={false}
                backdropOpacity={this.backdropOpacity}
                backButtonClose ={this.backButtonClose}

            >
                <TouchableOpacity style={[styles.container ,  this.isCenter  && styles.containerCenter ]}
                                  activeOpacity={1}
                                  onPress={this.close}
                                  disabled ={!this.backdropPressToClose}

                >
                    <TouchableOpacity
                        activeOpacity={1}
                    >
                    {this.renderContent()}
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        )
    }

}

ModalBase.defaultProps ={
    onClosed : () =>{}
}

const styles = EStyleSheet.create({
    modal: {
        backgroundColor: "$transparent",
        height: "100%",
    },

    container: {
        justifyContent:"flex-end",
        flex: 1,

    },

    containerCenter :{

        justifyContent:"center",
    }


});