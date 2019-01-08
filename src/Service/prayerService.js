import baseService from "./baseService";
import {
    CREATE_PRAYER,
    GET_PRAYER,
    EDIT_PRAYER,
    UPDATE_STATUS_PRAYER,
    DELETE_PRAYER,
    FOLLOWING_PRAYER,
    UPDATE_LIVE_STATUS
} from "./nameCloudFunction"
import moment from "moment";
import {Pray} from "../model";
import {FOLLOWING, PUBLIC_PRAYER} from "./errorCode";

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

    deletePrayer(params) {
        return super.executeHttp(DELETE_PRAYER, {prayerUID: params});
    }

    getPrayer({userUID, prayerUID, search}) {
        return super.executeHttp(GET_PRAYER, {userUID, prayerUID, search}).then(res => {
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


}

export default PrayerService