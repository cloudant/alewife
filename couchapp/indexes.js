module.exports = {
  docs: {
    index: function (doc) {
      if (doc.text) {
        for (var key in doc) {
          if (key !== '_rev') index('default', doc[key]);
        }
      }
    }
  }
};