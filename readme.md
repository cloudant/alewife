# docs.cloudant.com

Cloudant's public documentation, which lives at [docs.cloudant.com](http://docs.cloudant.com/). This repo contains everything that lives on the docs site: content, stylesheets, code, etc. You can use this repo to host your own copy of the documentation, or to contribute to it :D

## Install

To host the docs yourself...

1. Install node.js from [this website](http://nodejs.org/).
2. Install [grunt](http://gruntjs.com/): `npm install -g grunt-cli`
3. Get the repo:

    git clone git://github.com/cloudant-labs/docs.git
    cd docs

4. Install dependencies using node.js' package manager, [npm](https://npmjs.org/):

    npm install

5. Use grunt to build assets and push the app wherever `config.json` says:

    grunt deploy

Now your app is live! By default, the app is pushed to a local CouchDB instance running at `http://localhost:5984` and using the `docs` database, but that can be modified in `config/index.js`.

## Contents

Run `npm run-script sitemap` to get a vision of how the site's laid out. For readability purposes, this task ignores entries for specific language examples.

## Contributing

Want to get involved? Yay! Just follow your nose, and these steps:

1. Fork the repo.
2. Make a feature branch, like `fixed-typo`.
3. Make changes in that branch.
4. Make a Pull Request to merge your changes back into our master branch.

You're done! Thanks for contributing :D