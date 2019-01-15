import PrayUser from "./PrayUser";
import Pray from "./Pray";

export default class Notification {
    constructor(data={}, initModel = true){
        if(initModel) {
            this.init(data);
        }
    }

    init(data) {
        this.contentCode = data.contentCode|| undefined;
        this.uid = data.uid || undefined;
        this.from = data.from && new PrayUser(data.from) || undefined;
        this.isRead = data.isRead || false;
        if( data.created &&  data.created._seconds){
            let newDate = new Date();
            newDate.setTime(data.created._seconds * 1000);
            this.created = newDate;
        }
        else {
            this.created = data.created || undefined;
        }
        this.prayer = data.prayer && new Pray(data.prayer) || undefined;

        this.typeCode = data.typeCode || "private"
    }

}
