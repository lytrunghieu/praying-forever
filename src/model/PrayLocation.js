

export default class PrayLocation {
    constructor(data={}, initModel = true){
        if(initModel) {
            this.init(data);
        }
    }

    init(data) {
        this.timestamp = data.timestamp || null;
        this.long = data.long || null;
        this.lat = data.lat || null;
    }

}
