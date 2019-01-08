
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