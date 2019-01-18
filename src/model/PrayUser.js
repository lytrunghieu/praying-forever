

export default class PrayUser {
    constructor(data={}, initModel = true){
        if(initModel) {
            this.init(data);
        }
    }

    init(data) {
        this.uid = data.uid || null;
        this.displayName = data.displayName || null;
        this.email = data.email ||null;
        this.emailVerified = data.emailVerified || false;
        this.isAnonymous = data.isAnonymous || false;
        this.birthDay = data.birthDay || new Date();
        this.gender = data.gender || 0; // 0 is male
        this.avatarURL = data.avatarURL || undefined; // 0 is male
    }

}
