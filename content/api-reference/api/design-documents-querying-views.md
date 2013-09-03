Retrieving information about a design document
==============================================

-   **Method**: `GET /db/_design/design-doc/_info`
-   **Request**: None
-   **Response**: JSON of the design document information
-   **Roles permitted**: \_reader

Obtains information about a given design document, including the index,
index size and current status of the design document and associated
index information.

For example, to get the information for the `recipes` design document:

~~~~ {.sourceCode .http}
GET /recipes/_design/recipes/_info
Content-Type: application/json
~~~~

This returns the following JSON structure:

~~~~ {.sourceCode .javascript}
{
   "name" : "recipes"
   "view_index" : {
      "compact_running" : false,
      "updater_running" : false,
      "language" : "javascript",
      "purge_seq" : 10,
      "waiting_commit" : false,
      "waiting_clients" : 0,
      "signature" : "fc65594ee76087a3b8c726caf5b40687",
      "update_seq" : 375031,
      "disk_size" : 16491
   },
}
~~~~

The individual fields in the returned JSON structure are detailed below:

-   **name**: Name/ID of Design Document
-   **view\_index**: View Index

    -   **compact\_running**: Indicates whether a compaction routine is
        currently running on the view
    -   **disk\_size**: Size in bytes of the view as stored on disk
    -   **language**: Language for the defined views
    -   **purge\_seq**: The purge sequence that has been processed
    -   **signature**: MD5 signature of the views for the design
        document
    -   **update\_seq**: The update sequence of the corresponding
        database that has been indexed
    -   **updater\_running**: Indicates if the view is currently being
        updated
    -   **waiting\_clients**: Number of clients waiting on views from
        this design document
    -   **waiting\_commit**: Indicates if there are outstanding commits
        to the underlying database that need to processed

Querying a view
===============

-   **Method**: `GET /db/_design/design-doc/_view/view-name`
-   **Request**: None
-   **Response**: JSON of the documents returned by the view
-   **Roles permitted**: \_reader

Query Arguments
---------------

  -------------------------------------------------------------------------
  Arg Decription                                O Typ D Supported Values
  ume                                           p e   e 
  nt                                            t     f 
                                                i     a 
                                                o     u 
                                                n     l 
                                                a     t 
                                                l       
  --- ----------------------------------------- - --- - -------------------
  `de Return the documents in descending by key y boo f 
  sce order                                     e lea a 
  ndi                                           s n   l 
  ng`                                                 s 
                                                      e 

  `en Stop returning records when the specified y str   
  dke key is reached                            e ing   
  y`                                            s or    
                                                  JSO   
                                                  N     
                                                  arr   
                                                  ay    

  `en Stop returning records when the specified y str   
  dke document ID is reached                    e ing   
  y_d                                           s       
  oci                                                   
  d`                                                    

  `gr Group the results using the reduce        y boo f 
  oup function to a group or single row         e lea a 
  `                                             s n   l 
                                                      s 
                                                      e 

  `gr Only applicable if the view uses complex  y num   
  oup keys, i.e. keys that are JSON arrays.     e eri   
  _le Groups reduce results for the specified   s c     
  vel number of array fields.                           
  `                                                     

  `in Include the full content of the documents y boo f 
  clu in the response                           e lea a 
  de_                                           s n   l 
  doc                                                 s 
  s`                                                  e 

  `in included rows with the specified endkey   y boo t 
  clu                                           e lea r 
  siv                                           s n   u 
  e_e                                                 e 
  nd`                                                   

  `ke Return only documents that match the      y str   
  y`  specified key. Note that keys are JSON    e ing   
      values and must be URL-encoded.           s       

  `li Limit the number of the returned          y num   
  mit documents to the specified number         e eri   
  `                                             s c     

  `re Use the reduce function                   y boo t 
  duc                                           e lea r 
  e`                                            s n   u 
                                                      e 

  `sk Skip this number of rows from the start   y num 0 
  ip`                                           e eri   
                                                s c     

  `st Allow the results from a stale view to be y str f `ok`: Allow stale
  ale used. This makes the request return       e ing a views,
  `   immediately, even if the view has not     s     l `update_after`:
      been completely built yet. If this              s Allow stale views,
      parameter is not given, a response will         e but update them
      be returned only after the view has been          immediately after
      built.                                            the request

  `st Return records starting with the          y str   
  art specified key                             e ing   
  key                                           s or    
  `                                               JSO   
                                                  N     
                                                  arr   
                                                  ay    

  `st Return records starting with the          y str   
  art specified document ID                     e ing   
  key                                           s       
  _do                                                   
  cid                                                   
  `                                                     

  `up Include the update sequence in the        y boo f 
  dat generated results                         e lea a 
  e_s                                           s n   l 
  eq`                                                 s 
                                                      e 
  -------------------------------------------------------------------------

