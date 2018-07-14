import React from "react";
import ModalBase from "./ModalBase";
import EStyleSheet from 'react-native-extended-stylesheet';
import {View} from "react-native";
import {Colors,ApplicationStyles} from "../../Themes";
import PropTypes from 'prop-types';
import {Button, Option} from "./";

export default class ActionSheet extends ModalBase {

    constructor(props){
        super(props);
        super.constructor(props);
        this.isCenter = false;
        this.backdropOpacity = 0;
        this.onPressOption = this.onPressOption.bind(this);
    }

    onPressOption(cb){
        //auto close when pressed
        if(this.props.closeWhenPress){
            this.close();
        }
        //callback
        if(cb){
            cb();
        }

    }

    renderOptionRow(option ={text : "", color : Colors.black , onPress :() =>{}}, index) {
        return (
            <Option text={option.text}
                    key={index}
                    textColor={option.color}
                    onPress={this.onPressOption.bind(this,option.onPress)}
                    textIsCenter={true}
            />
        )
    }

    renderContent() {
        const {options} = this.props;
        return (
            <View style={[styles.container,ApplicationStyles.screen.shadowContainerUp]}>
                {options.map((op, index) => {
                   return this.renderOptionRow(op, index);
                })}
                <View style ={styles.buttonContainer}>
                    <Button text={"CANCEL"}
                        onPress={this.close}
                    />
                </View>
            </View>
        );
    }
}

ActionSheet.defaultProps  = {
    closeWhenPress : true,
}

ActionSheet.propTypes = {
    options: PropTypes.array.isRequired
}

const styles = EStyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: Colors.primary,
        alignItems: "center",
    },
    
    buttonContainer:{
        height : 84,
        justifyContent:"center"
    }

});