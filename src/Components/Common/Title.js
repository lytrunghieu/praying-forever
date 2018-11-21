import React,{PureComponent} from "react"
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Colors, Fonts} from "../../Themes/index";

import {Title} from 'native-base';

export  default class TitleComponent extends PureComponent {

    render(){
        const {children} = this.props;
        return (<Title  style={styles.title}>{children}</Title>);
    }
}

TitleComponent.defaultProps = {
};

TitleComponent.propTypes = {
};

const styles = EStyleSheet.create({
    title :{
        color :Colors.black
    }
});