import I18n from "../I18n";

export const FOLLOWING = {
    NOT_FOUND_PRAYER:{
        ERROR_CODE : 401,
        MESSAGE : I18n.t("notFoundPrayer"),
    },
    PRAYER_HAD_FOLLOWING:{
        ERROR_CODE : 402,
        MESSAGE : I18n.t("prayerHadFollowing"),
    },
    PRAYER_HAD_UN_FOLLOWING:{
        ERROR_CODE : 403,
        MESSAGE : I18n.t("prayerHadUnFollowing"),
    }
};

export default module.exports