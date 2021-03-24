async function initiateMultipartUpload(s3, bucket, file) {
  const params = {
    Bucket: bucket,
    Key: file
  }

  const { UploadId } = await s3.createMultipartUpload(params).promise()
  return UploadId
}

async function generatePresignedUrlsParts(s3, bucket, file, uploadId, partsCount) {
  const promises =
    Array.from(Array(partsCount).keys())
      .map(partNo => s3.getSignedUrlPromise('uploadPart', {
        Bucket: bucket,
        Key: file,
        UploadId: uploadId,
        PartNumber: partNo + 1
      }))

  const res = await Promise.all(promises)

  return res.reduce((map, part, index) => {
    map[index + 1] = part
    return map
  }, {})
}

async function completeMultiUpload(s3, bucket, file, uploadId, parts) {
  const params = {
    Bucket: bucket,
    Key: file,
    UploadId: uploadId,
    MultipartUpload: { Parts: parts }
  }

  await s3.completeMultipartUpload(params).promise()
}

module.exports = {
  initiateMultipartUpload,
  generatePresignedUrlsParts,
  completeMultiUpload
}