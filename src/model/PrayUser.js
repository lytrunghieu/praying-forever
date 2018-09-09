

export default class PrayUser {
    constructor(data={}, initModel = true){
        if(initModel) {
            this.init(data);
        }
    }

    init(data) {
        this.uid = data.uid || null;
    }

}
