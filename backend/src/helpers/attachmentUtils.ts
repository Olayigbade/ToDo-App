import * as AWS from 'aws-sdk'
import { createLogger } from '../utils/logger'

const logger = createLogger('AttachmentUtils')

export class AttachmentUtils {

    constructor(
        private readonly s3Client: AWS.S3 = new AWS.S3({ signatureVersion: 'v4' }),
        private readonly s3Bucket = process.env.ATTACHMENT_S3_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
    ) {}

    async generateUploadUrl(todoId: string): Promise<string> {
        logger.info('Generating pre-signed URL')

        const url = this.s3Client.getSignedUrl('putObject', {
            Bucket: this.s3Bucket,
            Key: todoId,
            Expires: parseInt(this.urlExpiration)
        })

        return url
    }
}