Executes the specified `view-name` from the specified `design-doc`
design document.

Querying Views and Indexes
--------------------------

The definition of a view within a design document also creates an index
based on the key information defined within each view. The production
and use of the index significantly increases the speed of access and
searching or selecting documents from the view.

However, the index is not updated when new documents are added or
modified in the database. Instead, the index is generated or updated,
either when the view is first accessed, or when the view is accessed
after a document has been updated. In each case, the index is updated
before the view query is executed against the database.

View indexes are updated incrementally in the following situations:

-   A new document has been added to the database.

-   A document has been deleted from the database.

-   A document in the database has been updated.

View indexes are rebuilt entirely when the view definition changes. To
achieve this, a 'fingerprint' of the view definition is created when the
design document is updated. If the fingerprint changes, then the view
indexes are entirely rebuilt. This ensures that changes to the view
definitions are reflected in the view indexes.

> **note**
>
> View index rebuilds occur when one view from the same view group (i.e.
> all the views defined within a single design document) needs to be
> rebuilt. For example, if you have a design document with three views,
> and you update the document, all three view indexes within the design
> document will be rebuilt.

Because the view is updated when it has been queried, it can result in a
delay in returned information when the view is accessed, especially if
there are a large number of documents in the database and the view index
does not exist. There are a number of ways to mitigate, but not
completely eliminate, these issues. These include:

-   Create the view definition (and associated design documents) on your
    database before allowing insertion or updates to the documents. If
    this is allowed while the view is being accessed, the index can be
    updated incrementally.

-   Manually force a view request from the database. You can do this
    either before users are allowed to use the view, or you can access
    the view manually after documents are added or updated.

-   Use the `/db/_changes` method to monitor for changes to the database
    and then access the view to force the corresponding view index to be
    updated. See api-changes for more information.

None of these can completely eliminate the need for the indexes to be
rebuilt or updated when the view is accessed, but they may lessen the
effects on end-users of the index update affecting the user experience.

Another alternative is to allow users to access a 'stale' version of the
view index, rather than forcing the index to be updated and displaying
the updated results. Using a stale view may not return the latest
information, but will return the results of the view query using an
existing version of the index.

For example, to access the existing stale view `by_recipe` in the
`recipes` design document:

~~~~ {.sourceCode .text}
/recipes/_design/recipes/_view/by_recipe?stale=ok
~~~~

Accessing a stale view:

-   Does not trigger a rebuild of the view indexes, even if there have
    been changes since the last access.

-   Returns the current version of the view index, if a current version
    exists.

-   Returns an empty result set if the given view index does exist.

As an alternative, you use the `update_after` value to the `stale`
parameter. This causes the view to be returned as a stale view, but for
the update process to be triggered after the view information has been
returned to the client.

In addition to using stale views, you can also make use of the
`update_seq` query argument. Using this query argument generates the
view information including the update sequence of the database from
which the view was generated. The returned value can be compared to the
current update sequence exposed in the database information (returned by
api-get-db).

Sorting Returned Rows
---------------------

