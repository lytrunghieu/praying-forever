import I18n from "../I18n";

export  default class Response{
    constructor(data={}, initModel = true){
        if(initModel) {
            this.init(data);
        }
    }

    init(result ={}) {
        const data = result.data || {};
        this.success = data.success || false;
        this.code = data.code || "unknow";
        if(!this.success){
            this.statusCode = data.statusCode || 400;
        }
        else {
            this.statusCode = 200;
        }
        this.message = data.message || "";
        this.data = data.data || null;
        if(this.statusCode === 400) {
            this.message = I18n.t("genericErrorMessage");
        }
    }

}