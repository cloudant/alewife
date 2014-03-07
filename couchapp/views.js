module.exports = {
  languages: {
    map: function (doc) {
      if (doc.text) {
        if (!doc._id.match(/index\.md/)) {
          var language = doc._id.slice(doc._id.lastIndexOf('/') + 1).replace('.md','');
          emit(language, null);
        }
      }
    },
    reduce: '_count'
  },
  docs: {
    map: function (doc) {
      if (doc.text) {
        var id = doc._id.replace(/(\/index)?\.md/g, '');
        emit(id, null);
      }
    }
  }
};