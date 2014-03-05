var util = require('./util');

var api_reference = [
  'API Reference',
  [
    'Account'
  ],
  [
    'Authentication and Authorization',
    [
      'API Keys',
      util.add_crud()
    ],
    [
      'Virtual Hosts',
      util.add_crud()
    ],
    [
      'CORS',
      util.add_crud()
    ],
    [
      'Shared Databases',
      util.add_crud()
    ]
  ],
  [
    'Databases',
    util.add_crud().concat(util.add_query([
      '_all_dbs',
      '_changes'
    ]))
  ],
  [
    'Documents',
    util.add_crud().concat(util.add_crud([
      '_bulk_docs'
    ]))
  ],
  [
    'Design Documents',
    util.add_query([
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
    util.add_crud()
  ],
  [
    'Monitoring'
  ],
  [
    'Global Database Changes'
  ]
];

module.exports = api_reference;