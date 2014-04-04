# Alewife

[![Build Status](https://travis-ci.org/garbados/alewife.png)](https://travis-ci.org/garbados/alewife)

Code-oriented documentation framework, modeled after [Stripe's API reference](https://stripe.com/docs/api) from your friends at [Cloudant](https://cloudant.com/) :D

**Alewife is in alpha! Abandon all hope ye who enter here!**

Why use Alewife?

* You like Stripe's documentation
* You want to document something with code samples in multiple languages, like an API
* You want to host your docs on a CouchDB instance, or [Cloudant](https://cloudant.com/)!
* You like Markdown :D
* You might want to use [Porter](https://github.com/garbados/porter) to manage docs
* Or, you might want to manage docs right on the filesystem!

## Install

If you want to use Alewife to manage / present your docs:

1. Install node.js from [this website](http://nodejs.org/).
2. Get the repo: `git clone git://github.com/garbados/alewife.git && cd alewife`
4. Install dependencies using node.js' package manager, [npm](https://npmjs.org/): `npm install`
5. Deploy the docs to a CouchDB instance running at `http://localhost:5984`: `npm start`

Now your app is live! By default, the app is pushed to a local CouchDB instance and will live at <http://localhost:5984/docs/_design/alewife/_rewrite>, but that can be modified in `config/index.js`.

## Managing Docs Locally

Alewife can scaffold documentation based on a sitemap constructed in `config.yaml`. The default sitemap is based loosely off of [Cloudant's documentation](http://docs.cloudant.com/), but feel free to play around with it.

To scaffold documentation based on the sitemap:

    npm run scaffold

This will populate the `docs` directory with folders and files reflecting the sitemap. For an example, take a look at `config.yaml`. Alewife converts the YAML to JSON, and uses that to scaffold your documentation.

The task `npm run scaffold` tries not to overwrite anything, so if you want to start from scratch, make sure to `npm run clean` first!

Once you've scaffolded and populated your local docs and want to upload them, do this:

    npm run upload

This will push the sitemap and all your docs up to the `docs` database. 

The sitemap, on the server, looks like this:

    {
      _id: 'sitemap',
      _rev: '...',
      languages: ['cURL', 'Node.js', ...],
      methods: ['Create', 'Read', ...],
      sitemap: [ 'Welcome', [...]]
    }

Documentation looks like this:

    {
      _id: 'Welcome/API Reference/index.md',
      _rev: '...',
      text: '# API Reference \nOur API is awesome, I promise.'
    }

If you make more changes, just run `upload` again. **It will overwrite documents already in the database.**

## Managing Docs w/ Porter

You'll want to use the [docs branch of Porter](https://github.com/garbados/porter/tree/docs). **Instructions coming soon**, but the docs branch works as of this writing, so if you want to, just follow along with [Porter's install instructions](https://github.com/garbados/porter/tree/docs#install).

## The App Itself

The Alewife interface is under heavy development and probably currently sucks because CSS is a jerk and I don't understand it. So here's how it should work, where to find underlying code, etc.:

### Commands

How `npm run [command]` executes is detailed under the `scripts` key of `package.json`. Various tasks reside in the `tasks` folder, some are JS executables like `jshint`, and some are just commands like `grep`.

Here's the major tasks and what they do:

* `npm start`: converts `config.yaml` to `config.json`, copies assets to dist, and deploys the app.
* `npm run scaffold`: uses `config.json` to scaffold a documentation architecture in `docs`.
* `npm run upload`: uploads each file in `docs` to the CouchDB / Cloudant db specified in `couch.json`.
* `npm test`: scaffolds, uploads, and then `npm start`. Used by Travis.
* `npm run clean`: removes any files git isn't aware of, ex: everything in `docs`.

### Language

Alewife uses the search string to determine the current language. So for a query string like this...

    ?Android

The current language is `Android`. The current language defaults to the first listed language in `config.yaml`.

### HTML

All HTML lives in `assets/html/` and is copied into `dist/` during compilation. 

REMEMBER, EDIT ASSETS, NOT DIST.

### JS

All JavaScript lives in `assets/js/` and is copied into `dist/js` during compilation. 

REMEMBER, EDIT ASSETS, NOT DIST.

### CSS

Stylesheets are currently linked to via the BootstrapCDN. I leave styling as an exercise for the reader.

## Contributing

Want to get involved? Yay! Just follow your nose, and these steps:

1. Fork the repo.
2. Make a feature branch, like `fixed-typo`.
3. Make changes in that branch.
4. Make a Pull Request to merge your changes back into our master branch.

You're done! Thanks for contributing :D

See something you want, or want fixed? Leave an [issue](https://github.com/garbados/alewife/issues) and I'll hop to :D

## License

[MIT](http://opensource.org/licenses/MIT), yo.