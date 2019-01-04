import baseService from "./baseService";
import {CREATE_PRAYER,GET_PRAYER,EDIT_PRAYER} from "./nameCloudFunction"
import moment from "moment";
import {Pray} from "../model";

class PrayerService extends baseService {

    createNewPrayer(params){
        return super.executeHttp(CREATE_PRAYER, {prayer :params});
    }

    editPrayer(params){
        return super.executeHttp(EDIT_PRAYER, {prayer :params});
    }

    getPrayer({userUID, prayerUID,search}){
        return super.executeHttp(GET_PRAYER, {userUID ,prayerUID,search}).then(res=>{
            if(res.success &&  Array.isArray(res.data)){
                let dataConvert = res.data.map(e =>{
                    return new Pray(e);
                });
                dataConvert =  dataConvert.sort((a,b)=>{
                   if(moment(a.created).isAfter(moment(b.created))){
                       return -1;
                   }
                   if(moment(a.created).isBefore(moment(b.created))){
                       return 1;
                   }
                   return 0;
                });
                res.data = dataConvert;

            }
            return res;
        });
    }

}

export default  PrayerService