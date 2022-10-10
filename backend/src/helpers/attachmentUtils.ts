import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'

var AWS = AWSXRay.captureAWS(require('aws-sdk'));
const logger = createLogger('AttachmentUtils')


export class AttachmentUtils {

    constructor(
        private readonly s3Client: AWS.S3 = new AWS.S3({ signatureVersion: 'v4' }),
        private readonly attachmentS3Bucket = process.env.ATTACHMENT_S3_BUCKET,
        private readonly signedUrlExpiration = process.env.SIGNED_URL_EXPIRATION
    ) {}

    async generateUploadUrl(todoId: string): Promise<string> {
        logger.info('Generating pre-signed URL')

        const attachmentUrl = this.s3Client.getSignedUrl('putObject', {
            Bucket: this.attachmentS3Bucket,
            Key: todoId,
            Expires: parseInt(this.signedUrlExpiration)
        })

        return attachmentUrl
    }
}