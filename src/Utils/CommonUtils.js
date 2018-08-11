import {Dimensions, StatusBar, Platform, AsyncStorage} from 'react-native';

import {Device} from '../Constants';
import DebugConfig from '../Config/DebugConfig';

// See https://mydevice.io/devices/ for device dimensions
const X_WIDTH = 375;
const X_HEIGHT = 812;

const isIPhoneX = () => {
    const {height: D_HEIGHT, width: D_WIDTH} = Dimensions.get('window');

    return Platform.OS === 'ios' &&
        ((D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH) ||
            (D_HEIGHT === X_WIDTH && D_WIDTH === X_HEIGHT));
}

// const getStatusBarHeight = () => {

//   return Platform.OS === 'ios' && isIPhoneX() ? Device.IOS_X_STATUS_BAR_HEIGHT : Platform.OS === 'ios' ? Device.IOS_STATUS_BAR_HEIGHT : StatusBar.currentHeight;   
// }

export default {

    // isIPhoneX() {
    //   const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get('window');

    //   return Platform.OS === 'ios' &&
    //     ((D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH) ||
    //       (D_HEIGHT === X_WIDTH && D_WIDTH === X_HEIGHT));
    // },

    retrieveData(key) {
        return AsyncStorage.getItem(key, (err, result) => {
            console.log("Error retrieve date:", err);
            console.log("Retrieve data result: ", result);
        });
    },

    deleteData(key) {
        if (key) {
            return AsyncStorage.removeItem(key, (err, result) => {
                console.log("Error delete data:", err);
                console.log("Delete data result: ", result);
            });
        }
        else {
            return AsyncStorage.clear(err => {
                console.log("Error clear data:", err);
            });
        }


    },

    async storeData(key = "", data = {}) {
        try {
            const jsonObject = JSON.stringify(data);
            await AsyncStorage.setItem(key, jsonObject);
        } catch (error) {
            // Error saving data
            console.log("Error saving data:", error);
        }
    },

    getStatusBarHeight() {

        return Platform.OS === 'ios' && isIPhoneX() ? Device.IOS_X_STATUS_BAR_HEIGHT : Platform.OS === 'ios' ? Device.IOS_STATUS_BAR_HEIGHT : StatusBar.currentHeight;
    },

    log(...arg) {
        if (DebugConfig.isShowLog) {
            console.log(...arg);
        }
    },

    trim(str) {
        if (!str) {
            return str;
        }
        return str.replace(/\s/g, '');
    },

}