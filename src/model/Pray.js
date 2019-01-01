import PrayUser from "./PrayUser";
import PrayDelete from "./PrayDelete";
import PrayStatus from "./PrayStatus";
import Following from "./Following";
import PrayLocation from "./PrayLocation";
import moment from "moment";


export default class Pray {
    constructor(data={}, initModel = true){
        if(initModel) {
            this.init(data);
        }
    }

    init(data) {
        this.uid = data.uid || null;
        this.title = data.title || null;
        this.content = data.content || null;
        this.owner = data.owner && new PrayUser(data.owner) || null;
        this.following = data.following &&  Following.convertFollowing(data.following) || [];
        this.status = data.status || 0;
        this.complete = data.complete || false;
        this.isDelete = data.isDelete && new PrayDelete(data.isDelete) || null;
        this.password = data.password || null;
        if( data.created &&  data.created._seconds){
            let newDate = new Date();
            newDate.setTime(data.created._seconds * 1000);
            this.created = newDate;
        }
        else {
            this.created = data.created || null;
        }
        this.isLive = data.isLive && new PrayLocation(data.isLive) || null;
    }

    static removeFieldEmpty (data){
        if(typeof data !="object"){
            return null;
        }
        let obj ={} ;
        for (let key in data){
            if(data[key]){
                obj[key] = data[key];
            }
        }
        return obj;
    }

}
