// Libraries
import React, {PureComponent} from 'react';
import {Image, View, TouchableOpacity} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import {Colors, Fonts, IconName} from '../../Themes';
import {Icon} from "../Common";
import {URL} from "../../Constants"

export default class Avatar extends PureComponent {

    constructor(props) {
        super(props);
        this.userUID = props.uid;
        this.state = {
            uri: props.uri || URL.avatar.replace("{userUID}", this.userUID).replace("{t}", new Date().getTime()),
        }
        this.refresh = this.refresh.bind(this);
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.uri !== this.props.uri) {
            this.setState({
                uri: nextProps.uri
            });
        }
    }

    componentDidMount() {

    }

    refresh() {
        this.setState({
            uri: URL.avatar.replace("{userUID}", this.userUID).replace("{t}", new Date().getTime()),
        });
    }

    render() {
        const {large, largeX, medium, smallest, onPress, ...rest} = this.props;
        let size = 24;
        let _color = Colors.black;
        if (large) {
            size = 40;
        }
        if (largeX) {
            size = 100;
        }

        else {
            if (medium) {
                size = 32;
            }
            else {
                if (smallest) {
                    size = 14
                }
            }
        }
        const {uri} = this.state;
        return (
            <TouchableOpacity style={{width: size, height: size}}
                              disabled={onPress ? false : true}
                              onPress={onPress ? onPress : () =>{}}
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
    onPress: PropTypes.func
}


const styles = EStyleSheet.create({

    container: {
        borderRadius: 100,
        position: "absolute",
        left: 0,
        top: 0,
    }

});