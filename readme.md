# docs.cloudant.com

Cloudant's public documentation, which lives at [docs.cloudant.com](http://docs.cloudant.com/). This repo contains everything that lives on the docs site: content, stylesheets, code, etc. You can use this repo to host your own copy of the documentation, or to contribute to it :D

## Install

1. To host the docs yourself, you'll need to install these:

* [node.js](http://nodejs.org/): download and install manually.
* [grunt](http://gruntjs.com/): `npm install -g grunt-cli`

2. Get the repo:

    git clone git://github.com/cloudant-labs/docs.git
    cd docs

3. Install dependencies using node.js' package manager, [npm](https://npmjs.org/):

    npm install

4. Use grunt to build assets and push the app wherever `config.json` says:

    grunt

Now your app is live! By default, the app is pushed to a local CouchDB instance running at `localhost:5984` and using the `docs` database, but that can be modified in `config.json`.

## Contents

Here's where different kinds of content live:

    getting-started
      basics
        libraries
        http
        json
      crud
        reading
        writing
        updating
        deleting
      querying
        secondary indexes
        search indexes
        list functions
        show functions
        chained mapreduce
      advanced
        authentication
        authorization
        replication
    examples & cookbooks
      transactions
      relationships
      couchapps
    theory & concepts
      the cap theorem
      mapreduce
      document versioning

## Contributing

Want to get involved? Yay! Just follow your nose, and these steps:

1. Fork the repo.
2. Make a feature branch, like `fixed-typo`.
3. Make changes in that branch.
4. Make a Pull Request to merge your changes back into our master branch.


You're done! Thanks for contributing :D