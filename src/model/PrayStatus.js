

export default class PrayStatus {
    constructor(data={}, initModel = true){
        if(initModel) {
            this.init(data);
        }
    }

    init(data) {
        this.id = data.id || null;
        this.name = data.name || null;
    }

}
