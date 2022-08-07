import { getTodos } from '../services/jsonplaceholder'

describe('jsonplaceholder', () => {
  it('should fetch the first todo', async () => {
    const result = await getTodos(1)
    expect(result.data.id).toEqual(1)
  })
})
