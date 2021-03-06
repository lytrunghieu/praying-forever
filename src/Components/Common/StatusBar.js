// Libraries
import React, { PureComponent } from 'react';
import { Platform, StyleSheet, StatusBar, Image, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import PropTypes from 'prop-types';

// Utilities
import { Colors, Metrics, Fonts } from '../../Themes';
import { CommonUtils } from '../../Utils';

//Components

export default class StatusBarLight extends PureComponent {

  render() {

    return (Platform.OS === 'android' && Platform.Version >= 21 && this.props.custom ?
      (
        <Image style={styles.statusBarBG} source={this.props.source}>
          <StatusBar animated
            backgroundColor="rgba(0,0,0,0)"
            barStyle="liight-content"
            translucent={true}
            {...this.props}
          />
        </Image>
      ) : (
        <View style={[styles.statusBarBG, { backgroundColor: this.props.backgroundColor || 'white' }]}>
          <StatusBar
            backgroundColor="rgba(0,0,0,0)"
            translucent={false}
            barStyle="light-content"
            {...this.props}
          />
        </View>
      )
    )
  }
}

StatusBarLight.defaultProps = {
  custom: false
};

StatusBarLight.propsType = {
  custom: PropTypes.bool
}

const styles = StyleSheet.create({
  statusBarBG: {
    marginBottom: Platform.OS === 'ios' ? 0 : -CommonUtils.getStatusBarHeight(),
    height: CommonUtils.getStatusBarHeight(),},
});