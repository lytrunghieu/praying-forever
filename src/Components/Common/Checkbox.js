import React, {PureComponent} from "react";
import {TextBase} from "./";
import {Images, Colors} from "../../Themes";
import {View} from "react-native";

import {ListItem, Body, CheckBox, Left, Right} from "native-base";

const Checkbox = ({
                      text, checked, onPress = () => {
    }
                  }) => {

    return (
        <ListItem icon onPress={onPress}>
            <Left>
                <View pointerEvents="none">
                    <CheckBox checked={checked} color={Colors.black}/>
                </View>
            </Left>
            <Body>
            <TextBase>{text}</TextBase>
            </Body>
        </ListItem>
    )
}

export default Checkbox