Each element within the returned array is sorted using native UTF-8
sorting according to the contents of the key portion of the emitted
content. The basic order of output is as follows:

-   `null`

-   `false`

-   `true`

-   Numbers

-   Text (case sensitive, lowercase first)

-   Arrays (according to the values of each element, in order)

-   Objects (according to the values of keys, in key order)

You can reverse the order of the returned view information by using the
`descending` query value set to true. For example, Retrieving the list
of recipes using the `by_title` (limited to 5 records) view:

~~~~ {.sourceCode .javascript}
{
   "offset" : 0,
   "rows" : [
      {
         "id" : "3-tiersalmonspinachandavocadoterrine",
         "key" : "3-tier salmon, spinach and avocado terrine",
         "value" : [
            null,
            "3-tier salmon, spinach and avocado terrine"
         ]
      },
      {
         "id" : "Aberffrawcake",
         "key" : "Aberffraw cake",
         "value" : [
            null,
            "Aberffraw cake"
         ]
      },
      {
         "id" : "Adukiandorangecasserole-microwave",
         "key" : "Aduki and orange casserole - microwave",
         "value" : [
            null,
            "Aduki and orange casserole - microwave"
         ]
      },
      {
         "id" : "Aioli-garlicmayonnaise",
         "key" : "Aioli - garlic mayonnaise",
         "value" : [
            null,
            "Aioli - garlic mayonnaise"
         ]
      },
      {
         "id" : "Alabamapeanutchicken",
         "key" : "Alabama peanut chicken",
         "value" : [
            null,
            "Alabama peanut chicken"
         ]
      }
   ],
   "total_rows" : 2667
}
~~~~

Requesting the same in descending order will reverse the entire view
content. For example the request

~~~~ {.sourceCode .http}
GET /recipes/_design/recipes/_view/by_title?limit=5&descending=true
Accept: application/json
Content-Type: application/json
~~~~

Returns the last 5 records from the view:

~~~~ {.sourceCode .javascript}
{
   "offset" : 0,
   "rows" : [
      {
         "id" : "Zucchiniinagrodolcesweet-sourcourgettes",
         "key" : "Zucchini in agrodolce (sweet-sour courgettes)",
         "value" : [
            null,
            "Zucchini in agrodolce (sweet-sour courgettes)"
         ]
      },
      {
         "id" : "Zingylemontart",
         "key" : "Zingy lemon tart",
         "value" : [
            null,
            "Zingy lemon tart"
         ]
      },
      {
         "id" : "Zestyseafoodavocado",
         "key" : "Zesty seafood avocado",
         "value" : [
            null,
            "Zesty seafood avocado"
         ]
      },
      {
         "id" : "Zabaglione",
         "key" : "Zabaglione",
         "value" : [
            null,
            "Zabaglione"
         ]
      },
      {
         "id" : "Yogurtraita",
         "key" : "Yogurt raita",
         "value" : [
            null,
            "Yogurt raita"
         ]
      }
   ],
   "total_rows" : 2667
}
~~~~

The sorting direction is applied before the filtering is applied using
the `startkey` and `endkey` query arguments. For example the following
query:

~~~~ {.sourceCode .http}
GET /recipes/_design/recipes/_view/by_ingredient?startkey=%22carrots%22&endkey=%22egg%22
Accept: application/json
Content-Type: application/json
~~~~

Will operate correctly when listing all the matching entries between
“carrots” and `egg`. If the order of output is reversed with the
`descending` query argument, the view request will return no entries:

~~~~ {.sourceCode .http}
GET /recipes/_design/recipes/_view/by_ingredient?descending=true&startkey=%22carrots%22&endkey=%22egg%22
Accept: application/json
Content-Type: application/json
~~~~

The returned result is empty:

~~~~ {.sourceCode .javascript}
{
   "total_rows" : 26453,
   "rows" : [],
   "offset" : 21882
}
~~~~

The results will be empty because the entries in the view are reversed
before the key filter is applied, and therefore the `endkey` of “egg”
will be seen before the `startkey` of “carrots”, resulting in an empty
list.

