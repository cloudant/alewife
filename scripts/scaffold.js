var fs = require('fs');
var path = require('path');
var async = require('async');

var CRUD = [
  'Create',
  'Read',
  'Update',
  'Delete'
];

var languages = [
  'CURL',
  'Python',
  'Ruby',
  'JavaScript',
  'PHP',
  'Java',
  'Java (Android)',
  'Objective-C'
];

// doc sections are array of arrays
// the first element of any section
// is its title page
// TODO move to config/sitemap.js
// TODO map languages onto scaffold outside of document writing
var api_reference = [
  [
    'Account'
  ],
  [
    'Authentication and Authorization',
    [
      'API Keys',
      CRUD
    ],
    [
      'Virtual Hosts',
      CRUD
    ],
    [
      'CORS',
      CRUD
    ],
    [
      'Shared Databases',
      CRUD
    ]
  ],
  [
    'Databases',
    CRUD.concat([
      '_all_dbs',
      '_changes'
    ])
  ],
  [
    'Documents',
    CRUD.concat([
      '_bulk_docs'
    ])
  ],
  [
    'Design Documents',
    CRUD.concat([
      'Search Indexes',
      'MapReduce Indexes',
      'Geo Indexes',
      'List Functions',
      'Show Function',
      'Filter Functions',
      'Update Handlers',
      'Update Validators',
      'DBCopy'
    ])
  ],
  [
    'Replication',
    CRUD
  ],
  [
    'Monitoring'
  ],
  [
    'Global Database Changes'
  ]
];

function scaffold (filepath, sitemap, done) {
  function write_title (filepath, done) {
    async.series([
      function (done) {
        fs.mkdir(filepath, function (err) {
          if (err && err.code !== 'EEXIST') {
            done(err);
          } else {
            done();
          }
        });
      },
      fs.writeFile.bind(fs, path.join(filepath, 'index.md'), 'TODO')
    ], done);
  }

  function write_page (filepath, done) {
    async.series([
      function (done) {
        fs.mkdir(filepath, function (err) {
          if (err && err.code !== 'EEXIST') {
            done(err);
          } else {
            done();
          }
        });
      },
      async.map.bind(async, languages, function (language, done) {
        var doc_path = path.join(filepath, language + '.md');
        fs.writeFile(doc_path, 'TODO', done);
      })
    ], done);
  }

  if (sitemap[0].forEach) {
    // first element is an array
    // break it down >:D
    async.map(sitemap, scaffold.bind(null, filepath), done);
  } else {
    var tasks = [];

    // first element is a string
    // if the next element is an array
    // or if there is no next element
    // treat it as the title page
    if (!sitemap[1] || sitemap[1].forEach) {
      var title = sitemap[0];
      filepath = path.join(filepath, title);
      var pages = sitemap.slice(1); 

      // write the title
      tasks.push(write_title.bind(null, filepath));
    } else {
      var pages = sitemap;
    }
    
    // write the pages
    if (!pages.length) {
      // nothing to do; no pages
    } else if (pages[0].forEach) {
      // pages are an array of arrays
      // break it up!
      tasks = tasks.concat(pages.map(function (page) {
        return scaffold.bind(null, filepath, page);
      }));
    } else {
      // it's an array of strings
      // write them to disk
      tasks = tasks.concat(pages.map(function (page) {
        return write_page.bind(null, path.join(filepath, page));
      }));
    }

    // resolve tasks
    async.series(tasks, done);
  }
}

scaffold(path.join(process.cwd(), 'docs'), api_reference, function (err) {
  if (err) {
    console.trace(err);
  } else {
    console.log('Scaffolding complete');
  }
});