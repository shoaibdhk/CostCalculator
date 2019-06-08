function IsJsonString(str) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

const catchErrors = error => {
  if (error && error.message) {
    let errors = error.message.replace('GraphQL error: ', '')
    if (IsJsonString(errors)) {
      return JSON.parse(errors)
    }
  }
}

export default catchErrors
