import EStyleSheet from 'react-native-extended-stylesheet';
import {Colors}from "../../../Themes";

const style = EStyleSheet.create({
    form: {
        padding: "$padding",
        backgroundColor: Colors.primary,
        borderRadius: "$borderRadiusSmall"
    },


});
export {
    style
};

export default module.exports