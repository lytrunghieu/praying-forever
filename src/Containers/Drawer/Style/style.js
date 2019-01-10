import EStyleSheet from 'react-native-extended-stylesheet';

const style = EStyleSheet.create({
    test: {
        backgroundColor: "blue"
    },

    profileContainer: {
        paddingTop:"$padding",
        paddingBottom:"$padding",
        alignItems:"center"
    },

});
export {
    style
};

export default module.exports