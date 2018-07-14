import React ,{PureComponent} from "react";
import {Option} from "./";
import {Images}from "../../Themes"

const Checkbox = ({text,iconActive = Images.checkOn , iconDeactive  = Images.checkOff, isChecked,onPress = ()=>{}, index = -1}) =>{

    const leftIcon = isChecked ? iconActive : iconDeactive;

    return (
        <Option
            text={text}
            leftIcon ={leftIcon}
            onPress={onPress.bind(this,index)}
        />
    );
}

export default Checkbox


