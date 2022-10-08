import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'

const todosAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    return todosAccess.getAllTodoItemsForUser(userId)
}

export async function createTodo(todo: CreateTodoRequest, userId: string): Promise<TodoItem> {
    const todoId = uuid.v4()
    const createdAt = new Date().toISOString()
    const s3Bucket = process.env.ATTACHMENT_S3_BUCKET

    const todoItem = {
        userId,
        todoId,
        done: false,
        attachmentUrl: `https://${s3Bucket}.s3.amazonaws.com/${todoId}`,
        createdAt,
        ...todo
    }

    const newItem = todosAccess.createTodo(todoItem)

    return newItem
}

export async function updateTodo(updatedTodo: UpdateTodoRequest, todoId: string, userId: string) {
    //Checks if todo exists
    const validTodo = await todosAccess.getTodoByIDAndUserId(todoId, userId)

    if(!validTodo){
        return null
    }

    await todosAccess.updateTodo(updatedTodo, todoId, userId)
}

export async function deleteTodo(todoId: string, userId: string) {
    //Check if todo exists
    const validTodo = await todosAccess.getTodoByIDAndUserId(todoId, userId)

    if(!validTodo){
        return null
    }

    await todosAccess.deleteTodo(todoId, userId)
}

export async function createAttachmentPresignedUrl(todoId: string): Promise<string> {
    return attachmentUtils.generateUploadUrl(todoId)
}
