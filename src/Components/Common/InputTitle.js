import React ,{PureComponent} from "react";
import {Input} from "./";
import EStyleSheet from 'react-native-extended-stylesheet';
import {Images, Colors,ApplicationStyles} from "../../Themes";
import {View, TouchableOpacity,Image} from "react-native";

export default class InputTitle extends PureComponent {

    render(){
        return(
            <View style ={[styles.container, ApplicationStyles.screen.shadowContainer]}>
            <Input {...this.props} fit ={true}/>
                <TouchableOpacity style ={styles.rightButtonContainer}>
                    <Image
                        source ={Images.suggest}
                    />
                </TouchableOpacity>
            </View>
        );
    }
}

const  styles = EStyleSheet.create({

    container :{
        flexDirection: "row",
        backgroundColor :Colors.primary,
        alignItems:"center"
    },

    rightButtonContainer : {
        paddingLeft: 10,
        paddingRight: 10,
    }



});

