const AWS = require('aws-sdk')
const { tryParseBody, http } = require('./common')
const { completeMultiUpload } = require('../src/multipart-upload')

const { BUCKET_FILES01: BUCKET_NAME } = process.env

module.exports.handler = async event => {
  const s3 = new AWS.S3()
  const body = tryParseBody(event.body)
  if (!body) return http.badRequest(
    'Missing request parameters'
  )
  const { uploadId, parts, fileName } = body

  if (typeof fileName !== 'string' || fileName.length < 3) return http.badRequest(
    'Invalid file name. Must be at least 3 chars long.'
  )

  if (!Array.isArray(parts) || parts.length < 1) return http.badRequest(
    'Invalid file parts data.'
  )

  if (typeof uploadId !== 'string' || uploadId.length < 1) return http.badRequest(
    'Invalid upload ID.'
  )

  try {
    await completeMultiUpload(s3, BUCKET_NAME, fileName, uploadId, parts)
  } catch (err) {
    console.error(`Failed to complete multipart upload against S3.`, err)
    return http.serverError('An error occurred while completing the file upload.')
  }

  return http.noContent()
}