Instead, you should reverse the values supplied to the `startkey` and
`endkey` parameters to match the descending sorting applied to the keys.
Changing the previous example to:

~~~~ {.sourceCode .http}
GET /recipes/_design/recipes/_view/by_ingredient?descending=true&startkey=%22egg%22&endkey=%22carrots%22
Accept: application/json
Content-Type: application/json
~~~~

Specifying Start and End Values
-------------------------------

The `startkey` and `endkey` query arguments can be used to specify the
range of values to be displayed when querying the view.

Querying a view using a list of keys
====================================

-   **Method**: `POST /db/_design/design-doc/_view/view-name`
-   **Request**: List of keys to be returned from specified view
-   **Response**: JSON of the documents returned by the view
-   **Roles permitted**: \_reader

Query Arguments
---------------

  ---------------------------------------------------------------------------
  Argu Decription                       Op Type  De Supported Values
  ment                                  ti       fa 
                                        on       ul 
                                        al       t  
  ---- -------------------------------- -- ----- -- -------------------------
  `des Return the documents in          ye boole fa 
  cend descending by key order          s  an    ls 
  ing`                                           e  

  `end Stop returning records when the  ye strin    
  key` specified key is reached         s  g        
                                           or       
                                           JSON     
                                           array    

  `end Stop returning records when the  ye strin    
  key_ specified document ID is reached s  g        
  doci                                              
  d`                                                

  `gro Group the results using the      ye boole fa 
  up`  reduce function to a group or    s  an    ls 
       single row                                e  

  `gro Only applicable if the view uses ye numer    
  up_l complex keys, i.e. keys that are s  ic       
  evel JSON arrays. Groups reduce                   
  `    results for the specified number             
       of array fields.                             

  `inc Include the full content of the  ye boole fa 
  lude documents in the response        s  an    ls 
  _doc                                           e  
  s`                                                

  `inc included rows with the specified ye boole tr 
  lusi endkey                           s  an    ue 
  ve_e                                              
  nd`                                               

  `key Return only documents that match ye strin    
  `    the specified key. Note that     s  g        
       keys are JSON values and must be             
       URL-encoded.                                 

  `lim Limit the number of the returned ye numer    
  it`  documents to the specified       s  ic       
       number                                       

  `red Use the reduce function          ye boole tr 
  uce`                                  s  an    ue 

  `ski Skip this number of rows from    ye numer 0  
  p`   the start                        s  ic       

  `sta Allow the results from a stale   ye strin fa `ok`: Allow stale views,
  le`  view to be used. This makes the  s  g     ls `update_after`: Allow
       request return immediately, even          e  stale views, but update
       if the view has not been                     them immediately after
       completely built yet.                        the request

  `sta Return records starting with the ye strin    
  rtke specified key                    s  g        
  y`                                       or       
                                           JSON     
                                           array    

  `sta Return records starting with the ye strin    
  rtke specified document ID            s  g        
  y_do                                              
  cid`                                              

  `upd Include the update sequence in   ye boole fa 
  ate_ the generated results            s  an    ls 
  seq`                                           e  
  ---------------------------------------------------------------------------

Executes the specified `view-name` from the specified `design-doc`
design document. Unlike the `GET` method for accessing views, the `POST`
method supports the specification of explicit keys to be retrieved from
the view results. The remainder of the `POST` view functionality is
identical to the api-get-view API.

For example, the request below will return all the recipes where the key
for the view matches either “claret” or “clear apple cider” :

~~~~ {.sourceCode .http}
POST /recipes/_design/recipes/_view/by_ingredient
Content-Type: application/json

{
   "keys" : [
      "claret",
      "clear apple juice"
   ]
}
~~~~

The returned view data contains the standard view information, but only
where the keys match.

