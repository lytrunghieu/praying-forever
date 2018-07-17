
import React, {PureComponent} from 'react';
import {TouchableOpacity, Image} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';

import {Colors,Images,ApplicationStyles} from '../../Themes';

export default class ButtonAction extends PureComponent {


    render() {
        let {onPress} = this.props;
        return (
            <TouchableOpacity onPress={() => onPress()}
                              style={[styles.container,ApplicationStyles.button.shadowCenter]}>

               <Image source ={Images.plus}/>
            </TouchableOpacity>
        )
    }
}

ButtonAction.defaultProps = {
    onPress: () => {
    },

};

ButtonAction.propTypes = {
    onPress: PropTypes.func,
}


const styles = EStyleSheet.create({
    container: {
        position:"absolute",
        right :20,
        bottom : 20,
    },


});