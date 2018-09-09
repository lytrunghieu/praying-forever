
import PrayUser  from "./PrayUser";

export default class Following {
    constructor(data={}, initModel = true){
        if(initModel) {
            this.init(data);
        }
    }

   static convertFollowing(data){
        if( typeof data !="object"){
            return null;
        }
        let object = {};
        for (let key of data){
            object[key] = new PrayUser(data[key]);
        }
        return object;
   }

}
