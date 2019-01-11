import React ,{PureComponent} from "react";
import {Option,Text} from "./";
import {Images,Colors}from "../../Themes";
import {View} from "react-native";

import {ListItem,Body,CheckBox}  from "native-base";

const Checkbox = ({text, checked,onPress = ()=>{}}) =>{

    return (
        <ListItem onPress ={onPress}>
            <View pointerEvents={"none"}>
            <CheckBox checked={checked} color ={Colors.black} />
            </View>
            <Body>
            <Text>{text}</Text>
            </Body>
        </ListItem>
    )
}

export default Checkbox


