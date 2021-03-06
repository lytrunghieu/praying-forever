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



  constructor(props){
    super();
  }

  onPressOption(screen){
      const { navigation: { navigate } } = this.props;
      navigate(screen);
  }

  render() {
    const { navigation: { navigate }, logout, activeItemKey ,prays } = this.props;
    const praysFinished = prays.filter(e => e.isFinished);

    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.body}>
          <Option text={"Praying"} count={prays.length - praysFinished.length}  leftIcon ={Images.inProgress} onPress ={this.onPressOption.bind(this,ScreenKey.PRAYING_INPROGESS)} />
          <Option text={"Complete"}  count={praysFinished.length}    leftIcon ={Images.complete} onPress ={this.onPressOption.bind(this,ScreenKey.PRAY_FINISHED)}/>
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
  return {
      prays: state.commonReducer.prays
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
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
