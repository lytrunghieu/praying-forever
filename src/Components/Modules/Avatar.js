// Libraries
import React, {PureComponent} from 'react';
import {Image, View, TouchableOpacity} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import {Colors, Fonts, IconName,Metrics} from '../../Themes';
import {Icon} from "../Common";
import {URL} from "../../Constants"

export default class Avatar extends PureComponent {

    constructor(props) {
        super(props);
        this.userUID = props.uid;
        this.state = {
            uri: props.uri || URL.avatar.replace("{userUID}", this.userUID).replace("{t}", new Date().getTime()),
        }
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.uri !== this.props.uri) {
            this.setState({
                uri: nextProps.uri
            });
        }
        if(nextProps.uid !==  this.props.uid){
            this.setState({
                uri:  URL.avatar.replace("{userUID}", nextProps.uid).replace("{t}", new Date().getTime())
            });
        }
    }

    componentDidMount() {

    }

    render() {
        const {large, largeX, medium, smallest, onPress, ...rest} = this.props;
        let size = Metrics.icons.small;
        let _color = Colors.black;
        if (large) {
            size = Metrics.icons.large;
        }
        if (largeX) {
            size = Metrics.icons.xl;
        }

        else {
            if (medium) {
                size = Metrics.icons.medium;
            }
            else {
                if (smallest) {
                    size = Metrics.icons.tiny
                }
            }
        }
        const {uri} = this.state;
        return (
            <TouchableOpacity style={{width: size, height: size}}
                              disabled={onPress ? false : true}
                              onPress={onPress ? onPress : () =>{}}
                              activeOpacity={1}
            >
                <Icon name={IconName.avatar} large={large} largeX={largeX}/>
                <Image
                    source={{
                        uri: uri,
                    }}
                    style={[styles.container, {width: size, height: size}]}
                    resizeMode="cover"
                />
            </TouchableOpacity>
        );
    }
}

Avatar.defaultProps = {};

Avatar.propTypes = {
    uid: PropTypes.string,
    onPress: PropTypes.func,
    uri : PropTypes.string
}


const styles = EStyleSheet.create({

    container: {
        borderRadius: 100,
        position: "absolute",
        left: 0,
        top: 0,
    }

});