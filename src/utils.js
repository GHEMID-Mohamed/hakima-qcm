export const get = (accessor, arg) => {
  try {
    return accessor(arg)
  } catch (error) {
    if (!(error instanceof TypeError)) {
      // avoid hiding other errors
      throw error
    }
  }
}

export const generateId = () =>
  'i' +
  Math.random()
    .toString(36)
    .slice(2)

export const generateKey = () =>
  Math.random()
    .toString(36)
    .substring(7)
