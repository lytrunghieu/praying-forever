

export default class PrayUser {
    constructor(data={}, initModel = true){
        if(initModel) {
            this.init(data);
        }
    }

    init(data) {
        this.uid = data.uid || null;
        this.displayName = data.data || null;
        this.email = data.email ||null;
        this.emailVerified = data.emailVerified || false;
        this.isAnonymous = data.isAnonymous || false;
    }

}
