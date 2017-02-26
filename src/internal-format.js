const moment = require('moment')

const merchantName = (merchant) => {
  if (merchant.metadata && merchant.metadata.suggested_name) return merchant.metadata.suggested_name

  return merchant.name
}

const formatter = (monzoTransaction) => {
  const dateTime = moment(monzoTransaction.created)

  return {
    date: dateTime.format('YYYY-MM-DD'),
    time: dateTime.format('HH:mm:ss'),
    description: monzoTransaction.description,
    merchant: merchantName(monzoTransaction.merchant),
    amount: (monzoTransaction.amount * -1) / 100,
    currency: monzoTransaction.currency,
    monzo_category: monzoTransaction.category,
    id: monzoTransaction.id,
    notes: monzoTransaction.notes
  }
}

const order = ['date', 'time', 'description', 'merchant', 'amount', 'currency', 'monzo_category', 'id', 'notes']

const sheetsOrder = (transaction) => {
  return order.map(posistion => transaction[posistion])
}

module.exports = { sheetsOrder, formatter }
