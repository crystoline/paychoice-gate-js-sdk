import {PaymentResponse} from "./paymentResponse";
import {IConfig} from "./IConfig";
import {IPayment} from "./IPayment";
import {GatePaymentRequest} from "./gatePaymentRequest";

export class PayChoiceGate {
    private static baseUrl = 'https://gateway.paychoice.ng';
    private static baseUrlStaging = 'https://staging-gateway.paychoice.ng';
    public static callback: PaymentResponse | null;

    constructor(private config: IConfig, private env: string = 'test') {
    }

    public init(req: IPayment, callback: PaymentResponse | null = null) {
        PayChoiceGate.callback = callback;
        let baseUrl = this.env == 'test' ? PayChoiceGate.baseUrlStaging : PayChoiceGate.baseUrl;
        const paymentRequest = new GatePaymentRequest(
            req.Amount,
            req.Currency,
            req.TransactionNo,
            req.Email,
            req.NotifyUrl,
            req.Description
        );

        const url = paymentRequest.generateUrl(baseUrl, this.config)
        console.log(url);
        this.makeIFrame(url);
    }

    makeIFrame(url: string) {
        let ifrm = document.getElementById('PAYCHOICE_GATE_IFRAME');
        if (!ifrm) {
            ifrm = document.createElement("IFRAME");
            ifrm.id = 'PAYCHOICE_GATE_IFRAME';
            ifrm.setAttribute("src", url);
            ifrm.setAttribute("align", "center");
            ifrm.style.width = 100 + "%";
            ifrm.style.height = 100 + "%";
            ifrm.style.color = '#fff';
            ifrm.style.position = 'absolute';
            ifrm.style.top = '0';
            ifrm.style.backgroundColor = '#fff';
            ifrm.style.zIndex = '200';
            //ifrm.style.border          = '1px solid #f99';
            //ifrm.style.fontFamily      = 'Arial, Helvetica, sans';
            document.body.appendChild(ifrm);
            window.addEventListener('message', function (message) {
                if (message.data.type == 'paychoice.gate:completed') {
                    console.log(message.data);
                    PayChoiceGate.paymentCompleted(message.data.data);
                }
            });
            // var bc = new BroadcastChannel('paychoice.gate:completed');
            // bc.onmessage = function(message){
            //     console.log(message.data);
            //     PayChoiceGate.paymentCompleted(message.data)
            // };
        } else {
            ifrm.setAttribute("src", url);
            ifrm.style.display = "";
        }
        return false;
    }

    private static closeIframe = () => {
        var ifrm = document.getElementById('PAYCHOICE_GATE_IFRAME');
        if (ifrm) {
            ifrm.remove();
        }
    }

    public static paymentCompleted = (data: any) => {
        if (PayChoiceGate.callback) {
            PayChoiceGate.callback(data)
        }
        PayChoiceGate.closeIframe();
    }

}
