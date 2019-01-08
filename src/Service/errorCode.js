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

export const PUBLIC_PRAYER = {
    PRAYER_HAD_PUBLIC:{
        ERROR_CODE : 403,
        MESSAGE : I18n.t("prayerHadPublic"),
    },
    PRAYER_HAD_UN_PUBLIC:{
        ERROR_CODE : 402,
        MESSAGE : I18n.t("prayerHadUnpublic"),
    },
    PRAYER_IS_NOT_USER:{
        ERROR_CODE : 401,
        MESSAGE : I18n.t("prayerIsUserOwner"),
    }
};

export default module.exports