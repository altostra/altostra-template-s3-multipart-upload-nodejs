const { assert } = require('chai')
const cuid = require('cuid')
const AWS = require('aws-sdk')
const Axios = require('axios')
const fs = require('fs')

const FILE_OBJECT_NAME = 'test-file.dat'
const FILE_CHUNK_SIZE = 5_242_880
const TEST_FILE = 'tests/large-file.dat'

const { ALTO_TEST_API_URL: API_URL, ALTO_TEST_BUCKET_NAME: BUCKET_NAME } = process.env
if (!API_URL) throw new Error(`Missing ALTO_TEST_API_URL environment variable.`)
if (!BUCKET_NAME) throw new Error(`Missing ALTO_TEST_BUCKET_NAME environment variable.`)

describe('file upload', () => {
  it('should upload multipart files', async () => {
    const s3 = new AWS.S3({})
    const axios = Axios.create()
    const file = fs.readFileSync(TEST_FILE)
    const uniqueFileObjectName = `${FILE_OBJECT_NAME}-${cuid.slug()}`
    const filePartCount = file.byteLength / FILE_CHUNK_SIZE

    delete axios.defaults.headers.put['Content-Type']

    // 1. Get upload part URLs and metadata
    let uploadMetadata

    try {
      const params = {
        fileName: uniqueFileObjectName,
        partsCount: filePartCount
      }
      uploadMetadata = (await axios.post(`${API_URL}/file/upload`, params, {
        headers: {
          'Content-Type': 'application/json'
        }
      })).data
    } catch (err) {
      throw new Error(`Failed to initiate upload: ${err.response.status} - ${err.response.data}`)
    }

    // 2. Upload file
    const { uploadId, partUrls } = uploadMetadata
    const uploadedParts = await uploadParts(axios, file, partUrls)

    // 3. Complete the upload
    try {
      const params = {
        uploadId,
        parts: uploadedParts,
        fileName: uniqueFileObjectName
      }

      await axios.put(`${API_URL}/file/upload`, params, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    } catch (err) {
      throw new Error(`Failed to complete the upload: ${err.response.status} - ${err.response.data}`)
    }

    // 4. Assert the file exists in the bucket
    const { ContentLength } = await s3.headObject({
      Bucket: BUCKET_NAME,
      Key: uniqueFileObjectName,
    }).promise()

    assert.isTrue(ContentLength === file.byteLength)
  }).timeout(30_000)
})

async function uploadParts(axios, fileBuffer, partUrls) {
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
