// Libraries
import React, {PureComponent} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import {TextBase, Icon} from '../Common';
import {Colors, Metrics} from '../../Themes';
import {Button} from 'native-base';

export default class ButtonComponent extends PureComponent {


    render() {
        const {onPress, children, transparent, action, rounded, iconLeft, icon, text, large, center, disabled, ...rest} = this.props;

        if (rounded) {
            return (
                <Button
                    style={[styles.roundedStyle, center ? styles.center : null, disabled]}
                    rounded small onPress={onPress}
                    disabled={disabled}
                >
                    {
                        iconLeft && icon && <Icon dark={false} name={icon}/>
                    }


                    <TextBase style={styles.labelText} bold={true}
                              highlight={true}>{text && text.toUpperCase()}</TextBase>
                    {
                        !iconLeft && icon && <Icon dark={false} name={icon}/>
                    }
                </Button>
            )
        }


        return (

            <Button transparent={transparent} onPress={onPress}  {...rest}  >
                {children}
            </Button>

        );
    }
}

ButtonComponent.defaultProps = {
    transparent: false

};

ButtonComponent.propTypes = {
    transparent: PropTypes.bool,
    text: PropTypes.string,
    icon: PropTypes.string,
    iconLeft: PropTypes.bool,
    rounded: PropTypes.bool

}


const styles = EStyleSheet.create({


    buttonDisabled: {
        backgroundColor: Colors.disable,
    },

    roundedStyle: {
        backgroundColor: Colors.black,
        flexDirection: "row",
        justifyContent: "center",
        minWidth: 100,
        maxWidth: 200,
    },

    center: {
        alignSelf: "center"
    },

    labelText: {
        minWidth: 100 - Metrics.icons.small,
        maxWidth: 200 - Metrics.icons.small,
        alignSelf: "center",
        textAlign: "center"
    },

});