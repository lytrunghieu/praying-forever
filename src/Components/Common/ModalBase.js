import React, {PureComponent} from "react";
import Modal from 'react-native-modalbox';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
    TouchableOpacity
} from 'react-native';

export default class ModalBase extends PureComponent {

    constructor(props) {
        super(props);

        this.isCenter = true;
        this.animationDuration =500;
        this.backdropOpacity = 0.5;

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);

    }

    open(){
        this.refs["modal"].open();
    }

    close(){
        this.refs["modal"].close();
    }

    renderContent(){
        return null;
    }

    render(){
        return (
            <Modal
                style={[styles.modal]}
                ref={"modal"}
                animationDuration={this.animationDuration}
                swipeToClose={false}
                backdropOpacity={this.backdropOpacity}
                position ={this.position}
            >
                <TouchableOpacity style={[styles.container , this.isCenter && styles.containerCenter ]}
                                  activeOpacity={1}
                                  onPress={this.close}

                >
                    {this.renderContent()}
                </TouchableOpacity>
            </Modal>
        )
    }

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