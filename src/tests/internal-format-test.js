const formatter = require('../internal-format')
const real = require('../../stubs/transaction-created-real').data
const example = require('../../stubs/transaction-created').data

const minimal = { merchant: {} }

describe('The internal formatter should', () => {
  describe('wrangle the amount so that', () => {
    it('it negates the sign and divides by 100 (who knows for other countries)', () => {
      const neg = { amount: -200, ...minimal }
      const pos = { amount: 200, ...minimal }

      expect(formatter(neg).amount).toEqual(2)
      expect(formatter(pos).amount).toEqual(-2)
    })
  })

  it('split the date and time', () => {
    const actual = formatter(example)

    expect(actual.date).toEqual('2015-09-04')
    expect(actual.time).toEqual('14:28:40')
  })

  it('pick the default merchant if no richer data given', () => {
    expect(formatter(example).merchant).toEqual('The De Beauvoir Deli Co.')
  })

  it('picks the suggested merchant name if given', () => {
    expect(formatter(real).merchant).toEqual('Sainsbury\'s Local')
  })

  it('preserves the description', () => {
    expect(formatter(example).description).toEqual('Ozone Coffee Roasters')
  })

  it('preserves the currency', () => {
    expect(formatter(example).currency).toEqual('GBP')
  })

  it('preserves the monzo category', () => {
    expect(formatter(example).monzo_category).toEqual('eating_out')
  })

  it('preserves the id', () => {
    expect(formatter(example).id).toEqual('tx_00008zjky19HyFLAzlUk7t')
  })

  it('preserves notes', () => {
    expect(formatter(real).notes).toEqual('')
  })
})
