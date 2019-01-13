import React, {PureComponent} from "react";
import {
    View,
    Image
} from "react-native";
import {Images} from "../../Themes";
import EStyleSheet from 'react-native-extended-stylesheet';

export default class ImageBackground extends PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Image
                style={style.container}
                source={Images.bg}
                resizeMode={"cover"}
            />


        )
    }

}

const style = EStyleSheet.create({
    container: {
        position:"absolute",
        height: "100%",
        width: "100%",
    }
})
