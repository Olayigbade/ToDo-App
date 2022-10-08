import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../helpers/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('CreateTodosHandler')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', {event: event})

    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    const todoItem = await createTodo(newTodo, getUserId(event))

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: todoItem
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
