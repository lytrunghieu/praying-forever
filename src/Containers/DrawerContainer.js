// Libraries
import React, { PureComponent } from 'react'
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native'
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';

// Utilities
import I18n from '../I18n';
import { ScreenKey } from '../Constants';
import { Images, Colors, Metrics } from '../Themes';
import { CommonUtils } from '../Utils';
import {Option} from "../Components/Common"

//Components
import Button from '../Components/Common/Button';

// Reduxes
import AuthenticateActions from '../Redux/AuthenticateRedux';

class DrawerContainer extends PureComponent {

  render() {
    const { navigation: { navigate }, logout, activeItemKey } = this.props;

    return (
      <View style={styles.container}>

        <ScrollView contentContainerStyle={styles.body}>
          <Option text={"Praying"}   leftIcon ={Images.inProgress} />
          <Option text={"Complete"}   leftIcon ={Images.complete} />
          <Option text={"About"}   leftIcon ={Images.about} />
          <Option text={"Setting"}   leftIcon ={Images.setting} />
        </ScrollView>
      </View>
    )
  }

  changeforegroundRowFocusStyle = (activeItemKey, screen) => {

    try {
      if (activeItemKey === screen) {
        return styles.foregroundRowFocus;
      }
      return {};
    } catch (error) {
      console.log('changeforegroundRowFocusStyle error: ', error);
      return {};
    }
  }

  changeForegroundTextStyle = (activeItemKey, screen) => {
    try {
      if (activeItemKey === screen) {
        return styles.textRowFocus;
      }
      return { color: Colors.black };
    } catch (error) {
      console.log('changeForegroundTextStyle error: ', error);
      return { color: Colors.black };
    }
  }

  changeForegroundIconStyle = (activeItemKey, screen) => {
    try {
      if (activeItemKey === screen) {
        return Colors.white;
      }
      return Colors.black;
    } catch (error) {
      console.log('changeForegroundTextStyle error: ', error);
      return Colors.black;
    }
  }
}

const mapStateToProps = (state) => {

  // CommonUtils.log('DrawerContainer mapStateToProps state: ', state)
  return {

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(AuthenticateActions.logout())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContainer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 0.4,
    backgroundColor: Colors.blueSky,
    alignItems: 'center',
    justifyContent: 'center'
  },
  body: {
    flex: 0.6
  },
  avatarWrapper: {
    backgroundColor: Colors.white,
    borderRadius: 50
  },
  avatarImage: {
    width: 100,
    height: 100
  },
  buttonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: Metrics.screenWidth,
    height: 50,
    // backgroundColor: 'green',
    marginTop: 10,
    marginBottom: 10,
  },
  labelButtonText: {
    color: Colors.black,
    // fontSize: 10
    // fontWeight: 'bold',
  },
  iconWrapper: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'yellow',

  },
  labelButtonWrapper: {
    flex: 0.8,
    alignItems: 'flex-start',
    // backgroundColor: 'blue',
  },
  foregroundRowFocus: {
    backgroundColor: Colors.blueSky,
    borderRadius: 0
  },
  textRowFocus: {
    color: Colors.white
  }

})
