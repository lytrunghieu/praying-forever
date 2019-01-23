import firebase from 'react-native-firebase';
import {response} from "../model";


export default class BaseApi {

    executeHttp(nameFunction, params ={}) {
        if(!params.userUID && firebase.auth().currentUser){
            params.userUID = firebase.auth().currentUser.uid;
        }
        const httpsCallable = firebase.functions(firebase.app()).httpsCallable(nameFunction);
        return httpsCallable(params)
            .catch(httpsError => {
                console.log("ERROR :", httpsError);
                console.log("Code :",httpsError.details.code || httpsError.code);
                console.log("Message :",httpsError.message);
                console.log("errorDescription :",httpsError.details && httpsError.details.errorDescription);
                return httpsError;
            }).finally(res =>{
              return new response(res);
            })
    }


    excuteFireStoreFunction(){

    }
}
