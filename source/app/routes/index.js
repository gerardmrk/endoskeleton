import ROUTES from '#configs/routes'

import Home from '#containers/Home'
import About from '#containers/About'

// #@! - static - [START]
const componentMappings = {
  'Home': Home,
  'About': About
}
// #@! - static - [END]

const routes = Object.keys(ROUTES).map(routeName => {
  return {
    ...ROUTES[routeName],
    component: componentMappings[routeName]
  }
})

export default routes
