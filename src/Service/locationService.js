import Permissions from 'react-native-permissions';
import {response, PrayLocation, Pray} from "../model";
import I18n from "../I18n";
import baseService from "./baseService";
import Geolocation from 'react-native-geolocation-service';
import {UPDATE_LIVE_STATUS} from "./nameCloudFunction";

class LocationService extends baseService {
    getLocationPermission() {
        return Permissions.request('location').then(res => {
            let result;
            if (res === "authorized") {
                result = {
                    data: {
                        success: true,
                        statusCode: 200,
                    }
                }
            }
            else {
                result = {
                    data: {
                        success: false,
                        statusCode: 401,
                        message: I18n.t("locationPermissionDenied")

                    }
                }
            }
            return result;
        }).catch(error => {
            console.log("ERROR :", error);
        }).finally(res => {
            return new response(res);
        })
    }

    getCurrentLocation() {
        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
                (position) => {
                    const {timestamp, coords} = position;
                    const {longitude, latitude} = coords || {};
                    const location = new PrayLocation({
                        long: longitude,
                        lat: latitude
                    });
                    let result = {
                        data: {
                            success: true,
                            data: location,
                            statusCode: 200,
                        }
                    };

                    resolve(new response(result));
                },
                (error) => {
                    console.log("ERROR :", error);
                    resolve(new response(error))
                },
                {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
            );
        });
    }
}

export default LocationService
