function tryParseBody(value) {
  try {
    return JSON.parse(value)
  } catch (err) {
    return console.log(`Failed to parse the request body.`, err)
  }
}

function badRequest(body) {
  return {
    statusCode: 400,
    body
  }
}

function serverError(body) {
  return {
    statusCode: 500,
    body
  }
}

function ok(body) {
  return {
    statusCode: 200,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  }
}

function noContent() {
  return {
    statusCode: 204
  }
}

module.exports = {
  tryParseBody,
  http: {
    badRequest,
    serverError,
    ok,
    noContent
  }
}