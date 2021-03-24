const { assert } = require('chai')
const cuid = require('cuid')
const AWS = require('aws-sdk')
const Axios = require('axios')
const fs = require('fs')
const { initiateMultipartUpload, generatePresignedUrlsParts, completeMultiUpload } = require('../src/multipart-upload')

const BUCKET_NAME = 'alto-template-mpupload-test'
const FILE_OBJECT_NAME = 'test-file.dat'
const FILE_CHUNK_SIZE = 5_242_880
const TEST_FILE = 'tests/large-file.dat'

describe('file upload', () => {
  it('should upload multipart files', async () => {
    const s3 = new AWS.S3({})
    const file = fs.readFileSync(TEST_FILE)
    const uniqueFileObjectName = `${FILE_OBJECT_NAME}-${cuid.slug()}`
    const filePartCount = file.byteLength / FILE_CHUNK_SIZE

    // 1. Get upload part URLs and metadata
    const uploadId = await initiateMultipartUpload(s3, BUCKET_NAME, uniqueFileObjectName)
    const partUrls = await generatePresignedUrlsParts(s3, BUCKET_NAME, uniqueFileObjectName, uploadId, filePartCount)

    // 2. Upload file
    const uploadedParts = await uploadParts(file, partUrls)

    // 3. Complete the upload
    await completeMultiUpload(s3, BUCKET_NAME, uniqueFileObjectName, uploadId, uploadedParts)

    // 4. Assert the file exists in the bucket
    const { ContentLength } = await s3.headObject({
      Bucket: BUCKET_NAME,
      Key: uniqueFileObjectName,
    }).promise()

    assert.isTrue(ContentLength === file.byteLength)
  }).timeout(30_000)
})

async function uploadParts(fileBuffer, partUrls) {
  const axios = Axios.create()
  delete axios.defaults.headers.put['Content-Type']

  const keys = Object.keys(partUrls)
  const promises = []

  for (const indexStr of keys) {
    const index = parseInt(indexStr) - 1
    const start = index * FILE_CHUNK_SIZE
    const end = (index + 1) * FILE_CHUNK_SIZE
    const blob = index < keys.length
      ? fileBuffer.slice(start, end)
      : fileBuffer.slice(start)

    promises.push(axios.put(partUrls[index + 1], blob))
  }

  const parts = await Promise.all(promises)
  return parts.map((part, index) => ({
    ETag: part.headers.etag,
    PartNumber: index + 1
  }))
}
