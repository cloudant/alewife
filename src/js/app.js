var app = {};

app.PagePath = '';
app.md = new Showdown.converter();

app.Page = Backbone.Model.extend({
  idAttribute: 'key'
});

app.Pages = Backbone.Collection.extend({
  model: app.Page,
  url: '/pages',
  parse: function(res){
    var results = res.rows.map(function(row){
      // switch `id` to `_id`
      row._id = row.id;
      row.value.text = app.md.makeHtml(row.value.text);
      delete row.id;
      return row;
    });
    return results;
  }
});

app.NavItem = Backbone.View.extend({
  tagName: 'li',
  className: function(){
    var _this = this;
    var depth = this.model.id.split('/').filter(function(part){
      return !!part;
    }).length;
    return 'depth-' + depth;
  },
  template: _.template($('#nav-item-template').html()),
  render: function(){
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});

app.Nav = Backbone.View.extend({
  el: '#nav',
  render: function(){
    var _this = this;
    this.collection.each(function(model){
      var view = new app.NavItem({model: model});
      _this.$el.append(view.render().el);
    });
    return this;
  }
});

app.Current = Backbone.View.extend({
  el: '#page',
  template: _.template($('#current-page-template').html()),
  render: function(path){
    var _this = this;
    var model = this.collection.get(path || '');
    if(model){
      this.$el.html(this.template(model.toJSON()));
    }else{
      console.error('404: ' + path);
    }
    return this;
  }
});

app.Router = Backbone.Router.extend({
  routes: {
    '*page': 'getPage'
  },
  initialize: function(opts){
    var nav = new app.Nav({
          collection: opts.collection
        }),
        current = new app.Current({
          collection: opts.collection
        });

    nav.render();
    current.render();

    this.nav = nav;
    this.current = current;
  },
  getPage: function(page){
    this.current.render(page);
  }
});

$(function(){
  var pages = new app.Pages({});

  pages.fetch({
    success: function(){
      var router = new app.Router({
        collection: pages
      });
  
      Backbone.history.start({pushState: true});
    }
  });
});