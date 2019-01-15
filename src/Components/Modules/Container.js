// Libraries
import React, {PureComponent} from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import {Container} from 'native-base';
import {Colors} from '../../Themes';

export default class ContainerComponent extends PureComponent {

    render() {
        const {children,...rest} = this.props;


        return (
            <Container style ={styles.container} {...rest}>{children}</Container>
        );
    }
}

ContainerComponent.defaultProps = {};

ContainerComponent.propTypes = {}

const styles = EStyleSheet.create({
        container :{
            backgroundColor : Colors.grayBg
        }
});