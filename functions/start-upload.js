const AWS = require('aws-sdk')
const { initiateMultipartUpload, generatePresignedUrlsParts } = require('../src/multipart-upload')
const { tryParseBody, http } = require('./common')

const { BUCKET_FILES01: BUCKET_NAME } = process.env

module.exports.handler = async event => {
  const s3 = new AWS.S3()
  const body = tryParseBody(event.body)
  if (!body) return http.badRequest(
    'Missing request parameters'
  )
  const { fileName, partsCount } = body

  if (typeof fileName !== 'string' || fileName.length < 4) return http.badRequest(
    'Invalid file name. Must be at least 3 chars long.'
  )

  if (typeof partsCount !== 'number' || partsCount < 1) return http.badRequest(
    'Invalid parts count, must be an integer larger than 0.'
  )

  const uploadId = await initiateMultipartUpload(s3, BUCKET_NAME, fileName)
  const partUrls = await generatePresignedUrlsParts(s3, BUCKET_NAME, fileName, uploadId, partsCount)

  return http.ok({
    uploadId,
    partUrls
  })
}

