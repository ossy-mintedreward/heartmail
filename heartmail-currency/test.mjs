'use strict'
import * as currency from './index.mjs'
import should from 'should'

describe('currency', () => {
  it('should exist', () => {
    should.exist(currency)
  })

  describe('@prefix', () => {
    it('should prefix these known values', () => {
      currency.prefix('$1.00').should.equal('$1.00')
      currency.prefix('$$1.00').should.equal('$1.00')
      currency.prefix('$1$1.00').should.equal('$11.00')
      currency.prefix('1$.00').should.equal('$1.00')
    })
  })

  describe('@format', () => {
    it('should format these known values', () => {
      currency.format('$1.00').should.equal('$1.00')
      currency.format('$1').should.equal('$1.00')
      currency.format('$1.').should.equal('$1.00')
      currency.format('$1.0').should.equal('$1.00')
      currency.format('$1.000').should.equal('$1.00')
      currency.format('1$.00').should.equal('$1.00')
      currency.format('f1.00').should.equal('$1.00')
      currency.format('$.00').should.equal('$0.00')
      currency.format('').should.equal('$0.00')
    })
  })
})