### ENDOSKELETON (will be completed soon).


Built with Webpack 2 and React Router 4.

Personal boilerplate for isomorphic sideprojects.

#### Instructions:
1. `git clone git@github.com:gerardmrk/endoskeleton.git`

2. `cd endoskeleton && npm install && atom .`

3. Open up `.config`, and set preferences accordingly:
    - `app.meta.json`: Describes important (mostly SEO-essential) header tag values.
    - `build.entries.json`: Client bundles that will be generated by Webpack and included in script tags.
    - `paths.json`: Key paths in the projects (ALL paths listed here will be resolved relative from root to their absolute paths, behind the scenes).
    - `paths.pseudo.json`: Relative paths and file-formats (these paths WON'T be converted to absolute paths).
    - `paths.aliases.json`: Maps aliases to their respective path-constants from `paths.json`.
    - `routes.json`: Client-side routes configuration.

4. Run these 3 commands in their respective terminals:
    - `npm run build:client`
    - `npm run build:renderer:watch` (polls for changes)
    - `npm run start:dev`

#### Server is built with webpack, so it recognizes requiring of css files, image files, json files etc...


#### Current list of files with static, relative path-references:

- `.config/helpers/parseConfigs.js`

- `.config/build_assets/html_template.html`

- `.config/webpack.client.config.babel.js`

- `index.js`

- `source/app/routes/index.js`

- `source/app/components/**/*.css`

- `source/app/containers/**/*.css`

## All I need to do now is finish up the hot reloading.
Then, I optimize the shit out of it, add the docker-compose, and find a way to somehow run one command for everything to work (instead of 4 different commands with 4 terminal windows open).
