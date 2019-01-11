// Libraries
import React, {PureComponent} from 'react';
import {Platform, View, TouchableOpacity, Text} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';

// Utilities
import {Colors, Metrics} from '../../Themes';

//Components

export default class Icon extends PureComponent {

    render() {

        const {isHideIcon} = this.props;

        return this.renderIcon(this.props);
    }

    renderIcon({name, iconType,large,medium,largeX, dark, color, error, success, smallest}) {
        let size = 24;
        let _color = Colors.black;
        if(large){
            size = 40;
        }
        if(largeX){
            size = 100;
        }

        else {
            if(medium){
                size = 32;
            }
            else{
                if(smallest){
                    size = 14
                }
            }
        }

        if(!dark){
            _color = Colors.white;
        }

        if(error){
            _color = Colors.error
        }

        if(success){
            _color = Colors.success
        }

        let MaterialCommunityIconsView = null;

        switch (iconType) {
            case 'MaterialCommunityIcons':

                MaterialCommunityIconsView = (<MaterialCommunityIcons name={name} size={size} color={_color}/>);
                return MaterialCommunityIconsView;
            case 'Ionicons':
                const IoniconsView = (<Ionicons name={name} size={size} color={_color}/>);
                return IoniconsView;
            case 'Entypo':
                const EntypoView = (<Entypo name={name} size={size} color={_color}/>);
                return EntypoView;

            default:
                const FontAwesomeView = (<FontAwesome name={name} size={size} color={_color}/>);
                return FontAwesomeView;
        }

        // return <MaterialCommunityIcons name={name} size={size} color={color}/>;
    }

}

Icon.defaultProps = {
    isHideIcon: false,
    iconType: null,
    color: Colors.black,
    name: "bars",
    dark : true,

};

Icon.propTypes = {
    isHideIcon: PropTypes.bool,
    iconType: PropTypes.string,
    color: PropTypes.string,
    name: PropTypes.string,
    large : PropTypes.bool,
    medium : PropTypes.bool,
    smallest : PropTypes.bool,
    dark : PropTypes.bool,
    success : PropTypes.bool,
    error : PropTypes.bool,
    largeX: PropTypes.bool
}

const styles = EStyleSheet.create({
    container: {
        // backgroundColor: Colors.blueSky
    },
});