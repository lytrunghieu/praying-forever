// Libraries
import React, {PureComponent} from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import {Content} from 'native-base';

export default class ContentComponent extends PureComponent {

    render() {
        const {children,...rest} = this.props;


        return (
            <Content style ={styles.container} {...rest}>{children}</Content>
        );
    }
}

ContentComponent.defaultProps = {};

ContentComponent.propTypes = {}

const styles = EStyleSheet.create({
    container :{
        paddingLeft:"$padding",
        paddingRight:"$padding"
    }
});