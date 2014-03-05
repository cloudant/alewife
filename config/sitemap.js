var CRUD = [
  'Create',
  'Read',
  'Update',
  'Delete'
];

var Query = [
  'Read',
  'Query'
];

var languages = [
  'CURL',
  'Python',
  'Ruby',
  'Node.js',
  'JavaScript',
  'PHP',
  'Java',
  'Java (Android)',
  'Objective-C'
];

function add_languages (list) {
  return list.map(function (topic) {
    return [topic].concat(languages);
  });
}

function add_methods (methods, list) {
  var methods_with_languages = add_languages(methods);

  if (list) {
    return list.map(function (topic) {
      return [topic].concat(methods_with_languages);
    });  
  } else {
    return methods_with_languages;
  }
}

// doc sections are array of arrays
// the first element of any section
// is its title page
var sitemap = [
  [
    'Account'
  ],
  [
    'Authentication and Authorization',
    [
      'API Keys',
      add_methods(CRUD)
    ],
    [
      'Virtual Hosts',
      add_methods(CRUD)
    ],
    [
      'CORS',
      add_methods(CRUD)
    ],
    [
      'Shared Databases',
      add_methods(CRUD)
    ]
  ],
  [
    'Databases',
    add_methods(CRUD).concat(add_methods(Query, [
      '_all_dbs',
      '_changes'
    ]))
  ],
  [
    'Documents',
    add_methods(CRUD).concat(add_methods(CRUD, [
      '_bulk_docs'
    ]))
  ],
  [
    'Design Documents',
    add_methods(Query, [
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
    add_methods(CRUD)
  ],
  [
    'Monitoring'
  ],
  [
    'Global Database Changes'
  ]
];

module.exports = sitemap;