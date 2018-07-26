import React, {PureComponent} from "react";
import Modal from 'react-native-modalbox';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
    TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';

export default class ModalBase extends PureComponent {

    constructor(props) {
        super(props);
        this.state={
            visible :false
        };
        this.isCenter = true;
        this.animationDuration =500;
        this.backdropOpacity = 0.5;

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);

    }

    open(){
        this.refs["modal"].open();
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

        return (
            <Modal
                style={[styles.modal]}
                ref={"modal"}
                // isOpen={this.state.visible}
                animationDuration={this.animationDuration}
                swipeToClose={false}
                backdropOpacity={this.backdropOpacity}
            >
                <TouchableOpacity style={[styles.container ,  this.isCenter  && styles.containerCenter ]}
                                  activeOpacity={1}
                                  onPress={this.close}

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
}

const styles = EStyleSheet.create({
    modal: {
        backgroundColor: "rgba(0,0,0,0)",
        height: "100%",
    },

    container: {
        flex: 1,
        alignItems: "center",
        justifyContent:"flex-end",

    },

    containerCenter :{

        justifyContent:"center",
    }


});