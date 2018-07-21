import React ,{PureComponent} from "react";
import {Input} from "./";
import EStyleSheet from 'react-native-extended-stylesheet';
import {Images, Colors,ApplicationStyles} from "../../Themes";
import {View, TouchableOpacity,Image} from "react-native";
import PropTypes from 'prop-types';

export default class InputTitle extends PureComponent {

    render(){
        const {onPressSuggest} = this.props;
        return(
            <View style ={[styles.container, ApplicationStyles.screen.shadowContainer]}>
            <Input {...this.props} fit ={true}/>
                <TouchableOpacity style ={styles.rightButtonContainer}
                    onPress ={onPressSuggest}
                >
                    <Image
                        source ={Images.suggest}
                    />
                </TouchableOpacity>
            </View>
        );
    }
}

InputTitle.defaultProps = {
    onPressSuggest : () =>{},
}

InputTitle.propsTypes = {
    onPressSuggest : PropTypes.func
}



const  styles = EStyleSheet.create({

    container :{
        flexDirection: "row",
        backgroundColor :Colors.primary,
        alignItems:"center",

    },

    rightButtonContainer : {
        paddingLeft: 10,
        paddingRight: 10,
    }
});

