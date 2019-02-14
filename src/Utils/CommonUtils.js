import {Dimensions, StatusBar, Platform, AsyncStorage,Linking} from 'react-native';
import I18n from "../I18n";
import {Device,universalLink} from '../Constants';
import DebugConfig from '../Config/DebugConfig';
import { EventRegister } from 'react-native-event-listeners';
import DeviceInfo from "react-native-device-info";


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

    validateEmail(email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },

    validatePassword(pass) {
        let re = /^[a-zA-Z0-9]{6,}$/;
        return re.test(String(pass));
    },

    sendEvent(action){
        EventRegister.emit("listener" , action);
    },

    sendEmail(){
        Linking.canOpenURL(universalLink.FEEDBACK).then(supported => {
            if (!supported) {
                console.error('Can\'t handle url: ' + universalLink.FEEDBACK);
            } else {
                let footer = "\n\n\n\n{yourInfo}\n{version}: {Version}\n{deviceModel}: {Device Model}\n{platform}: {OS}";
                const Version = DeviceInfo.getVersion();
                const Model = DeviceInfo.getModel();
                const OS = DeviceInfo.getSystemName().concat(" ").concat(DeviceInfo.getSystemVersion());
                footer = footer.replace("{Version}", Version)
                    .replace("{Device Model}", Model)
                    .replace("{OS}", OS)
                    .replace("{yourInfo}", I18n.t("yourInfo"))
                    .replace("{version}", I18n.t("version"))
                    .replace("{deviceModel}", I18n.t("deviceModel"))
                    .replace("{platform}",  I18n.t("platform"))
                ;
                const url = universalLink.FEEDBACK.replace("{body}", footer);
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err));
    }

}