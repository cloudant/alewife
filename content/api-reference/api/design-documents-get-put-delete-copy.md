Retrieving a design document
============================

Since design documents are just ordinary documents, there is nothing
special about retrieving them. The URL path used for design documents is
`/db/_design/design-doc`, where `design-doc` is the name of the design
document and `db` is the name of the database.

See api-get-doc for information about retrieving documents.

Creating or updating a design document
======================================

-   **Method**: `PUT /db/_design/design-doc`
-   **Request**: JSON of the design document
-   **Response**: JSON status
-   **Roles permitted**: \_writer

Upload the specified design document, `design-doc`, to the specified
database. Design documents are ordinary documents defining views and
indexers in the format summarised in the following table.

-   **\_id**: Design Document ID
-   **\_rev**: Design Document Revision
-   **views (optional)**: View

    -   **viewname** (one for each view): View Definition

        -   **map**: Map Function for the view
        -   **reduce (optional)**: Reduce Function for the view
        -   **dbcopy (optional)**: Database name to store view results
            in

-   **indexes (optional)**: Indexes

    -   **index name** (one for each index): Index definition

        -   **analyzer**: Name of the analyzer to be used or an object
            with the following fields:

            -   **name**: Name of the analyzer
            -   **stopwords (optional)**: An array of stop words. Stop
                words are words that should not be indexed. If this
                array is specified, it overrides the default list of
                stop words. The default list of stop words depends on
                the analyzer. The list of stop words for the standard
                analyzer is: "a", "an", "and", "are", "as", "at", "be",
                "but", "by", "for", "if", "in", "into", "is", "it",
                "no", "not", "of", "on", "or", "such", "that", "the",
                "their", "then", "there", "these", "they", "this", "to",
                "was", "will", "with".

        -   **index**: Function that handles the indexing

-   **shows (optional)**: Show functions

    -   **function name** (one for each function): Function definition

-   **lists (optional)**: List functions

    -   **function name** (one for each function): Function definition

General notes on functions in design documents
----------------------------------------------

Functions in design documents are run on multiple nodes for each
document and might be run several times. To avoid inconsistencies, they
need to be idempotent, meaning they need to behave identically when run
multiple times and/or on different nodes. In particular, you should
avoid using functions that generate random numbers or return the current
time.

Map functions
-------------

The function contained in the map field is a Javascript function that is
called for each document in the database. The map function takes the
document as an argument and optionally calls the `emit` function one or
more times to emit pairs of keys and values. The simplest example of a
map function is this:

~~~~ {.sourceCode .javascript}
function(doc) {
  emit(doc._id, doc);
}
~~~~

The result will be that the view contains every document with the key
being the id of the document, effectively creating a copy of the
database.

Reduce functions
----------------

If a view has a reduce function, it is used to produce aggregate results
for that view. A reduce function is passed a set of intermediate values
and combines them to a single value. Reduce functions must accept, as
input, results emitted by its corresponding map function '''as well as
results returned by the reduce function itself'''. The latter case is
referred to as a ''rereduce''.

Here is an example of a reduce function:

~~~~ {.sourceCode .javascript}
function (key, values, rereduce) {
  return sum(values);
}
~~~~

Reduce functions are passed three arguments in the order ''key'',
''values'', and ''rereduce''.

Reduce functions must handle two cases:

1.  When `rereduce` is false:

> -   `key` will be an array whose elements are arrays of the form
>     `[key,id]`, where `key` is a key emitted by the map function and
>     ''id'' is that of the document from which the key was generated.
> -   `values` will be an array of the values emitted for the respective
>     elements in `keys`
> -   i.e.
>     `reduce([ [key1,id1], [key2,id2], [key3,id3] ], [value1,value2,value3], false)`

2.  When `rereduce` is true:

