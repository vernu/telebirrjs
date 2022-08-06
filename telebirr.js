const crypto = require('crypto')
const NodeRSA = require('node-rsa')
const axios = require('axios')

const TELEBIRR_H5_URL =
  'https://app.ethiomobilemoney.et:2121/ammapi/payment/service-openup/toTradeWebPay'
const TELEBIRR_IN_APP_URL =
  'https://app.ethiomobilemoney.et:2121/ammapi/payment/service-openup/toTradeMobilePay'

class Telebirr {
  constructor({ appId, appKey, shortCode, publicKey }) {
    this.appId = appId
    this.appKey = appKey
    this.shortCode = shortCode
    this.publicKey = publicKey
  }

  async makePayment({
    paymentMethod = 'web',
    nonce,
    notifyUrl,
    totalAmount,
    outTradeNo,
    receiveName,
    returnApp='com.example.app',
    returnUrl,
    subject,
    timeoutExpress = `${24 * 60}`, // 1 day
  }) {
    const params = {
      appId: this.appId,
      appKey: this.appKey,
      nonce,
      notifyUrl,
      outTradeNo,
      receiveName,
      returnApp,
      returnUrl,
      shortCode: this.shortCode,
      subject,
      timeoutExpress,
      timestamp: new Date().getTime(),
      totalAmount,
    }

    const url = paymentMethod == 'app' ? TELEBIRR_IN_APP_URL : TELEBIRR_H5_URL

    const payload = {
      appid: this.appId,
      sign: this.signData(params),
      ussd: this.encrypt(params),
    }
    try {
      const res = await axios.post(url, payload)

      return { success: res.data.code == 200, response: res.data }
    } catch (e) {
      console.log(e)
      return { success: false, error: e }
    }
  }

  encrypt(payload) {
    const rsaKey = new NodeRSA(
      `-----BEGIN PUBLIC KEY-----\n${this.publicKey}\n-----END PUBLIC KEY-----`,
      'public',
      {
        encryptionScheme: 'pkcs1',
      }
    )
    const dataToEncrypt = Buffer.from(JSON.stringify(payload))
    return rsaKey.encrypt(dataToEncrypt, 'base64', 'utf8')
  }

  signData(fields) {
    const encodedFields = Object.keys(fields)
      .sort()
      .map((key) => `${key}=${fields[key]}`)
      .join('&')

    return crypto.createHash('sha256').update(encodedFields).digest('hex')
  }

  decryptPublic(dataToDecrypt) {
    const rsaKey = new NodeRSA(
      `-----BEGIN PUBLIC KEY-----\n${this.publicKey}\n-----END PUBLIC KEY-----`,
      'public',
      {
        encryptionScheme: 'pkcs1',
      }
    )
    return rsaKey.decryptPublic(dataToDecrypt, 'utf8')
  }

  getDecryptedCallbackNotification(encryptedText) {
    const decryptedText = this.decryptPublic(encryptedText)
    return JSON.parse(decryptedText)
  }
}

module.exports = Telebirr
