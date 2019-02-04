import baseService from "./baseService";
import {
    CREATE_PRAYER,
    GET_PRAYER,
    EDIT_PRAYER,
    UPDATE_STATUS_PRAYER,
    DELETE_PRAYER,
    FOLLOWING_PRAYER,
    UPDATE_LIVE_STATUS,
    SYNC_PRAYER
} from "./nameCloudFunction"
import moment from "moment";
import {Pray, response} from "../model";
import {FOLLOWING, PUBLIC_PRAYER} from "./errorCode";
import firebase from "react-native-firebase";
import geolib from "geolib";
import {firestorePaths} from "../Constants";


class PrayerService extends baseService {

    createNewPrayer(params) {
        return super.executeHttp(CREATE_PRAYER, {prayer: params});
    }

    editPrayer(params) {
        return super.executeHttp(EDIT_PRAYER, {prayer: params});
    }

    updateStatusPrayer(params) {
        return super.executeHttp(UPDATE_STATUS_PRAYER, {prayerUID: params});
    }

    deletePrayer({prayerUID, status = 0}) {
        return super.executeHttp(DELETE_PRAYER, {prayerUID: prayerUID, status});
    }

    getPrayer({userUID, prayerUID, status = null, search}) {
        return super.executeHttp(GET_PRAYER, {userUID, prayerUID, status ,search}).then(res => {
            if (res.success && Array.isArray(res.data)) {
                let dataConvert = res.data.map(e => {
                    return new Pray(e);
                });
                dataConvert = dataConvert.sort((a, b) => {
                    if (moment(a.created).isAfter(moment(b.created))) {
                        return -1;
                    }
                    if (moment(a.created).isBefore(moment(b.created))) {
                        return 1;
                    }
                    return 0;
                });
                res.data = dataConvert;

            }
            return res;
        });
    }

    followingPrayer({userOtherUID, prayerUID, follow}) {
        return super.executeHttp(FOLLOWING_PRAYER, {userOtherUID, prayerUID, follow}).then(res => {
            if (!res.success) {
                switch (res.statusCode) {
                    case FOLLOWING.PRAYER_HAD_UN_FOLLOWING.ERROR_CODE : {
                        res.message = PUBLIC_PRAYER.PRAYER_HAD_UN_FOLLOWING.MESSAGE;
                        break;
                    }

                    case FOLLOWING.PRAYER_HAD_FOLLOWING.ERROR_CODE : {
                        res.message = FOLLOWING.PRAYER_HAD_FOLLOWING.MESSAGE;
                        break;
                    }

                    case FOLLOWING.NOT_FOUND_PRAYER.ERROR_CODE : {
                        res.message = FOLLOWING.NOT_FOUND_PRAYER.MESSAGE;
                        break;
                    }
                }
            }
            return res;
        });
    }

    updateLiveStatusPrayer({live = false, prayerUID, location = null}) {
        return super.executeHttp(UPDATE_LIVE_STATUS, {live, prayerUID, location}).then(res => {
            if (!res.success) {
                switch (res.statusCode) {
                    case PUBLIC_PRAYER.PRAYER_HAD_PUBLIC.ERROR_CODE : {
                        res.message = PUBLIC_PRAYER.PRAYER_HAD_PUBLIC.MESSAGE;
                        break;
                    }

                    case PUBLIC_PRAYER.PRAYER_HAD_UN_PUBLIC.ERROR_CODE : {
                        res.message = PUBLIC_PRAYER.PRAYER_HAD_UN_PUBLIC.MESSAGE;
                        break;
                    }

                    case PUBLIC_PRAYER.PRAYER_IS_NOT_USER.ERROR_CODE : {
                        res.message = PUBLIC_PRAYER.PRAYER_IS_NOT_USER.MESSAGE;
                        break;
                    }
                }
            }
            return res;
        });
    }

    getPrayersNearby({distance, location}) {
        const collect = firebase.firestore().collection('location');
        return collect.get({source: "server"}).then(snapshot => {
            let prayList = [];
            snapshot.forEach(e => {
                let data = e.data();
                if (data && data.owner && data.owner.uid != firebase.auth().currentUser.uid) {
                    prayList.push(new Pray(data));
                }
            });
            const {long, lat} = location;
            //filler Pray Live;
            prayList = getNearby({
                fromLong: long,
                fromLat: lat,
                distance: distance,
                array: prayList
            });

            const result = {
                data: {
                    success: true,
                    data: prayList
                }
            };

            return result;
        }).finally(res => {
            return new response(res);
        })

    }

    getTemplatePrayer() {
        const doc = firebase.firestore().doc(firestorePaths.TEMPLATE_PRAYER);
        return doc.get().then(docSnap => {
            const result = {
                data: {
                    success: true,
                    data: null
                }
            };
            const {title} = docSnap.data();
            if (Array.isArray(title)) {
                result.data.data = title;
            }
            return result;
        }).finally(res => {
            return new response(res);
        })
    }

    getTemplateDistancePrayer() {
        const doc = firebase.firestore().doc(firestorePaths.TEMPLATE_DISTANCE_PRAYER);
        return doc.get().then(docSnap => {
            const result = {
                data: {
                    success: true,
                    data: null
                }
            };
            const {value} = docSnap.data();
            if (Array.isArray(value)) {
                result.data.data = value;
            }
            return result;
        }).finally(res => {
            return new response(res);
        })
    }

    syncPrayer({userUID, prayer  }){
        const _userUID  = userUID || firebase.auth().currentUser.uid;
        return super.executeHttp(SYNC_PRAYER,{userUID : _userUID , prayer});
    }
}

export default PrayerService

function getNearby({fromLong, fromLat, distance, array}) {
    if (!Array.isArray(array)) {
        return [];
    }
    return array.filter(p => {
        const {long, lat} = p.isLive;
        const result = geolib.isPointInCircle({latitude: fromLat, longitude: fromLong}, {
            latitude: lat,
            longitude: long
        }, distance);
        return result;
    });
}