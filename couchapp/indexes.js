module.exports = {
  docs: {
    index: function (doc) {
      if (doc.text) {
        index('default', doc.text);
      }
    }
  }
};