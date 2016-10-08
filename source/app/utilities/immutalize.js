import { fromJS } from 'immutable'

const immutalize = state => {
  Object.keys(state).forEach(key => {
    if (key !== 'routing') state[key] = fromJS(state[key])
  })
  return state
}

export default immutalize
