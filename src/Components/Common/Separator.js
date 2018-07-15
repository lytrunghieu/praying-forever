
import React, {PureComponent} from 'react';
import {
    View,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import {Colors} from "../../Themes";
import * as _ from "lodash";


export default class Separator extends PureComponent {

    constructor(props) {
        super(props);
    }

    render() {

        const {height,left,right,top,bottom,padding} = this.props;
        let positionStyle = {};
        if(left){
            positionStyle.left = left;
        }
        if(right){
            positionStyle.right = right;
        }
        if(top){
            positionStyle.top = top;
        }
        if(bottom){
            positionStyle.bottom = bottom;
        }
        if(!_.isEmpty(positionStyle)){
            positionStyle.position = "absolute";
            // positionStyle.paddingLeft =padding;
            // positionStyle.paddingRight =padding;

        }

        return (
            <View style={[styles.main, {height: height} , positionStyle ,{paddingRight :padding , paddingLeft: padding}]}>
                <View style ={styles.divider} />
            </View>
        );
    }
}

Separator.defaultProps = {
    height: 1,
    left : null,
    right : null,
    top : null,
    bottom : null,
    padding : 0
}

Separator.propTypes = {
    height: PropTypes.number
}

const styles = EStyleSheet.create({
    main: {
        width :"100%",
    },

    divider :{
        flex : 1,
        backgroundColor: Colors.gray,
    }
});