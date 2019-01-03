import React, {PureComponent} from 'react';
import * as Progress from 'react-native-progress';
import {Dimensions,View} from "react-native";
import {Colors} from "../../Themes";


export default class LoadingIndicator extends PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        const {visible}  = this.props;
        const {width} = Dimensions.get("window");
        return (
            visible ?
                <Progress.Bar
                    borderWidth={0}
                    unfilledColor= {Colors.grayBg}
                    borderColor="transparent"
                    indeterminate={true}
                    animationConfig={{bounciness: 0}}
                    useNativeDriver={true}
                    color ={Colors.blue}
                    borderRadius={0} height={3} animationType="timing" width={width}/> : <View style ={{height : 3}}/>
        );
    }
}

