import * as AWS from 'aws-sdk'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
import {getDocumentClient} from '@shelf/aws-ddb-with-xray'

const logger = createLogger('TodosAccess')

export class TodosAccess {

    constructor(
        private readonly docClient: AWS.DynamoDB.DocumentClient = getDocumentClient({
            ddbParams: {region: 'us-east-1', convertEmptyValues: true},
            ddbClientParams: {region: 'us-east-1'},
          }),
        private readonly todosTable = process.env.TODOS_TABLE
    ) {}

    async getAllTodoItemsForUser(userId: string): Promise<TodoItem[]> {
        logger.info('Getting all todo items for user: ', {userId: userId})
        
        const result = await this.docClient.query({
            TableName: this.todosTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        const items = result.Items
        return items as TodoItem[]
    }

    async getTodoByIDAndUserId(todoId: string, userId: string) {
        logger.info('Getting todo item for user: ', { userId: userId })
        
        const result = await this.docClient.get({
            TableName: this.todosTable,
            Key: { 'todoId': todoId, 'userId': userId }
        }).promise()

        return !!result.Item
    }

    async createTodo(todoItem: TodoItem): Promise<TodoItem> {
        logger.info('Creating todo item: ', {item: todoItem})

        await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem
        }).promise()

        return todoItem
    }

    async updateTodo(todoItem: TodoUpdate, todoId: string, userId: string) {
        logger.info('Updating todo item', {item: todoItem})

        await this.docClient.update({
            TableName: this.todosTable,
            Key: { 'todoId': todoId, 'userId': userId },
            UpdateExpression: 'set #name = :name, #dueDate = :dueDate, #done = :done',
            ExpressionAttributeNames: {
                '#name': 'name',
                '#dueDate': 'dueDate',
                '#done': 'done'
            },
            ExpressionAttributeValues: {
                ':name': todoItem.name,
                ':dueDate': todoItem.dueDate,
                ':done': todoItem.done
            }
        }).promise()
    }

    async deleteTodo(todoId: string, userId: string) {
        logger.info('Deleting todo item', {todoId: todoId})

        await this.docClient.delete({
            TableName: this.todosTable,
            Key: { 'todoId': todoId, 'userId': userId }
        }).promise()
    }
}