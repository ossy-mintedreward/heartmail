/*
* TODO: This file should be deleted after we migrate to use the mb_accounts
* table.
*/
import { getClient } from '../connect.mjs'
import { KeyAlias, KeyAddress, PubKey, PrivKey, Struct } from 'heartmail-lib'
import cassandra from 'cassandra-driver'

const Long = cassandra.types.Long
const keyspace = process.env.HEARTMAIL_DB_KEYSPACE
const client = getClient()

export default class DbKey extends Struct {
  constructor (keyAlias, keyAddress, pubKey, privKey, typeStr, dataBuf, createdAt, updatedAt) {
    super({
      keyAlias,
      keyAddress,
      pubKey,
      privKey,
      typeStr,
      dataBuf,
      createdAt,
      updatedAt
    })
  }

  fromRandom () {
    const privKey = PrivKey.fromRandom()
    const pubKey = PubKey.fromPrivKey(privKey)
    const keyAddress = KeyAddress.fromPubKey(pubKey)
    const keyAlias = KeyAlias.fromKeyAddress(keyAddress)
    const createdAt = new Date()
    const updatedAt = new Date()
    this.fromObject({
      keyAlias,
      keyAddress,
      pubKey,
      privKey,
      createdAt,
      updatedAt
    })
    return this
  }

  static fromRandom () {
    return new this().fromRandom()
  }

  fromJSON (json) {
    this.fromObject({
      keyAlias: KeyAlias.fromString(json.keyAlias),
      keyAddress: KeyAddress.fromString(json.keyAddress),
      pubKey: json.pubKey ? PubKey.fromString(json.pubKey) : undefined,
      privKey: json.privKey ? PrivKey.fromString(json.privKey) : undefined,
      typeStr: json.typeStr,
      dataBuf: json.dataBuf ? Buffer.fromString(json.dataBuf, 'hex') : undefined,
      createdAt: new Date(json.createdAt),
      updatedAt: new Date(json.updatedAt)
    })
    return this
  }

  toJSON () {
    const json = {}
    json.keyAlias = this.keyAlias.toString()
    json.keyAddress = this.keyAddress.toString()
    json.pubKey = this.pubKey.toString()
    json.privKey = this.privKey.toString()
    json.typeStr = this.typeStr
    json.dataBuf = this.dataBuf ? this.dataBuf.toString('hex') : undefined
    json.createdAt = this.createdAt ? this.createdAt.toJSON() : undefined
    json.updatedAt = this.updatedAt ? this.updatedAt.toJSON() : undefined
    return json
  }

  parseDataBuf () {
    return this
  }

  createDataBuf () {
    return this
  }

  isValid () {
    return !this.getValidationError()
  }

  getValidationError () {
    if (!this.keyAlias) {
      return 'missing keyAlias'
    }
    if (this.keyAddress !== undefined) {
      const keyAlias = KeyAlias.fromKeyAddress(this.keyAddress)
      if (keyAlias.toString() !== this.keyAlias.toString()) {
        return 'keyAlias does not match keyAddress'
      }
    }
    if (this.pubKey !== undefined) {
      const keyAddress = KeyAddress.fromPubKey(this.pubKey)
      if (keyAddress.toString() !== this.keyAddress.toString()) {
        return 'keyAddress does not match pubKey'
      }
    }
    if (this.privKey !== undefined) {
      const pubKey = PubKey.fromPrivKey(this.privKey)
      if (pubKey.toString() !== this.pubKey.toString()) {
        return 'pubKey does not match privKey'
      }
    }
    if (this.typeStr !== undefined) {
      if (typeof this.typeStr !== 'string') {
        return 'typeStr must be a string or undefined'
      }
    }
    if (this.dataBuf !== undefined) {
      if (!Buffer.isBuffer(this.dataBuf)) {
        return 'dataBuf must be a Buffer or undefined'
      }
      if (this.dataBuf.length > 1e6) {
        return 'dataBuf must not be greater than 1 million bytes'
      }
    }
    return ''
  }

