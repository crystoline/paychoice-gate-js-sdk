import {IConfig} from "./IConfig";
var sha256 = require('js-sha256');

export class GatePaymentRequest {
    private MerchantId: string;
    private ProductId: string;
    private Hash: string;

    constructor(
        private Amount: number,
        private Currency: string,
        private TransactionNo: string,
        private Email: string = '',
        private NotifyUrl: string = '',
        private Description: string
    ) {
    }

    getData(baseUrl: string, config: IConfig): Record<string, string> {

        const responseUrl = baseUrl + '/upl/sdk/respond';
        let data: Record<string, any> =
            {
                'merchant_id': config.MerchantId,
                'product_id': config.ProductId,
                'product_description': this.Description,
                'amount': this.Amount,
                'currency': this.Currency,
                'transaction_id': this.TransactionNo,
                'email': this.Email,
                'response_url': responseUrl
            }


        if (this.Description) {
            data['Description'] = this.Description;
        }

        if (this.NotifyUrl) {
            data['notify_url'] = this.NotifyUrl;
        }

        let hash = config.MerchantId + config.ProductId + this.Description + this.Amount + this.Currency +
            this.TransactionNo + this.Email + responseUrl + this.NotifyUrl + config.SecretKey;
        console.log('hash', hash);
        data['hash'] = sha256(hash)

        return data;
    }

    generateUrl(baseUrl: string, config: IConfig): string {
        const data = this.getData(baseUrl, config);
        return baseUrl + '/upl/merchant/pay' + '?' + (new URLSearchParams(data)).toString()
    }
}
