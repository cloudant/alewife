// load sitemap, language list, and docs
function load_resources (done) {
  async.map([
    '_rewrite/_show/flatten/sitemap',
    '_rewrite/docs/sitemap',
    '_rewrite/_list/objectify/docs?include_docs=true'
  ], function (url, done) {
    $.getJSON(url, function (data) {
      done(null, data);
    });
  }, function (err, res) {
    if (err) {
      done(err);
    } else {
      done(null, {
        // format sitemap
        sitemap: res[0],
        // format language
        languages: res[1].languages,
        // the list function did our work :D
        docs: res[2]
      });
    }
  });
}

// render templates
function render_templates (data, done) {
  var md = new Showdown.converter();
  var templates = {
    languages: $('[data-template-name="languages"]').html(),
    sitemap: $('[data-template-name="sitemap"]').html()
  };

  // populate sitemap, language nav
  Object.keys(templates).forEach(function (key) {
    var template = Handlebars.compile(templates[key]);
    var result = template(data);

    $('#' + key).html(result);
  });

  // indicate current language
  var language = location.search.slice(1) || data.languages[0];
  $('[data-language-name="' + language + '"]').addClass('active');

  // populate doc text
  Object.keys(data.docs).forEach(function (key) {
    var markdown = data.docs[key].text;
    var name = key.slice(key.lastIndexOf('/') + 1) || key;
    var result = md.makeHtml(markdown);

    $('[data-content-id="' + key + '"] [data-content-text]').html(result);
    if (language === name) {
      var id = key.slice(0, key.indexOf(name) - 1);
      var elem = $('[data-content-id="' + id + '"] [data-content-code]');
      elem.html(result);
    }
  });

  // build ToC
  var toc = $('#toc').tocify({
    selectors: 'h1, h2, h3, h4, h5, h6',
    hashGenerator: function (text, elem) {
      return elem.attr('data-unique');
    }
  }).data("toc-tocify");
  // css in my javascript? oh down the rabbit hole we go D:
  $('ul.tocify-header, ul.tocify-subheader').addClass('indent');

  done();
}

$(function () {
  async.waterfall([
    load_resources,
    render_templates
  ], function () {
    console.log(arguments);
  });
});