  fromCassandraObject (obj) {
    return this.fromObject({
      keyAlias: KeyAlias.fromLeftRightBuf(Long.toBuffer(obj.key_alias_left), Long.toBuffer(obj.key_alias_right)),
      keyAddress: obj.key_address ? KeyAddress.fromString(obj.key_address) : undefined,
      pubKey: obj.pub_key ? PubKey.fromString(obj.pub_key) : undefined,
      privKey: obj.priv_key ? PrivKey.fromString(obj.priv_key) : undefined,
      typeStr: obj.type_str,
      dataBuf: obj.data_buf,
      createdAt: obj.created_at,
      updatedAt: obj.updated_at
    })
  }

  toCassandraObject () {
    return {
      key_alias_left: Long.fromBuffer(this.keyAlias.getLeftBuf()),
      key_alias_right: Long.fromBuffer(this.keyAlias.getRightBuf()),
      key_address: this.keyAddress ? this.keyAddress.toString() : undefined,
      pub_key: this.pubKey ? this.pubKey.toString() : undefined,
      priv_key: this.privKey ? this.privKey.toString() : undefined,
      type_str: this.typeStr,
      data_buf: this.dataBuf,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    }
  }

  async insert () {
    this.createDataBuf()

    const obj = this.toCassandraObject()

    const query = `insert into ${keyspace}.keys (key_alias_left, key_alias_right, key_address, pub_key, priv_key, type_str, data_buf, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    const values = [obj.key_alias_left, obj.key_alias_right, obj.key_address, obj.pub_key, obj.priv_key, obj.type_str, obj.data_buf, obj.created_at, obj.updated_at]

    const result = await client.execute(query, values, { prepare: true, consistency: cassandra.types.consistencies.localQuorum })

    return result
  }

  async findOne () {
    const obj = this.toCassandraObject()

    const query = `select * from ${keyspace}.keys where key_alias_left = ? and key_alias_right = ?`
    const values = [obj.key_alias_left, obj.key_alias_right]

    const result = await client.execute(query, values, { prepare: true, consistency: cassandra.types.consistencies.localQuorum })

    const row = result.first()

    if (row) {
      this.fromCassandraObject(row)
      this.parseDataBuf()
    }

    return this
  }

  static async findOne (longId) {
    const keyAlias = KeyAlias.fromLongId(longId)
    const dbKey = await new this(keyAlias).findOne()
    if (dbKey.keyAlias) {
      return dbKey
    } else {
      return undefined
    }
  }

  static async findAll () {
    const query = `select * from ${keyspace}.keys`
    const res = await client.execute(query, [], { prepare: true, consistency: cassandra.types.consistencies.localQuorum })
    const dbKeys = []
    for (let i = 0; i < res.rows.length; i++) {
      const row = res.rows[i]
      const dbKey = new this().fromCassandraObject(row)
      dbKeys.push(dbKey)
    }
    return dbKeys
  }

  async findOneByShortId () {
    const obj = this.toCassandraObject()

    const query = `select * from ${keyspace}.keys where key_alias_left = ?`
    const values = [obj.key_alias_left]

    const result = await client.execute(query, values, { prepare: true, consistency: cassandra.types.consistencies.localQuorum })

    const row = result.first()

    if (row) {
      this.fromCassandraObject(row)
      this.parseDataBuf()
    }

    return this
  }

  static async findOneByShortId (shortId) {
    const keyAlias = KeyAlias.fromShortId(shortId)
    const dbKey = await new this(keyAlias).findOneByShortId()
    if (dbKey.keyAlias) {
      return dbKey
    } else {
      return undefined
    }
  }

  async updateOne () {
    this.createDataBuf()

    const obj = this.toCassandraObject()

    const query = `update ${keyspace}.keys set key_address = ?, pub_key = ?, priv_key = ?, type_str = ?, data_buf = ?, created_at = ?, updated_at = ? where key_alias_left = ? and key_alias_right = ?`
    const values = [obj.key_address, obj.pub_key, obj.priv_key, obj.type_str, obj.data_buf, obj.created_at, obj.updated_at, obj.key_alias_left, obj.key_alias_right]

    const result = await client.execute(query, values, { prepare: true, consistency: cassandra.types.consistencies.localQuorum })

    return result
  }
}
