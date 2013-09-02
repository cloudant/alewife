# Writing documents

Documents can be inserted into Cloudant individually or in bulk. We'll
look at bulk inserts a little later, for now let's just insert a single
document.

<form action="#" class="async">
  <div class="control-group" id="newdoc-grp">
    <h3>
      <span class="label label-important">API DEMO</span>
    </h3>
    <p>This JSON document is ready to inserted into your sample database. It's editable, too. Just make sure you don't invalidate the JSON.</p>
    <label class="control-label" for="newdoc">JSON document</label>
    <div class="controls">
      <textarea id="newdoc" class="input-xxlarge" rows="4">{
"season": "summer",
"weather": "usually warm and sunny"
}</textarea>
    </div>
  </div>

  <p class="showifloggedindbtrue">The response from the server will appear directly below.</p>
  <p class="hideifloggedin"><a href="/sign-in/">Sign in</a> or <a href="/sign-up/">create a free account</a> to insert this document via the Cloudant API.</p>
  <p class="showifloggedindbfalse">To demo the API here, <a href="#">replicate the sample database</a> first.</p>

  <button type="submit" id="insert" class="btn insert disabled" rel="tooltip" title="Sign in to demo the Cloudant API.">Insert Doc</button>

  <div id="insert-info" class="url-response"></div>

</form>

<p class="quote">Every document in Cloudant is accessible as JSON via a URL; this is
one of the features that makes it so powerful for web applications.</p>

To retrieve documents you need to know their `_id`. The document inserted above
doesn't define an `_id` value, so it got assigned one on insert.

You can always define an `_id` for your document up front. You need to make
sure that the `_id` isn't already in use. If it is, the insert will fail. Try
changing the JSON above and adding in an `_id`. (For example, change `season` to
`_id`).

Now try inserting the document again with the same `_id`. You should see a
conflict error in the response.

<div class="async">
  <h3>Example insert error</h3>
  <pre class="prettyprint">{"error":"conflict","reason":"Document update conflict."}</pre>
  <p>When a problem like this arises, the server will set an appropriate HTTP error code in the response header and return a JSON document describing the problem.</p>
</div>

<h3>Code examples</h3>
<div class="tabbable">
  <ul class="nav nav-tabs">
    <li class="active"><a href="#browser-read" data-toggle="tab">Via the browser</a></li>
    <li><a href="#curl-read" data-toggle="tab">Via <code>CURL</code></a></li>
  </ul>
  <div class="tab-content">
    <div class="tab-pane active" id="browser-read">
      <p>In the widget above, we sent the document from the browser using
      <code>jquery</code> and the <code>jquery.couch.js</code> library.
      The relevant part of the browser code is below.</p>

      <pre class="prettyprint "><!-- lang-javascript -->// Parse the json from the text area
var doc = $.parseJSON($('#newdoc').val());
// "connect" to the database
var db = $.couch.db(user_db);
// insert the doc into the db
db.saveDoc(doc, {
  success: function(response, textStatus, jqXHR){
    // do something if the save works
  },
  error: function(jqXHR, textStatus, errorThrown){
    //do something else if it goes wrong
  }
})</pre>

      <p>As we saw in the insert above, on <em>success</em> you'll get a JSON reponse containing the
      <code>id</code>, <code>rev</code> and <code>ok:true</code>. Note
      that the underscores are removed from <code>_id</code> and
      <code>_rev</code> in the response.</p>

      <p>If an error is raised the <code>jqXHR</code> will contain the error
      code the server responds with, and the response body is parsed so that
      the <code>textStatus</code> will have the value of <code>error</code>
      and <code>errorThrown</code> will be the contents of
      <code>reason</code>.</p>

      <p>For more complicated applications you might want to hook up
      Backbone, AngularJS or some other favourite application framework.
      Most already have a CouchDB connector, and for those that don't
      they are usually simple to build.</p>
    </div>
    <div class="tab-pane" id="curl-read">
      <p>The following curl calls should do the same thing as the
      browser example and hopefully show whats going on "under the hood"
      in more detail.</p>

      <h3>Insert via CURL</h3>

      <dl>
        <dt>Command</dt>
        <dd>
          <pre class="prettyprint">curl -d '{"season": "summer", "weather": "usually warm and sunny"}' -X POST https://[username].cloudant.com/crud/ -H "Content-Type:application/json"</pre>
        </dd>
        <dt>Response</dt>
        <dd>
          <pre class="prettyprint">{"ok":true,"id":"590e2bca76c09882e37dea534b000be3","rev":"1-0af5e64fe24d262db237b9f14046f490"}</pre>
        </dd>
      </dl>

      <p>If you want to set the <code>_id</code> when you insert, you can do it in two
      ways: <code>POST</code> and <code>PUT</code>.</p>


      <h3>Set the <code>_id</code> via POST</h3>

      <p><code>POST</code> the document with the <code>_id</code> in the document body:</p>

      <dl>
        <dt>Command</dt>
        <dd>
          <pre class="prettyprint">curl -d '{"season": "summer", "weather": "usually warm and sunny", "_id":"foo"}' -X POST https://[username].cloudant.com/crud/ -H "Content-Type:application/json"</pre>
        </dd>
        <dt>Response</dt>
        <dd>
          <pre class="prettyprint">{"ok":true,"id":"foo","rev":"1-0af5e64fe24d262db237b9f14046f490"}</pre>
        </dd>
      </dl>


      <h3>Set the <code>_id</code> via PUT</h3>

      <p>Or <code>PUT</code> the document, specifying the
      <code>_id</code> in the URL:</p>

      <dl>
        <dt>Command</dt>
        <dd>
          <pre class="prettyprint">curl -d '{"season": "summer", "weather": "usually warm and sunny"}' -X PUT https://[username].cloudant.com/crud/bar -H "Content-Type:application/json"</pre>
        </dd>
        <dt>Response</dt>
        <dd>
          <pre class="prettyprint">{"ok":true,"id":"bar","rev":"1-0af5e64fe24d262db237b9f14046f490"}</pre>
        </dd>
      </dl>
    </div>
  </div>
</div>