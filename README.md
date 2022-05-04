# telebirrjs

hustle free telebirr integration package for node

## Usage

install the package `npm i telebirrjs`

```javascript
const Telebirr = require('telebirrjs')

const telebirr = new Telebirr({
  appId: 'YOUR TELEBIRR APP ID',
  appKey: 'YOUR TELEBIRR APP KEY',
  shortCode: 'TELEBIRR SHORT CODE',
  publicKey: 'YOUR TELEBIRR PUBLIC KEY',
})
const { success, response } = await telebirr.makePayment({
  paymentMethod: 'web | app',
  nonce: 'a unique random string ( should be unique for each request )',
  notifyUrl: 'callback url for payment confirmation',
  totalAmount: 4.5, // amount to charge
  outTradeNo: 'unique identifier (order no)',
  receiveName: 'company name',
  returnApp: 'com.example.app', // your application package name
  returnUrl: 'redirect url after payment completion',
  subject: 'payment for',
  timeoutExpress: '120', // valid for 2 hours
})
```
