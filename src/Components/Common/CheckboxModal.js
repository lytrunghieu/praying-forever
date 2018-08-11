import React from "react";
import ModalBase from "./ModalBase";
import EStyleSheet from 'react-native-extended-stylesheet';
import {View,ScrollView} from "react-native";
import {Colors,globalStyle ,ApplicationStyles} from "../../Themes";
import PropTypes from 'prop-types';
import {Button,Checkbox} from "./";


export default class CheckboxModal extends ModalBase {

    constructor(props){
        super();
        super.constructor();
        this.onPressSubmit = this.onPressSubmit.bind(this);
    }

    onPressSubmit(){
        this.close();
        this.props.onPressSubmit();
    }

    renderOption(option, index){
        return (
          <Checkbox key ={index} text ={option.text} onPress ={option.onPress} index ={index} isChecked ={option.isChecked}/>
        );
    }

    renderContent() {
        const {options,textDone,limitShow} = this.props;
        let  optionsComponent = (
            options.map((op,index) =>{
                return this.renderOption(op,index);
            })
        )

        if(options.length > limitShow){
            optionsComponent = (
                <ScrollView
                    contentContainerStyle ={{width: "100%" }}
                    style ={{height: limitShow * globalStyle.$heightRowNormal}}
                >
                    {optionsComponent}
                </ScrollView>
            );
        }


        return (
            <View style={styles.container}>
                {optionsComponent}
                <View style ={ApplicationStyles.button.container}>
                    <Button text={textDone}
                            onPress={this.onPressSubmit}
                    />
                </View>
            </View>
        )
    }
}

CheckboxModal.defaultProps = {
    limitShow : 4,
    onPressSubmit : () =>{}
}

CheckboxModal.propTypes = {
    options : PropTypes.array.isRequired,
    textDone : PropTypes.string.isRequired,
    limitShow : PropTypes.number,
    onPressSubmit : PropTypes.func,
}


const styles = EStyleSheet.create({
    container: {
        width: 284,
        backgroundColor: Colors.primary,
        alignItems: "center",
    },


});