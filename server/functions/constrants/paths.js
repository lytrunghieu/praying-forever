// const paths = {
//     pray : "pray/{userUID}/data/{prayUID}",
// };

exports.pray = "pray/{userUID}/data/{prayUID}"
exports.collectPray ="pray/{userUID}/data";
exports.deletePray = "pray/{userUID}/data/{prayUID}"
exports.deleteAllPray = "pray/{userUID}/data"

exports.notification = "notification/{userUID}/data";
exports.deleteNotification = "notification/{userUID}/data/{notifUID}"
exports.deleteAllNotification = "notification/{userUID}/data"

exports.profileUser ="profile/{userUID}"
