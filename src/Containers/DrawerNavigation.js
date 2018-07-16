
import {StackNavigator, TabNavigator, TabBarBottom, DrawerNavigator} from 'react-navigation';
import DrawerStack from "./DrawerContainer"
const DrawerNavigation = StackNavigator({
    DrawerStack: { screen: DrawerStack }
}, {
    headerMode: 'float',
    navigationOptions: ({navigation}) => ({
        headerStyle: {backgroundColor: '#4C3E54'},
        title: 'Welcome!',
        headerTintColor: 'white',
    })
})