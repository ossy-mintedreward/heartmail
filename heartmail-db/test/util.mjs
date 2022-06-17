/* global describe,it */
import { util, DbMbAccount } from '../index.mjs'
import { Bn, Random } from 'heartmail-lib'
import should from 'should'

const getAffiliate = util.getAffiliate

describe('utilities', () => {
  it('should exist', () => {
    should.exist(getAffiliate)
  })

  describe('paymentIsNew', () => {
    it('should be true for new and false for not new', async () => {
      const mbPaymentId = Bn.fromBuffer(Random.getRandomBuffer(6)).toString()
      const mbPayment = {
        id: mbPaymentId,
        user: {
          email: 'name@example.com'
        },
        senderPaymail: 'name@example.com',
        txid: '00'.repeat(32),
        userId: '1'
      }

      let isNew = await util.paymentIsNew(mbPayment)
      isNew.should.equal(true)
      isNew = await util.paymentIsNew(mbPayment)
      isNew.should.equal(false)
    })
  })

  describe('createMbAccountWithPayment', () => {
    it('should create a new account and then an affiliate account', async () => {
      let affiliateId
      {
        const contactFeeUsd = 5.00
        const affiliate = null
        const mbPaymentId = Bn.fromBuffer(Random.getRandomBuffer(6)).toString()
        const mbPayment = {
          id: mbPaymentId,
          user: {
            email: 'name@example.com'
          },
          senderPaymail: 'name@example.com',
          txid: '00'.repeat(32),
          userId: '1'
        }
        const mbAccountId = await util.createMbAccountWithPayment(contactFeeUsd, affiliate, mbPayment)
        mbAccountId.length.should.greaterThan(10)
        affiliateId = mbAccountId
      }

      {
        const affiliate = {
          id: affiliateId
        }
        const contactFeeUsd = 10.00
        const mbPaymentId = Bn.fromBuffer(Random.getRandomBuffer(6)).toString()
        const mbPayment = {
          id: mbPaymentId,
          user: {
            email: 'name2@example.com'
          },
          senderPaymail: 'name2@example.com',
          txid: '01'.repeat(32),
          userId: '2'
        }
        const mbAccountId = await util.createMbAccountWithPayment(contactFeeUsd, affiliate, mbPayment)
        mbAccountId.length.should.greaterThan(10)
        mbAccountId.should.not.equal(affiliateId)
        const mbAccount = await util.getMbAccount(mbAccountId)
        mbAccount.id.should.equal(mbAccountId)
        mbAccount.mbEmail.should.equal('name2@example.com')
        mbAccount.mbPaymail.should.equal('name2@example.com')
        mbAccount.mbTxid.should.equal('01'.repeat(32))
        mbAccount.mbUserId.should.equal('2')
        mbAccount.mbPaymentId.should.equal(mbPaymentId)
        mbAccount.mbPayment.should.equal(JSON.stringify(mbPayment))
      }
    })
  })

  describe('getAffiliate', () => {
    it('should get an affiliate that exists', async function () {
      const dbMbAccount = DbMbAccount.create()
      dbMbAccount.mbAccount.fromObject({
        mbPaymail: 'name@example.com'
      })
      await dbMbAccount.insert()
      const affiliateHeartmail = `${dbMbAccount.mbAccount.id}@heartmail.com`
      const affiliate = await util.getAffiliate(affiliateHeartmail)
      affiliate.hasAffiliate.should.equal(true)
      affiliate.id.should.equal(dbMbAccount.mbAccount.id)
      affiliate.mbPaymail.should.equal(dbMbAccount.mbAccount.mbPaymail)
    })
  })
})