~~~~ {.sourceCode .javascript}
{
   "total_rows" : 26484,
   "rows" : [
      {
         "value" : [
            "Scotch collops"
         ],
         "id" : "Scotchcollops",
         "key" : "claret"
      },
      {
         "value" : [
            "Stand pie"
         ],
         "id" : "Standpie",
         "key" : "clear apple juice"
      }
   ],
   "offset" : 6324
}
~~~~

Multi-document Fetching
-----------------------

By combining the `POST` method to a given view with the
`include_docs=true` query argument you can obtain multiple documents
from a database. The result is more efficient than using multiple
api-get-doc requests.

For example, sending the following request for ingredients matching
“claret” and “clear apple juice”:

~~~~ {.sourceCode .http}
POST /recipes/_design/recipes/_view/by_ingredient?include_docs=true
Content-Type: application/json

{
   "keys" : [
      "claret",
      "clear apple juice"
   ]
}
~~~~

Returns the full document for each recipe:

~~~~ {.sourceCode .javascript}
{
   "offset" : 6324,
   "rows" : [
      {
         "doc" : {
            "_id" : "Scotchcollops",
            "_rev" : "1-bcbdf724f8544c89697a1cbc4b9f0178",
            "cooktime" : "8",
            "ingredients" : [
               {
                  "ingredient" : "onion",
                  "ingredtext" : "onion, peeled and chopped",
                  "meastext" : "1"
               },
            ...
            ],
            "keywords" : [
               "cook method.hob, oven, grill@hob",
               "diet@wheat-free",
               "diet@peanut-free",
               "special collections@classic recipe",
               "cuisine@british traditional",
               "diet@corn-free",
               "diet@citrus-free",
               "special collections@very easy",
               "diet@shellfish-free",
               "main ingredient@meat",
               "occasion@christmas",
               "meal type@main",
               "diet@egg-free",
               "diet@gluten-free"
            ],
            "preptime" : "10",
            "servings" : "4",
            "subtitle" : "This recipe comes from an old recipe book of 1683 called 'The Gentlewoman's Kitchen'. This is an excellent way of making a rich and full-flavoured meat dish in a very short time.",
            "title" : "Scotch collops",
            "totaltime" : "18"
         },
         "id" : "Scotchcollops",
         "key" : "claret",
         "value" : [
            "Scotch collops"
         ]
      },
      {
         "doc" : {
            "_id" : "Standpie",
            "_rev" : "1-bff6edf3ca2474a243023f2dad432a5a",
            "cooktime" : "92",
            "ingredients" : [
...            ],
            "keywords" : [
               "diet@dairy-free",
               "diet@peanut-free",
               "special collections@classic recipe",
               "cuisine@british traditional",
               "diet@corn-free",
               "diet@citrus-free",
               "occasion@buffet party",
               "diet@shellfish-free",
               "occasion@picnic",
               "special collections@lunchbox",
               "main ingredient@meat",
               "convenience@serve with salad for complete meal",
               "meal type@main",
               "cook method.hob, oven, grill@hob / oven",
               "diet@cow dairy-free"
            ],
            "preptime" : "30",
            "servings" : "6",
            "subtitle" : "Serve this pie with pickled vegetables and potato salad.",
            "title" : "Stand pie",
            "totaltime" : "437"
         },
         "id" : "Standpie",
         "key" : "clear apple juice",
         "value" : [
            "Stand pie"
         ]
      }
   ],
   "total_rows" : 26484
}
~~~~

Sending several queries to a view
=================================

-   **Method**: `POST /db/_design/design-doc/_view/view-name`
-   **Request**: A JSON document containing an array of query objects
-   **Response**: A JSON document containing an array of response object
    - one per query
-   **Roles permitted**: \_reader

This in an example of a request body:

The JSON object contains only the `queries` field, which holds an array
of query objects. Each query object can have fields for the parameters
of a query. The field names and their meaning are the same as the query
parameters of a regular view request.

Here is an example of a response:

The JSON object contains only the `results` field, which holds an array
of result objects - one for each query. Each result object contains the
same fields as the response to a regular view request.
