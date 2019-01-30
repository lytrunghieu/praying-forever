import EStyleSheet from 'react-native-extended-stylesheet';
import {Colors, Metrics}from "../../../Themes";

const style = EStyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        top: 0,
        left: 0,
        width: Metrics.screenWidth,
        height: Metrics.screenHeight,
    }

});
export {
    style
};

export default module.exports