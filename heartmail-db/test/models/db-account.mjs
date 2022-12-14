/* global describe,it */
import DbAccount from '../../lib/models/db-account.mjs'
import DbMbAccount from '../../lib/models/db-mb-account.mjs'
import should from 'should'
import Account from '../../lib/structs/account.mjs'

describe('DbAccount', () => {
  it('should exist', () => {
    should.exist(DbAccount)
  })

  describe('@fromRandom', () => {
    it('should make a new DbAccount', () => {
      const dbMbAccount = DbAccount.fromRandom()
      should.exist(dbMbAccount.account.id)
      should.exist(dbMbAccount.account.privKey)
    })
  })

  describe('@fromMbAccount', () => {
    it('should make a DbAccount from an MbAccount', () => {
      const dbMbAccount = DbMbAccount.fromRandom()
      dbMbAccount.mbAccount.fromObject({
        accessGrantedAt: new Date(),
        affiliateId: '12345',
        contactFeeUsd: 1.00,
        mbEmail: 'name@example.com',
        mbPaymail: 'name@example.com',
        mbPaymentId: '1',
        mbTxid: '00'.repeat(32),
        mbIdentityKey: 'key',
        mbUserId: '6',
        mbName: 'name',
        mbAvatarUrl: 'https://www.ryanxcharles.com/me.jpg'
      })
      const mbAccount = dbMbAccount.mbAccount
      const dbAccount = DbAccount.fromMbAccount(mbAccount)
      const account = dbAccount.account
      account.id.should.equal(mbAccount.id)
      account.privKey.toString().should.equal(mbAccount.privKey.toString())
      account.createdAt.toJSON().should.equal(mbAccount.createdAt.toJSON())
      account.updatedAt.toJSON().should.equal(mbAccount.updatedAt.toJSON())
      account.signedInAt.toJSON().should.equal(mbAccount.createdAt.toJSON())
      account.name.should.equal(mbAccount.mbName)
      account.heartmail.should.equal(`${mbAccount.id}@${process.env.NEXT_PUBLIC_DOMAIN}`)
      account.bio.should.equal('')
      account.contactFeeUsd.should.equal(mbAccount.contactFeeUsd)
      account.affiliateId.should.equal(mbAccount.affiliateId)
      account.email.should.equal(mbAccount.mbEmail)
      account.paymail.should.equal(mbAccount.mbPaymail)
      account.accessGrantedAt.toJSON().should.equal(mbAccount.accessGrantedAt.toJSON())
    })
  })

  describe('#toCassandraObject', () => {
    it('should convert to a cassandra object', () => {
      const date = new Date()
      const dbAccount = DbAccount.fromRandom()
      dbAccount.account.fromObject({
        name: 'Name',
        heartmail: '12345@heartmail.com',
        bio: '',
        contactFeeUsd: 1.00,
        affiliateId: '1234',
        email: 'name@example.com',
        paymail: 'name@example.com',
        accessGrantedAt: date
      })
      const obj = dbAccount.toCassandraObject()
      obj.name.should.equal('Name')
      obj.heartmail.should.equal('12345@heartmail.com')
      obj.bio.should.equal('')
      obj.affiliate_id.should.equal(dbAccount.account.affiliateId)
      obj.contact_fee_usd.should.equal(1.00)
      obj.email.should.equal('name@example.com')
      obj.paymail.should.equal('name@example.com')
      obj.access_granted_at.toJSON().should.equal(date.toJSON())
    })

    it('should convert to a cassandra object with some null values', () => {
      const dbAccount = DbAccount.fromRandom()
      const obj = dbAccount.toCassandraObject()
      ;(obj.name === 'Anonymous').should.equal(true)
      ;(obj.heartmail === null).should.equal(true)
      ;(obj.bio === '').should.equal(true)
      ;(obj.contact_fee_usd === 1.00).should.equal(true)
      ;(obj.affiliate_id === null).should.equal(true)
      ;(obj.email === null).should.equal(true)
      ;(obj.paymail === null).should.equal(true)
      ;(obj.access_granted_at.toJSON() === obj.created_at.toJSON()).should.equal(true)
    })
  })

  describe('@findOne', () => {
    it('should insert and find one back again', async () => {
      const date = new Date()
      const dbAccount = DbAccount.fromRandom()
      dbAccount.account.fromObject({
        name: 'Name',
        heartmail: '12345@heartmail.com',
        bio: '',
        contactFeeUsd: 1.00,
        affiliateId: '1234',
        email: 'name@example.com',
        paymail: 'name@example.com',
        accessGrantedAt: date
      })
      await dbAccount.insert()
      const dbAccount2 = await DbAccount.findOne(dbAccount.account.id)
      const account2 = dbAccount2.account
      const account = dbAccount.account
      account2.id.should.equal(account.id)
      account2.privKey.toString().should.equal(account.privKey.toString())
      account2.name.should.equal(account.name)
      account2.bio.should.equal(account.bio)
      account2.contactFeeUsd.should.equal(account.contactFeeUsd)
      account2.affiliateId.should.equal(account.affiliateId)
      account2.email.should.equal(account.email)
      account2.paymail.should.equal(account.paymail)
      account2.accessGrantedAt.toJSON().should.equal(account.accessGrantedAt.toJSON())
    })
  })

  describe('@update', () => {
    it('should insert, update, find one back again', async () => {
      const date = new Date()
      const dbAccount = DbAccount.fromRandom()
      dbAccount.account.fromObject({
        name: 'Name',
        heartmail: '12345@heartmail.com',
        bio: '',
        contactFeeUsd: 1.00,
        affiliateId: '1234',
        email: 'name@example.com',
        paymail: 'name@example.com',
        accessGrantedAt: date
      })
      await dbAccount.insert()
      const account1 = dbAccount.account
      const account2 = Account.fromJSON({
        id: dbAccount.account.id,
        bio: 'I love HeartMail'
      })
      await DbAccount.update(account2)
      const dbAccount3 = await DbAccount.findOne(account1.id)
      const account3 = dbAccount3.account
      account3.bio.should.equal('I love HeartMail')
      account3.bio.should.not.equal(account1.bio)
      account3.bio.should.equal(account2.bio)
      account3.privKey.toString().should.equal(account1.privKey.toString())
      account3.name.should.equal(account1.name)
      account3.heartmail.should.equal(account1.heartmail)
      account3.contactFeeUsd.should.equal(account1.contactFeeUsd)
      account3.affiliateId.should.equal(account1.affiliateId)
      account3.email.should.equal(account1.email)
      account3.paymail.should.equal(account1.paymail)
      account3.accessGrantedAt.toJSON().should.equal(account1.accessGrantedAt.toJSON())
      account3.updatedAt.toJSON().should.equal(account1.updatedAt.toJSON())
      account3.createdAt.toJSON().should.equal(account1.createdAt.toJSON())
      account3.signedInAt.toJSON().should.equal(account1.signedInAt.toJSON())
    })
  })
})
