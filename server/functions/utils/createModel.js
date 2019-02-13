
exports.createLocationModel = function (data) {
    let result = {};
    if(!data ){
        return null;
    }
    result.lat = data.lat || null;
    result.long = data.long || null;
    result.timestamp  = data.timestamp || null;
    if(!result.lat || !result.long){
        return null;
    }

    return result;
}

exports.prayer = function (data) {
    let result = {};
    if(!data ){
        return null;
    }
    return result;
}

exports.notificationModel = function (data) {
    let result = {};
    if(!data ){
        return null;
    }
    result.contentCode = data.contentCode || null;
    result.from = data.from || null;
    result.uid = data.uid || null;
    result.created  = data.created || null;
    result.isRead  = data.isRead || false;
    result.typeCode  = data.typeCode || "private"; // public or private
    result.prayer = data.prayer || null;
    if(!result.contentCode || !result.from){
        return null;
    }
    return result;
}

exports.reportModel  = function (data) {
    let result = {};
    if(!data ){
        return null;
    }
    result.sender = data.sender || null;
    result.reportType = data.reportType || null;
    result.reportMessage = data.reportMessage || null;
    result.created  = data.created || null;
    result.user = data.user || null;
    result.prayer = data.prayer || null;
    result.excuted = data.excuted || false;
    return result;
}