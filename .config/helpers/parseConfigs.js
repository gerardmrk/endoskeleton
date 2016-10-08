const { readFile } = require('fs')

const parseConfigs = async absRootPath => {
  try {
    const configsDir = `${absRootPath}/.config`
    const configs = [
      ['APP_META', `${configsDir}/app.meta.json`],
      ['ROUTES', `${configsDir}/routes.json`],
      ['PATHS', `${configsDir}/paths.json`],
      ['ALIASES', `${configsDir}/paths.aliases.json`],
      ['PSEUDO_PATHS', `${configsDir}/paths.pseudo.json`],
      ['ENTRIES', `${configsDir}/build.entries.json`]
    ]

    const parsedConfigs = {}

    const configJSON = await Promise.all(configs.map(cfg => parsejson(cfg[1])))

    configJSON.forEach((cfg, i) => { parsedConfigs[configs[i][0]] = cfg })

    Object.keys(parsedConfigs['PATHS']).forEach(pathname => {
      parsedConfigs['PATHS'][pathname] = `${absRootPath}/${parsedConfigs['PATHS'][pathname]}`
    })
    parsedConfigs['PATHS']['ROOT'] = absRootPath

    // map path aliases to their respective absolute paths
    Object.keys(parsedConfigs['ALIASES']).forEach(aliasId => {
      parsedConfigs['ALIASES'][aliasId] = parsedConfigs['PATHS'][parsedConfigs['ALIASES'][aliasId]]
    })
    // parse any pseudo bundle entrypoints to real paths
    Object.keys(parsedConfigs['ENTRIES']).forEach(entry => {
      parsedConfigs['ENTRIES'][entry].forEach((mod, i) => {
        if (Array.isArray(mod)) {
          let parsedMod = parsedConfigs[mod[0]]
          let nestLevel = 1
          while (nestLevel < mod.length) {
            parsedMod = parsedMod[mod[nestLevel]]
            parsedConfigs['ENTRIES'][entry][i] = parsedMod
            nestLevel++
          }
        }
      })
    })

    return parsedConfigs
  } catch (err) {
    console.error(err)
  }
  // Promise.all(configs.map(cfg => parsejson(cfg[1])))
  // .then(cfgs => cfgs.forEach((cfg, i) => { parsedConfigs[configs[i][0]] = cfg }))
  // .then(() => {
  //   // convert relative paths to absolute paths
  //   Object.keys(parsedConfigs['PATHS']).forEach(pathname => {
  //     parsedConfigs['PATHS'][pathname] = `${absRootPath}/${parsedConfigs['PATHS'][pathname]}`
  //   })
  //   parsedConfigs['PATHS']['ROOT'] = absRootPath
  //
  //   // map path aliases to their respective absolute paths
  //   Object.keys(parsedConfigs['ALIASES']).forEach(aliasId => {
  //     parsedConfigs['ALIASES'][aliasId] = parsedConfigs['PATHS'][parsedConfigs['ALIASES'][aliasId]]
  //   })
  //   // parse any pseudo bundle entrypoints to real paths
  //   Object.keys(parsedConfigs['ENTRIES']).forEach(entry => {
  //     parsedConfigs['ENTRIES'][entry].forEach((mod, i) => {
  //       if (Array.isArray(mod)) {
  //         let parsedMod = parsedConfigs[mod[0]]
  //         let nestLevel = 1
  //         while (nestLevel < mod.length) {
  //           parsedMod = parsedMod[mod[nestLevel]]
  //           parsedConfigs['ENTRIES'][entry][i] = parsedMod
  //           nestLevel++
  //         }
  //       }
  //     })
  //   })
  // })
  // .catch(console.error)
}

const parsejson = filePath => new Promise((resolve, reject) => {
  readFile(filePath, 'utf8', (err, data) => {
    if (err) return reject(err)
    return resolve(JSON.parse(data))
  })
})

export default parseConfigs
