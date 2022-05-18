/* global describe,it */
import DbAccount from '../models/db-account.mjs'
import { KeyAddress, PubKey, PrivKey, KeyAlias, Bn } from 'heartmail-lib'
import should from 'should'

describe('DbAccount', () => {
  it('should exist', () => {
    should.exist(DbAccount)
  })

  describe('@fromRandom', () => {
    it('should make a new DbAccount', () => {
      const dbAccount = DbAccount.fromRandom()
      should.exist(dbAccount.keyAlias)
      should.exist(dbAccount.privKey)
      const pubKey = PubKey.fromPrivKey(dbAccount.privKey)
      const keyAddress = KeyAddress.fromPubKey(pubKey)
      const keyAlias = KeyAlias.fromKeyAddress(keyAddress)
      keyAlias.toString().should.equal(dbAccount.keyAlias.toString())
      should.exist(dbAccount.createdAt)
      should.exist(dbAccount.updatedAt)
      dbAccount.typeStr.should.equal('account')
      should.not.exist(dbAccount.dataBuf)
    })
  })

  describe('#toJSON', () => {
    it('should convert this valid account to json', () => {
      const date = new Date()
      const dbAccount = DbAccount.fromRandom()
      dbAccount.fromObject({
        accessGrantedAt: date,
        ownerEmailAddress: 'name@example.com',
        paymentEmailAddress: 'name@example.com',
        affiliateKeyAlias: KeyAlias.fromRandom(),
        contactFeeAmountUsd: 1.00
      })
      const json = dbAccount.toJSON()
      json.accessGrantedAt.should.equal(date.toJSON())
      json.ownerEmailAddress.should.equal('name@example.com')
      json.paymentEmailAddress.should.equal('name@example.com')
      json.affiliateKeyAlias.should.equal(dbAccount.affiliateKeyAlias.toJSON())
      json.contactFeeAmountUsd.should.equal(1.00)
    })
  })

  describe('#createDataBuf', () => {
    it('should make a dataBuf from these properties', () => {
      const dbAccount = DbAccount.fromRandom()
      const privKey = PrivKey.fromBn(new Bn(5))
      const pubKey = PubKey.fromPrivKey(privKey)
      const keyAddress = KeyAddress.fromPubKey(pubKey)
      const keyAlias = KeyAlias.fromKeyAddress(keyAddress)
      dbAccount.fromObject({
        accessGrantedAt: new Date('2022-05-18T15:40:34.015Z'),
        ownerEmailAddress: 'name@example.com',
        paymentEmailAddress: 'name@example.com',
        affiliateKeyAlias: keyAlias,
        contactFeeAmountUsd: 1.00
      })
      dbAccount.createDataBuf()
      should.exist(dbAccount.dataBuf)
      dbAccount.dataBuf.toString('hex').should.equal('7b226163636573734772616e7465644174223a22323032322d30352d31385431353a34303a33342e3031355a222c226f776e6572456d61696c41646472657373223a226e616d65406578616d706c652e636f6d222c227061796d656e74456d61696c41646472657373223a226e616d65406578616d706c652e636f6d222c22616666696c696174654b6579416c696173223a225c2234377834646d3435737477347736766c3464696664687a74725c22222c22636f6e74616374466565416d6f756e74557364223a317d')
    })
  })

  describe('#parseDataBuf', () => {
    it('should make these properties from this databuf', () => {
      const dbAccount = DbAccount.fromRandom()
      const privKey = PrivKey.fromBn(new Bn(5))
      const pubKey = PubKey.fromPrivKey(privKey)
      const keyAddress = KeyAddress.fromPubKey(pubKey)
      const keyAlias = KeyAlias.fromKeyAddress(keyAddress)
      dbAccount.fromObject({
        accessGrantedAt: new Date('2022-05-18T15:40:34.015Z'),
        ownerEmailAddress: 'name@example.com',
        paymentEmailAddress: 'name@example.com',
        affiliateKeyAlias: keyAlias,
        contactFeeAmountUsd: 1.00
      })
      dbAccount.createDataBuf()
      should.exist(dbAccount.dataBuf)
      dbAccount.dataBuf.toString('hex').should.equal('7b226163636573734772616e7465644174223a22323032322d30352d31385431353a34303a33342e3031355a222c226f776e6572456d61696c41646472657373223a226e616d65406578616d706c652e636f6d222c227061796d656e74456d61696c41646472657373223a226e616d65406578616d706c652e636f6d222c22616666696c696174654b6579416c696173223a225c2234377834646d3435737477347736766c3464696664687a74725c22222c22636f6e74616374466565416d6f756e74557364223a317d')

      const dbAccount2 = DbAccount.fromRandom()
      dbAccount2.fromObject({ dataBuf: dbAccount.dataBuf })
      dbAccount2.parseDataBuf()
      dbAccount2.privKey.toString().should.not.equal(dbAccount.dataBuf.toString())
      dbAccount2.dataBuf.toString('hex').should.equal(dbAccount.dataBuf.toString('hex'))
      dbAccount2.accessGrantedAt.toJSON().should.equal(dbAccount.accessGrantedAt.toJSON())
      dbAccount2.ownerEmailAddress.should.equal(dbAccount.ownerEmailAddress)
      dbAccount2.paymentEmailAddress.should.equal(dbAccount.paymentEmailAddress)
      dbAccount2.affiliateKeyAlias.toJSON().should.equal(dbAccount.affiliateKeyAlias.toJSON())
      dbAccount2.contactFeeAmountUsd.should.equal(dbAccount.contactFeeAmountUsd)
    })
  })

  describe('@create', () => {
    it('should create and know this is a valid DbAccount', () => {
      const privKey = PrivKey.fromBn(new Bn(5))
      const pubKey = PubKey.fromPrivKey(privKey)
      const keyAddress = KeyAddress.fromPubKey(pubKey)
      const keyAlias = KeyAlias.fromKeyAddress(keyAddress)
      const dbAccount = DbAccount.create({
        accessGrantedAt: new Date('2022-05-18T15:40:34.015Z'),
        ownerEmailAddress: 'name@example.com',
        paymentEmailAddress: 'name@example.com',
        affiliateKeyAlias: keyAlias,
        contactFeeAmountUsd: 1.00
      })
      dbAccount.isValid().should.equal(true)
    })
  })

  describe('#isValid', () => {
    it('should know this is a valid DbAccount', () => {
      const dbAccount = DbAccount.fromRandom()
      const privKey = PrivKey.fromBn(new Bn(5))
      const pubKey = PubKey.fromPrivKey(privKey)
      const keyAddress = KeyAddress.fromPubKey(pubKey)
      const keyAlias = KeyAlias.fromKeyAddress(keyAddress)
      dbAccount.fromObject({
        accessGrantedAt: new Date('2022-05-18T15:40:34.015Z'),
        ownerEmailAddress: 'name@example.com',
        paymentEmailAddress: 'name@example.com',
        affiliateKeyAlias: keyAlias,
        contactFeeAmountUsd: 1.00
      })
      dbAccount.createDataBuf()
      dbAccount.isValid().should.equal(true)
    })

    it('should know this is not a valid DbAccount', () => {
      const privKey = PrivKey.fromBn(new Bn(5))
      const pubKey = PubKey.fromPrivKey(privKey)
      const keyAddress = KeyAddress.fromPubKey(pubKey)
      const keyAlias = KeyAlias.fromKeyAddress(keyAddress)
      const dbAccount = DbAccount.create({
        accessGrantedAt: new Date('2022-05-18T15:40:34.015Z'),
        ownerEmailAddress: 'name@example.com',
        paymentEmailAddress: 'name@example.com',
        affiliateKeyAlias: keyAlias,
        contactFeeAmountUsd: 1.00
      })
      dbAccount.accessGrantedAt = 5
      dbAccount.isValid().should.equal(false)
      dbAccount.getValidationError().should.equal('accessGrantedAt must be a Date')
    })

    it('should know this is not a valid DbAccount', () => {
      const privKey = PrivKey.fromBn(new Bn(5))
      const pubKey = PubKey.fromPrivKey(privKey)
      const keyAddress = KeyAddress.fromPubKey(pubKey)
      const keyAlias = KeyAlias.fromKeyAddress(keyAddress)
      const dbAccount = DbAccount.create({
        accessGrantedAt: new Date('2022-05-18T15:40:34.015Z'),
        ownerEmailAddress: 'name@example.com',
        paymentEmailAddress: 'name@example.com',
        affiliateKeyAlias: keyAlias,
        contactFeeAmountUsd: 1.00
      })
      dbAccount.ownerEmailAddress = 5
      dbAccount.isValid().should.equal(false)
      dbAccount.getValidationError().should.equal('ownerEmailAddress must be an email address or undefined')
    })

    it('should know this is not a valid DbAccount', () => {
      const privKey = PrivKey.fromBn(new Bn(5))
      const pubKey = PubKey.fromPrivKey(privKey)
      const keyAddress = KeyAddress.fromPubKey(pubKey)
      const keyAlias = KeyAlias.fromKeyAddress(keyAddress)
      const dbAccount = DbAccount.create({
        accessGrantedAt: new Date('2022-05-18T15:40:34.015Z'),
        ownerEmailAddress: 'name@example.com',
        paymentEmailAddress: 'name@example.com',
        affiliateKeyAlias: keyAlias,
        contactFeeAmountUsd: 1.00
      })
      dbAccount.paymentEmailAddress = 5
      dbAccount.isValid().should.equal(false)
      dbAccount.getValidationError().should.equal('paymentEmailAddress must be an email address or undefined')
    })

    it('should know this is not a valid DbAccount', () => {
      const privKey = PrivKey.fromBn(new Bn(5))
      const pubKey = PubKey.fromPrivKey(privKey)
      const keyAddress = KeyAddress.fromPubKey(pubKey)
      const keyAlias = KeyAlias.fromKeyAddress(keyAddress)
      const dbAccount = DbAccount.create({
        accessGrantedAt: new Date('2022-05-18T15:40:34.015Z'),
        ownerEmailAddress: 'name@example.com',
        paymentEmailAddress: 'name@example.com',
        affiliateKeyAlias: keyAlias,
        contactFeeAmountUsd: 1.00
      })
      dbAccount.affiliateKeyAlias = 5
      dbAccount.isValid().should.equal(false)
      dbAccount.getValidationError().should.equal('affiliateKeyAlias must be a KeyAlias or undefined')
    })

    it('should know this is not a valid DbAccount', () => {
      const privKey = PrivKey.fromBn(new Bn(5))
      const pubKey = PubKey.fromPrivKey(privKey)
      const keyAddress = KeyAddress.fromPubKey(pubKey)
      const keyAlias = KeyAlias.fromKeyAddress(keyAddress)
      const dbAccount = DbAccount.create({
        accessGrantedAt: new Date('2022-05-18T15:40:34.015Z'),
        ownerEmailAddress: 'name@example.com',
        paymentEmailAddress: 'name@example.com',
        affiliateKeyAlias: keyAlias,
        contactFeeAmountUsd: 1.00
      })
      dbAccount.contactFeeAmountUsd = '1.00'
      dbAccount.isValid().should.equal(false)
      dbAccount.getValidationError().should.equal('contactFeeAmountUsd must be a number')
    })

    it('should know this is not a valid DbAccount', () => {
      const privKey = PrivKey.fromBn(new Bn(5))
      const pubKey = PubKey.fromPrivKey(privKey)
      const keyAddress = KeyAddress.fromPubKey(pubKey)
      const keyAlias = KeyAlias.fromKeyAddress(keyAddress)
      const dbAccount = DbAccount.create({
        accessGrantedAt: new Date('2022-05-18T15:40:34.015Z'),
        ownerEmailAddress: 'name@example.com',
        paymentEmailAddress: 'name@example.com',
        affiliateKeyAlias: keyAlias,
        contactFeeAmountUsd: 1.00
      })
      dbAccount.contactFeeAmountUsd = -1.00
      dbAccount.isValid().should.equal(false)
      dbAccount.getValidationError().should.equal('contactFeeAmountUsd must be positive')
    })
  })
})