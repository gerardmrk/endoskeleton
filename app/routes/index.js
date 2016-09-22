import { ROUTES } from 'configs/preferences'

import Home from 'containers/Home'
import About from 'containers/About'

const mappings = {
  'Home': Home,
  'About': About
}

const routes = ROUTES.map(route => {
  return {
    ...route,
    component: mappings[route.name]
  }
})

export default routes
