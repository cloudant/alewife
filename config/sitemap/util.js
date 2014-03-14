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
  // 'Ruby',
  // 'Node.js',
  'JavaScript',
  // 'PHP',
  // 'Java',
  // 'Android',
  // 'Objective-C'
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

module.exports = {
  add_languages: add_languages,
  add_methods: add_methods,
  add_crud: add_methods.bind(null, CRUD),
  add_query: add_methods.bind(null, Query)
};