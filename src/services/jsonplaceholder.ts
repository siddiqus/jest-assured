import { apis } from '../core'

export async function getTodos(todoId: number) {
  return apis.jsonplaceholder.get(`/todos/${todoId}`)
}
