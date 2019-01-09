import EStyleSheet from 'react-native-extended-stylesheet';
import {Colors}from "../../../Themes";

const style = EStyleSheet.create({
    container: {
        backgroundColor: Colors.whiteTransparent,
    },

    content: {
        paddingRight: "$padding"
    },

    scrollView: {
        flex: 1,
    },

    body: {
        // flex: 1,
        alignItems: 'center',
        paddingLeft: "$padding",
        paddingRight: "$padding"
    },

    containerTextLinks: {
        height :"$heightRowNormal",
        justifyContent:"center"
    }

});
export {
    style
};

export default module.exports