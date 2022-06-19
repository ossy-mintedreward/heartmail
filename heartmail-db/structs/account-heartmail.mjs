/**
 * AccountHeartMail
 * =========================
 */

import { Struct } from 'heartmail-lib'

class AccountHeartMail extends Struct {
  constructor (accountId, heartmail, createdAt = new Date(), updatedAt = new Date()) {
    super({ accountId, heartmail, createdAt, updatedAt })
  }

  toJSON () {
    const json = {}
    json.accountId = this.accountId
    json.heartmail = this.heartmail
    json.createdAt = this.createdAt.toJSON()
    json.updatedAt = this.updatedAt.toJSON()
    return json
  }

  fromJSON (json = {}) {
    this.accountId = json.accountId
    this.heartmail = json.heartmail
    this.createdAt = json.createdAt ? new Date(json.createdAt) : null
    this.updatedAt = json.updatedAt ? new Date(json.updatedAt) : null
    return this
  }

  static fromJSON (json = {}) {
    return new this().fromJSON(json)
  }
}

export { AccountHeartMail }