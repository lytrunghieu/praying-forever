// const paths = {
//     prayer : "prayer/{userUID}/data/{prayUID}",
// };

exports.prayer = "prayer/{userUID}/data/{prayUID}"
exports.collectPrayerOfUser ="prayer/{userUID}/data";
exports.specificPrayerOfUser ="prayer/{userUID}/data/{prayerUID}";
exports.deletePray = "prayer/{userUID}/data/{prayUID}"
exports.deleteAllPray = "prayer/{userUID}/data"

exports.notification = "notification/{userUID}/data";
exports.deleteNotification = "notification/{userUID}/data/{notifUID}"
exports.deleteAllNotification = "notification/{userUID}/data"

exports.profileUser ="profile/{userUID}"
