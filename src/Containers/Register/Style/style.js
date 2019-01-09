import EStyleSheet from 'react-native-extended-stylesheet';
import {Colors} from "../../../Themes";

const style = EStyleSheet.create({
    container: {
        backgroundColor: "transparent",
    },

    content: {
        paddingRight: "$padding",
        paddingLeft: "$padding",
        paddingTop: "$padding",
        // backgroundColor:"transparent",
    },

    scrollView: {
        flex: 1,
    },

    body: {
        paddingLeft: "$padding",
        paddingRight: "$padding"
    },

    form: {
        padding: "$padding",
        backgroundColor: Colors.primary,
        borderRadius: "$borderRadiusSmall"
    },

    buttonNext: {
        alignSelf: "flex-end",
        backgroundColor: Colors.black,
        flexDirection:"row",
        justifyContent:"center",
        minWidth:100,
    },

    buttonBack :{
        backgroundColor: Colors.black,
        justifyContent:"center",
        minWidth:100,
    }

});
export {
    style
};

export default module.exports