const handler = require('../').handler

const lambdaBox = (lambda, event) => {
  const mergedEvent = { ...event }
  const context = {}

  return new Promise((resolve, reject) => {
    lambda(mergedEvent, context, (fail, success) => {
      if (fail) resolve(fail)
      if (success) resolve(success)

      resolve(null)
    })
  })
}

describe('The lambda handler', () => {
  it('should add a valid transaction to google sheets', (done) => {
    const event = {
      body: require('../../stubs/transaction-created-real.json')
    }

    lambdaBox(handler, event).then(res => {
      expect(res.headers).toEqual({ 'Content-type': 'application/json' })
      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual({ description: 'Sainsbury\'s Local' })
      done()
    })
  })

  it('should return a message if the item isn\'t spending', (done) => {
    const event = {
      body: { data: { include_in_spending: false } }
    }

    lambdaBox(handler, event).then(res => {
      expect(res.headers).toEqual({ 'Content-type': 'application/json' })
      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual({ requiredProcessing: false })
      done()
    })
  })

  describe('should error', () => {
    it('if there is no body', (done) => {
      lambdaBox(handler).then(res => {
        expect(res.headers).toEqual({ 'Content-type': 'application/json' })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toEqual({ error: 'No body in payload' })
        done()
      })
    })

    it('if the body is unparsable', (done) => {
      lambdaBox(handler, { body: 'a::c' }).then(res => {
        expect(res.headers).toEqual({ 'Content-type': 'application/json' })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toEqual({ error: 'Unparsable body' })
        done()
      })
    })

    it('if there is no data', (done) => {
      lambdaBox(handler, { body: '{ "type": "transaction.created" }' }).then(res => {
        expect(res.headers).toEqual({ 'Content-type': 'application/json' })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toEqual({ error: 'No data attribute' })
        done()
      })
    })

    xit('Run it through a schema validator when the API changes', () => {

    })
  })
})
