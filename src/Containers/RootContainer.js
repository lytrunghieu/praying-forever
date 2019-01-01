// Libraries
import React, {PureComponent} from 'react';
import {View, Keyboard} from 'react-native';
import {connect} from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import {SafeAreaView} from 'react-navigation';

// Utilities
import {Colors} from '../Themes';

// Components
import StatusBar from '../Components/Common/StatusBar';

//Reduxes
import StartupActions from '../Redux/StartupRedux';

import {prayerActions} from '../Action';

// Persist
import ReduxPersist from '../Config/ReduxPersist';

// Navigation
import ReduxNavigation from '../Navigation/ReduxNavigation';

import {EventRegisterTypes} from "../Constants";
import {EventRegister} from 'react-native-event-listeners';
import {bindActionCreators} from 'redux';
import firebase, {Notification, NotificationOpen} from 'react-native-firebase';
// const collect = firebase.firestore().collection('prayer');
// const docOfCurrentUserPray = collect.doc(firebase.auth().currentUser.uid);

class RootContainer extends PureComponent {
    componentDidMount() {
        // if redux persist is not active fire startup action
        if (!ReduxPersist.active) {
            this.props.startup()
        }
    }

    componentWillUnmount(){
        EventRegister.removeEventListener(this.listener)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.navigationReducer !== this.props.navigationReducer) {
            Keyboard.dismiss();
        }
    }


    render() {

        return (
            <View style={styles.container}>
                <StatusBar backgroundColor={Colors.primary} barStyle={'dark-content'}/>
                <SafeAreaView style={styles.container}>
                    <ReduxNavigation/>
                </SafeAreaView>

            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    navigationReducer: state.navigationReducer
})

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({
    startup: () => dispatch(StartupActions.startup()),
    prayersActions: bindActionCreators(prayerActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer);

const styles = EStyleSheet.create({
    container: {
        flex: 1,
    }
});
