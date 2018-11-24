import React ,{PureComponent} from "react";
import {Option,Text} from "./";
import {Images,Colors}from "../../Themes";
import {CheckBox} from "native-base";

import {ListItem,Body}  from "native-base";

const Checkbox = ({text, checked,onPress = ()=>{}}) =>{

    return (
        <ListItem onPress ={onPress}>
            <CheckBox checked={checked} color ={Colors.black} />
            <Body>
            <Text>{text}</Text>
            </Body>
        </ListItem>
    )


    return (
        <Option
            text={text}
            leftIcon ={leftIcon}
            onPress={onPress.bind(this,index)}
        />
    );
}

export default Checkbox


