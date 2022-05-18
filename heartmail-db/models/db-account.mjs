import { KeyAlias } from 'heartmail-lib'
import DbKey from './db-key.mjs'

export default class DbAccount extends DbKey {
  constructor (...args) {
    super(...args)
    this.typeStr = 'account'
  }

  createDataBuf () {
    const dataObj = {
      accessGrantedAt: this.accessGrantedAt,
      ownerEmailAddress: this.ownerEmailAddress,
      paymentEmailAddress: this.paymentEmailAddress,
      affiliateKeyAlias: this.affiliateKeyAlias,
      contactFeeAmountUsd: this.contactFeeAmountUsd
    }
    const dataStr = JSON.stringify(dataObj)
    const dataBuf = Buffer.from(dataStr)
    this.dataBuf = dataBuf
    return this
  }

  parseDataBuf () {
    const dataStr = this.dataBuf.toString()
    const dataJSON = JSON.parse(dataStr)
    const dataObj = {
      accessGrantedAt: new Date(dataJSON.accessGrantedAt),
      ownerEmailAddress: dataJSON.ownerEmailAddress,
      paymentEmailAddress: dataJSON.paymentEmailAddress,
      affiliateKeyAlias: KeyAlias.fromJSON(dataJSON.affiliateKeyAlias),
      contactFeeAmountUsd: dataJSON.contactFeeAmountUsd
    }
    this.fromObject(dataObj)
    return this
  }
}
