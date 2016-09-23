const { readFileSync } = require('fs')

const parsePreferences = absoluteRootPath => {
  let PREFS
  try {
    // #@! - static - [START]
    PREFS = JSON.parse(
      readFileSync(`${absoluteRootPath}/_config_/preferences.json`, 'utf8')
    )
    // #@! - static - [END]

    Object.keys(PREFS.PATHS).forEach(pathname => {
      const path = PREFS.PATHS[pathname]
      PREFS.PATHS[pathname] = `${absoluteRootPath}/${path}`
    })
    PREFS.PATHS['root'] = absoluteRootPath
  } catch (err) {
    console.error(err)
  }
  return PREFS
}

module.exports = parsePreferences
