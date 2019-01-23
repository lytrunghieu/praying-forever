import I18n from "../I18n";

export default class Response {
    constructor(data = {}, initModel = true) {
        if (initModel) {
            this.init(data);
        }
    }

    init(result = {}) {
        const {data} = result || {};
        if (data) {
            this.success = data.success || false;
            this.code = data.code || "unknown";
            if (!this.success) {
                this.statusCode = data.statusCode || 400;
            }
            else {
                this.statusCode = 200;
            }

            this.message = data.message || "";
            this.data = data.data || null;
            if (this.statusCode === 400) {
                this.message = I18n.t("genericErrorMessage");
            }
        }
        else {
            const {details} = result || {};
            this.code =  result.code;
            this.success = details.success;
            this.statusCode = details.statusCode;
            this.message = result.message;
            if(details.code){
                this.code =  details.code;
            }
            if (this.statusCode === 400) {
                this.message = I18n.t("genericErrorMessage");
            }
        }

    }

}