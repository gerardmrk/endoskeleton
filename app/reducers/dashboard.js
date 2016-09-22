import { Map } from 'immutable'
import createReducer from 'utilities/createReducer'

const reducer = createReducer(Map({}), {
  IS_LOADING_STATS (state, action) {
    return state
  }
})

export default reducer
