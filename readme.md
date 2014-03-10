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
3. Get the repo:

    git clone git://github.com/garbados/alewife.git
    cd alewife

4. Install dependencies using node.js' package manager, [npm](https://npmjs.org/):

    npm install

5. Deploy the docs to a CouchDB instance running at `http://localhost:5984`

    npm run-script deploy

Now your app is live! By default, the app is pushed to a local CouchDB instance running at `http://localhost:5984` and using the `docs` database, but that can be modified in `config/index.js`.

## Managing Docs Locally

Alewife can scaffold documentation based on a sitemap constructed in `config/sitemap/index.js`. The default sitemap is based loosely off of [Cloudant's documentation](http://docs.cloudant.com/), but feel free to play around with it.

To scaffold documentation based on the sitemap:

    npm run-script scaffold

This will populate the `docs` directory with folders and files reflecting the sitemap. For example, a sitemap like this...

    [
      'API Reference',
      [
        'Create a Database',
        [
          'CURL',
          'Python',
          'Ruby'
        ]
      ]
    ]

... will create a file hierarchy like this:

    docs/
      API Reference/
        Create a Database/
          index.md
          CURL.md
          Python.md
          Ruby.md
        index.md

The first element of a section, when further elements are arrays, is considered the title section, reflected in the `index.md` for that directory. Further strings in the array are considered language examples, named `[language].md` in that section's directory.

*That feels hard to explain, so it's probably a bad idea. Suggestions welcome.*

Once you've scaffolded and populated your local docs and want to upload them, do this:

    npm run-script sync

This will push the sitemap and all your docs up to the `docs` database. 

The sitemap, on the server, looks like this:

    {
      _id: 'sitemap',
      _rev: '...',
      sitemap: [ 'Welcome', [...]]
    }

Documentation looks like this:

    {
      _id: 'Welcome/API Reference/index.md',
      _rev: '...',
      text: '# API Reference \nOur API is awesome, I promise.'
    }

If you make more changes, just run `sync` again. It will overwrite server-side changes.

## Managing Docs w/ Porter

You'll want to use the [docs branch of Porter](https://github.com/garbados/porter/tree/docs). **Instructions coming soon**, but the docs branch works as of this writing, so if you want to, just follow along with [Porter's install instructions](https://github.com/garbados/porter/tree/docs#install).

## Contributing

Want to get involved? Yay! Just follow your nose, and these steps:

1. Fork the repo.
2. Make a feature branch, like `fixed-typo`.
3. Make changes in that branch.
4. Make a Pull Request to merge your changes back into our master branch.

You're done! Thanks for contributing :D

See something you want, or want fixed? Leave an [issue](https://github.com/garbados/alewife/issues) and I'll hop to :D