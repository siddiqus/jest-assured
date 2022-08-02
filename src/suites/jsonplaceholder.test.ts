import { apis } from '../core'

describe('jsonplaceholder', () => {
  it('should fetch the first todo', async () => {
    const result = await apis.jsonplaceholder.get('/todos/1')
    expect(result.data.id).toEqual(1)
  })
})
