
import PrayUser  from "./PrayUser";

export default class Following {
    constructor(data={}, initModel = true){
        if(initModel) {
            this.init(data);
        }
    }

   static convertFollowing(data){
        if(!Array.isArray(data) || data.length === 0){
            return [];
        }


        return data;
   }

}
