import actionTypes from "./actionTypes";
import firebase from 'react-native-firebase';

const uniqueId = require('react-native-unique-id');
import {prayerService, locationService} from "../Service";

export function getPrayer({userUID, prayerUID, search} = {}) {
    return function (dispatch) {
        dispatch({
            type: actionTypes.GET_PRAYER_PENDING,
        });

        new prayerService().getPrayer({userUID, prayerUID, search}).then(res => {
            if (res.success) {
                dispatch({
                    type: actionTypes.GET_PRAYER_SUCCESS,
                    data: {
                        payload: res.data
                    }
                });

            }
            else {
                dispatch({
                    type: actionTypes.GET_PRAYER_FAILED,
                    data: {
                        message: res.message
                    }
                });
            }
        });
    }
}

export function updateStatusPrayer(params) {
    return function (dispatch) {
        dispatch({
            type: actionTypes.UPDATE_STATUS_PRAYER_PENDING,
        });
        new prayerService().updateStatusPrayer(params).then(res => {
            if (res.success) {
                dispatch({
                    type: actionTypes.UPDATE_STATUS_PRAYER_SUCCESS,
                });
                dispatch(getPrayer());
            }
            else {
                dispatch({
                    type: actionTypes.UPDATE_STATUS_PRAYER_FAILED,
                    data: {
                        message: res.message
                    }
                });
            }
        });
    }
}

export function deletePrayer(params) {
    return function (dispatch) {
        dispatch({
            type: actionTypes.DELETE_PRAYER_PENDING,
        });
        new prayerService().deletePrayer(params).then(res => {
            if (res.success) {
                dispatch({
                    type: actionTypes.DELETE_PRAYER_SUCCESS,
                });
                dispatch(getPrayer());
            }
            else {
                dispatch({
                    type: actionTypes.DELETE_PRAYER_FAILED,
                    data: {
                        message: res.message
                    }
                });
            }
        });
    }
}

export function deletePray(params) {
    return function (dispatch) {
        dispatch({
            type: actionTypes.DELETE_PRAYER_SUCCESS,
            data: params
        });
    }
}

export function followingPrayer(params) {
    return function (dispatch) {
        dispatch({
            type: actionTypes.FOLLOWING_PRAYER_PENDING,
        });
        new prayerService().followingPrayer(params).then(res => {
            if (res.success) {
                dispatch({
                    type: actionTypes.FOLLOWING_PRAYER_SUCCESS,
                });
                dispatch(getPrayer());
            }
            else {
                dispatch({
                    type: actionTypes.FOLLOWING_PRAYER_FAILED,
                    data: {
                        message: res.message
                    }
                });
            }
        });
    }
}

export function updateLiveStatusPrayer({live = false, prayerUID}) {
    return function (dispatch) {
        dispatch({
            type: actionTypes.UPDATE_STATUS_PRAYER_PENDING,
        });
        //get location to public prayer
        if (live) {
            return new locationService().getLocationPermission().then(res => {
                if (res.success) {
                    return new locationService().getCurrentLocation().then(_res => {
                        if (_res.success) {
                            return new prayerService().updateLiveStatusPrayer({
                                live,
                                prayerUID,
                                location: _res.data
                            }).then(__res => {
                                if (__res.success) {
                                    dispatch({
                                        type: actionTypes.UPDATE_LIVE_STATUS_SUCCESS,
                                    });
                                    dispatch(getPrayer());
                                }
                                else {
                                    dispatch({
                                        type: actionTypes.UPDATE_LIVE_STATUS_FAILED,
                                        data: {
                                            message: __res.message
                                        }
                                    });
                                }
                            })
                        }
                        else {
                            dispatch({
                                type: actionTypes.UPDATE_LIVE_STATUS_FAILED,
                                data: {
                                    message: _res.message
                                }
                            });
                        }
                    })
                }
                else {
                    dispatch({
                        type: actionTypes.UPDATE_LIVE_STATUS_FAILED,
                        data: {
                            message: res.message
                        }
                    });
                }
            })
        }
        else {
            //disabled live status
            return new prayerService().updateLiveStatusPrayer({live, prayerUID}).then(__res => {
                if (__res.success) {
                    dispatch({
                        type: actionTypes.UPDATE_LIVE_STATUS_SUCCESS,
                    });
                    dispatch(getPrayer());
                }
                else {
                    dispatch({
                        type: actionTypes.UPDATE_LIVE_STATUS_FAILED,
                        data: {
                            message: __res.message
                        }
                    });
                }
            })
        }

    }
}

export function getPrayersNearby({distance}) {
    return function (dispatch) {
        dispatch({
            type: actionTypes.GET_PRAYER_NEARBY_PENDING,
        });
        return new locationService().getLocationPermission().then(res => {
            if (res.success) {
                return new locationService().getCurrentLocation().then(_res => {
                    if (_res.success) {
                        return new prayerService().getPrayersNearby({distance, location: _res.data}).then(__res => {
                            if (__res.success) {
                                dispatch({
                                    type: actionTypes.GET_PRAYER_NEARBY_SUCCESS,
                                    data: {
                                        payload: __res.data
                                    }
                                });

                            }
                            else {
                                dispatch({
                                    type: actionTypes.GET_PRAYER_NEARBY_FAILED,
                                    data: {
                                        message: __res.message
                                    }
                                });
                            }
                            return __res
                        });
                    }
                    else {
                        dispatch({
                            type: actionTypes.GET_PRAYER_NEARBY_FAILED,
                            data: {
                                message: _res.message
                            }
                        });
                    }
                })
            }
            else {
                dispatch({
                    type: actionTypes.GET_PRAYER_NEARBY_FAILED,
                    data: {
                        message: res.message
                    }
                });
            }
            return res;
        });
    }
}