> -   `key` will be `null`.
> -   `values` will be an array of values returned by previous calls to
>     the reduce function.
> -   i.e.
>     `reduce(null, [intermediate1,intermediate2,intermediate3], true)`\`

Reduce functions should return a single value, suitable for both the
''value'' field of the final view and as a member of the ''values''
array passed to the reduce function.

Often, reduce functions can be written to handle rereduce calls without
any extra code, like the summation function above. In that case, the
''rereduce'' argument can be ignored.

### Built-in reduce functions

For performance reasons, a few simple reduce functions are built in. To
use one of the built-in functions, put its name into the `reduce` field
of the view object in your design document.

  ------------------------------------------------------------------------
  Function Description
  -------- ---------------------------------------------------------------
  `_sum`   Produces the sum of all values for a key, values must be
           numeric

  `_count` Produces the row count for a given key, values can be any valid
           json

  `_stats` Produces a json structure containing sum, count, min, max and
           sum squared, values must be numeric
  ------------------------------------------------------------------------

Dbcopy
------

If the `dbcopy` field of a view is set, the view contents will be
written to a database of that name. If `dbcopy` is set, the view must
also have a reduce function. For every key/value pair created by a
reduce query with `group` set to `true`, a document will be created in
the dbcopy database. If the database does not exist, it will be created.
The documents created have the following fields:

  ------------------------------------------------------------------------
  Field         Description
  ------------- ----------------------------------------------------------
  `key`         The key of the view result. This can be a string or an
                array.

  `value`       The value calculated by the reduce function.

  `_id`         The ID is a hash of the key.

  `salt`        This value is an implementation detail used internally.

  `partials`    This value is an implementation detail used internally.
  ------------------------------------------------------------------------

For more information on writing views, see views.

Index functions
---------------

The function contained in the index field is a Javascript function that
is called for each document in the database. It takes the document as a
parameter, extracts some data from it and then calls the `index` method
to index that data. The `index` method take 3 parameters, where the
third parameter is optional. The first parameter is the name of the
index. If the special value `"default"` is used, the data is stored in
the default index, which is queried if no index name is specified in the
search. The second parameter is the data to be indexed. The third
parameter is an object that can contain the fields `store` and `index`.
If the `store` field contains the value `yes`, the value will be
returned in search results, otherwise, it will only be indexed. The
`index` field can have the following values describing whether and how
the data is indexed:

-   `analyzed`: Index the tokens produced by running the field's value
    through an analyzer.
-   `analyzed_no_norms`: Index the tokens produced by running the
    field's value through an analyzer, and also separately disable the
    storing of norms.
-   `no`: Do not index the field value.
-   `not_analyzed`: Index the field's value without using an analyzer,
    so it can be searched.
-   `not_analyzed_no_norms`: Index the field's value without an
    analyzer, and also disable the indexing of norms.

Here is an example of a simple index function.

~~~~ {.sourceCode .javascript}
function(doc) {
  if (doc.foo) {
    index("default", doc.foo);
  }
}
~~~~

For more information on indexing and searching, see lucene-search.

Show functions
--------------

Show function can be used to render a document in a different format or
extract only some information from a larger document. Some show
functions don't deal with documents at all and just return information
about the user making the request or other request parameters. Show
functions take two arguments: The document identified by the `doc-id`
part of the URL (if specified) and an object describing the HTTP
request. The return value of a show function is either a string
containing any data to be returned in the HTTP response or a Javascript
object with fields for the headers and the body of the HTTP response.

### Example of a simple show function

~~~~ {.sourceCode .javascript}
function(doc, req) {
    return '<person name="' + doc.name + '" birthday="' + doc.birthday  + '" />';
}
~~~~

### The request object

The request object passed to the show function describes the http
request and has the following fields:

-   **info**: An object containing information about the database.
-   **id**: ID of the object being shown or null if there is no object.
-   **method**: The HTTP method used, e.g. `GET`.
-   **path**: An array of strings describing the path of the request
    URL.
-   **query**: An object that contains a field for each query parameter.
-   **headers**: An object that contains a field for each header of the
    HTTP request.
-   **peer**: The IP address making the request.
-   **cookie**: An object that contains a field for each cookie
    submitted with the HTTP request.
-   **body**: The body of the HTTP request.
-   **form**: An object containing a field for each form field of the
    request, if the request has the `x-www-form-urlencoded` content
    type.
-   **userCtx**: An object describing the identity and permissions of
    the user making the request.

> -   **db**: database name
> -   **name**: user name
> -   **roles**: An array of strings for each role the user has, e.g.
>     `["_admin", "_reader", "_writer"]`

Here is an example for a request object:

~~~~ {.sourceCode .javascript}
{
  "info": {
"update_seq": "31-g1AAAADneJzLYWBgYMlgTmFQSElKzi9KdUhJMtbLTS3KLElMT9VLzskvTUnMK9HLSy3JAapkSmRIsv___39WIjOqHnM8epIcgGRSPTZt-KzKYwGSDA1ACqhzf1YiB_E2QrQegGgF2iqYBQBxlE1l",
"db_name": "dbname",
"purge_seq": 0,
"other": {
  "data_size": 209
},
"doc_del_count": 0,
"doc_count": 2,
"disk_size": 1368408,
"disk_format_version": 5,
"compact_running": false,
"instance_start_time": "0"
  },
  "uuid": "d2b979d10234eaedc505a090968a4e7e",
  "id": "74b2be56045bed0c8c9d24b939000dbe",
  "method": "GET",
  "path": [
"dbname",
"_design",
"designdocname",
"_show",
"showfunctionname",
"74b2be56045bed0c8c9d24b939000dbe"
  ],
  "query": {
"foo": "bar"
  },
  "headers": {
"Accept": "text\/html,application\/xhtml+xml,application\/xml;q=0.9,*\/*;q=0.8",
"Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.3",
"Accept-Encoding": "gzip,deflate,sdch",
"Accept-Language": "en-US,en;q=0.8,de-DE;q=0.6,de;q=0.4",
"Connection": "close",
"Host": "username.cloudant.com",
"User-Agent": "Mozilla\/5.0 (X11; Linux x86_64) AppleWebKit\/537.22 (KHTML, like Gecko) Ubuntu Chromium\/25.0.1364.160 Chrome\/25.0.1364.160 Safari\/537.22",
"X-Forwarded-For": "109.69.82.183"
  },
  "body": "undefined",
  "peer": "109.69.82.183",
  "form": {
  },
  "cookie": {
"foo": "bar"
  },
  "userCtx": {
"db": "dbname",
"name": "username",
"roles": [
  "_admin",
  "_reader",
  "_writer"
]
  }
}
~~~~

### Return values

Show functions can either return a string or an object with the headers
and body of the HTTP response. The object returned should have the
following fields:

-   **body**: A String containing the body of the HTTP response
-   **headers**: An object with fields for each HTTP header of the
    response

### Example show function returning a response object

~~~~ {.sourceCode .javascript}
function(doc, req) {
    return {
        body: ('<h1>' + req.query.header + '</h1>' +
               '<ul><li>' + doc.first + '</li>' +
                   '<li>' + doc.second + '</li></ul>'),
        headers: { 'Content-Type': 'text/html' }
    };
}
~~~~

List functions
--------------

List functions are a lot like show functions, but instead of taking just
one object as their input, they are applied to all data returned from a
view. Like the name suggests, they can be used to create lists of
objects in various formats (xml, html, csv).

List functions take two parameters: The first one is usually called
`head` and contains information about the number of rows returned from
the view. The second parameter is identical to the request parameter
described under request-object.

### Head parameter

The first parameter to a list function contains the following fields:

-   **total\_rows**: Total number of rows
-   **offset**: Number of rows skipped due to skip query parameter.

### Available functions

There are three functions available for use in list functions.

The `start` function is used to set the HTTP status code and the header
information to be sent in the HTTP response. It can be used as follows:

~~~~ {.sourceCode .javascript}
start({code: 200, headers: {"content-type": "text/html"}});
~~~~

The `send` function is used to send content in the body of the response.

~~~~ {.sourceCode .javascript}
send('hello');
send('bye');
~~~~

The `get_row` function returns the next row from the view data or null
if there are no more rows. The object returned has the following fields:

-   **id**: The ID of the document associated with this row.
-   **key**: The key emitted by the view.
-   **value**: The data emitted by the view.

This is an example of a row object returned by `get_row`.

~~~~ {.sourceCode .javascript}
{
  "id": "de698c77-b38f-44af-9d89-455de7310b58",
  "key": 0,
  "value": {
    "_id": "de698c77-b38f-44af-9d89-455de7310b58",
    "_rev": "1-ad1680946839206b088da5d9ac01e4ef",
    "foo": 0,
    "bar": "foo"
  }
}
~~~~

### Example list function

This example function created an unordered HTML list from the `foo`
fields of the view values.

~~~~ {.sourceCode .javascript}
function(head, req, third, fourth, fifth) {
    start({code: 200, headers: {"Content-Type": "text/html"}});
    var row;
    send("<ul>");
    while (row = getRow()) {
        send("<li>" + row.value.foo + "</li>");
        }
    send("</ul>");
}
~~~~

Rewrite rules
-------------

A design document can contain rules for URL rewriting as an array in the
`rewrites` field. Requests that match the rewrite rules must have a URL
path that starts with `/db/_design/doc/_rewrite`.

~~~~ {.sourceCode .javascript}
"rewrites": [
  {
    "from": "/",
    "to": "index.html",
    "method": "GET",
    "query": {}
  },{
    "from": "/foo/:var",
    "to": "/foo",
    "method": "GET",
    "query": {"v": "var"}
  }
]
~~~~

Each rule is a JSON object with 4 fields.

  ------------------------------------------------------------------------
  **F **Description**
  iel 
  d** 
  --- --------------------------------------------------------------------
  `fr A path relative to `/db/_design/doc/_rewrite` used to match URLs to
  om` rewrite rules. Path elements that start with a `:` are treated as
      variables and match any string that does not contain a `/`. A `*`
      can only appear at the end of the string and matches any string -
      including slashes.

  `to The path (relative to `/db/_design/doc/` and not including the query
  `   part of the URL) that will be the result of the rewriting step.
      Variables captured in `from` can be used in `to`. `*` can also be
      used and will contain everything captured by the pattern in `from`.

  `me The HTTP method that should be matched on.
  tho 
  d`  

  `qu The query part of the resulting URL. This is a JSON object
  ery containing the key/value pairs of the query.
  `   
  ------------------------------------------------------------------------

### Examples

  -------------------------------------------------------------------------
  Rule                           Url                Rewrite to        Token
                                                                      s
  ------------------------------ ------------------ ----------------- -----
  `{"from": "/a/b", "to": "/some `/db/_design/doc/_ `/db/_design/doc/ k = v
  /"}`                           rewrite/a/b?k=v`   some/k=v`         

  `{"from": "/a/b", "to": "/some `/db/_design/doc/_ `/db/_design/doc/ var =
  /:var"}`                       rewrite/a/b`       some/b?var=b`     b

  `{"from": "/a", "to": "/some/* `/db/_design/doc/_ `/db/_design/doc/ 
  "}`                            rewrite/a`         some`             

  `{"from": "/a/*", "to": "/some `/db/_design/doc/_ `/db/_design/doc/ 
  /*}`                           rewrite/a/b/c`     some/b/c`         

  `{"from": "/a", "to": "/some/* `/db/_design/doc/_ `/db/_design/doc/ 
  "}`                            rewrite/a`         some`             

  `{"from": "/a/:foo/*","to": "/ `/db/_design/doc/_ `/db/_design/doc/ foo =
  some/:foo/*"}`                 rewrite/a/b/c`     some/b/c?foo=b`   b

  `{"from": "/a/:foo", "to": "/s `/db/_design/doc/_ `/db/_design/doc/ foo
  ome", "query": { "k": ":foo" } rewrite/a/b`       some/?k=b&foo=b`  =:= b
  }`                                                                  

  `{"from": "/a", "to": "/some/: `/db/_design/doc/_ `/db/_design/doc/ foo =
  foo" }`                        rewrite/a?foo=b`   some/b&foo=b`     b
  -------------------------------------------------------------------------

Deleting a design document
==========================

-   **Method**: `DELETE /db/_design/design-doc`
-   **Request**: None
-   **Response**: JSON of deleted design document
-   **Roles permitted**: \_writer

Query Arguments
---------------

  -------------------------------------------------------------------------
  Argument  Description                                 Optional  Type
  --------- ------------------------------------------- --------- ---------
  `rev`     Current revision of the document for        yes       string
            validation                                            
  -------------------------------------------------------------------------

HTTP Headers
------------

  Header         Description                                     Optional
  -------------- ----------------------------------------------- ----------
  `If-Match`     Current revision of the document for validation yes

Delete an existing design document. Deleting a design document also
deletes all of the associated view indexes, and recovers the
corresponding space on disk for the indexes in question.

To delete, you must specify the current revision of the design document
using the `rev` query argument.

For example:

~~~~ {.sourceCode .http}
DELETE /recipes/_design/recipes?rev=2-ac58d589b37d01c00f45a4418c5a15a8
Content-Type: application/json
~~~~

The response contains the delete document ID and revision:

~~~~ {.sourceCode .javascript}
{
   "id" : "recipe/_design/recipes"
   "ok" : true,
   "rev" : "3-7a05370bff53186cb5d403f861aca154",
}
~~~~

Copying a design document
=========================

-   **Method**: `COPY /db/_design/design-doc`
-   **Request**: None
-   **Response**: JSON of the new document and revision
-   **Roles permitted**: \_writer
-   **Query Arguments**:

    -   **Argument**: rev

        -   **Description**: Revision to copy from
        -   **Optional**: yes
        -   **Type**: string

-   **HTTP Headers**

    -   **Header**: `Destination`

        -   **Description**: Destination document (and optional
            revision)
        -   **Optional**: no

The `COPY` command (non-standard HTTP) copies an existing design
document to a new or existing document.

The source design document is specified on the request line, with the
`Destination` HTTP Header of the request specifying the target document.

Copying a Design Document
-------------------------

To copy the latest version of a design document to a new document you
specify the base document and target document:

~~~~ {.sourceCode .http}
COPY /recipes/_design/recipes
Content-Type: application/json
Destination: /recipes/_design/recipelist
~~~~

The above request copies the design document `recipes` to the new design
document `recipelist`. The response is the ID and revision of the new
document.

~~~~ {.sourceCode .javascript}
{
   "id" : "recipes/_design/recipelist"
   "rev" : "1-9c65296036141e575d32ba9c034dd3ee",
}
~~~~

> **note**
>
> Copying a design document does not automatically reconstruct the view
> indexes. These will be recreated, as with other views, the first time
> the new view is accessed.

Copying from a Specific Revision
--------------------------------

To copy *from* a specific version, add the `rev` argument to the query
string:

~~~~ {.sourceCode .http}
COPY /recipes/_design/recipes?rev=1-e23b9e942c19e9fb10ff1fde2e50e0f5
Content-Type: application/json
Destination: recipes/_design/recipelist
~~~~

The new design document will be created using the specified revision of
the source document.

Copying to an Existing Design Document
--------------------------------------

To copy to an existing document, you must specify the current revision
string for the target document, using the `rev` parameter to the
`Destination` HTTP Header string. For example:

~~~~ {.sourceCode .http}
COPY /recipes/_design/recipes
Content-Type: application/json
Destination: recipes/_design/recipelist?rev=1-9c65296036141e575d32ba9c034dd3ee
~~~~

The return value will be the new revision of the copied document:

~~~~ {.sourceCode .javascript}
{
   "id" : "recipes/_design/recipes"
   "rev" : "2-55b6a1b251902a2c249b667dab1c6692",
}
~~~~
