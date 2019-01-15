// Libraries
import React, {PureComponent} from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import {Content} from 'native-base';

export default class ContentComponent extends PureComponent {

    render() {
        const {children,removePadding,...rest} = this.props;


        return (
            <Content style ={!removePadding ? styles.container : null} {...rest}>{children}</Content>
        );
    }
}

ContentComponent.defaultProps = {};

ContentComponent.propTypes = {
    removePadding : PropTypes.string

}

const styles = EStyleSheet.create({
    container :{
        paddingRight: "$padding",
        paddingLeft: "$padding",
        paddingTop: "$padding",
    }
});