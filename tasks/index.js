var scaffold = require('./scaffold');
var upload = require('./upload');
var show = require('./show');

var tasks = {
  scaffold: scaffold.main,
  upload: upload.all,
  upload_docs: upload.docs,
  upload_sitemap: upload.sitemap,
  show: show.pprint,
  show_flat: show.flat
};

var cmd = process.argv[2];
if (tasks[cmd]) {
  tasks[cmd](function (err) {
    if (err) {
      throw err;
    }
  }); 
} else {
  throw '' + cmd + ' is not a recognized command :(';
}