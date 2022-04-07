# Description
Sdk for PayChoice Gate integration

# Installation 
```shell
npm install --save paychoice-gate-sdk
```

# Usage


```html
<div>
    <h1>Make Payment</h1>
    <button (click)="makePayment()">Pay Now</button>
</div>
```

```ts
export class PaymentComponent {
    
  public makePayment() {
    const gate = new PayChoiceGate({
      MerchantId: 'UPL_48ZCRG3HH7Q',
      ProductId: 'UPL003',
      SecretKey: '5C9BAC426B1DC'
    });
    gate.init({
      Amount: 10000, // amount in kobo
      Currency: '566', // code for naira
      TransactionNo: Math.round(Math.random() * 10000000).toString(10), // Unique transaction ref
      Email: 'crystoline@gmail.com', // customer email
      ResponseUrl: '',
      NotifyUrl: 'http://localhost', // optional Notification URL
      Description: 'Hello', // description
    }, (response) => { // callback
      console.log('i got the response here', response);
      //
      // respone e.g {transaction_id: "6607590"}
      // perform actions like making API call to the backend
    });
  }
  
}
```
