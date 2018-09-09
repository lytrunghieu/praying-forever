

export default class PrayDelete {
    constructor(data={}, initModel = true){
        if(initModel) {
            this.init(data);
        }
    }

    init(data) {
        this.date = data.date || null;
    }

}
