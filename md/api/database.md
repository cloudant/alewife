Database Methods
================

The Database methods provide an interface to an entire database within
Cloudant. These are database level rather than document level requests.

A list of the available methods and URL paths are provided below:

  ------------------------------------------------------------------------
  Meth Path      Description
  od             
  ---- --------- ---------------------------------------------------------
  GET  /\_all\_d Returns a list of all databases
       bs        

  GET  /db       Returns database information

  PUT  /db       Create a new database

  DELE /db       Delete an existing database
  TE             

  GET  /db/\_all Returns a built-in view of all documents in this database
       \_docs    

  POST /db/\_all Returns certain rows from the built-in view of all
       \_docs    documents

  POST /db/\_bul Insert multiple documents in to the database in a single
       k\_docs   request

  GET  /db/\_cha Returns changes for the given database
       nges      

  POST /db/\_mis Given a list of document revisions, returns the document
       sing\_rev revisions that do not exist in the database
       s         

  POST /db/\_rev Given a list of document revisions, returns differences
       s\_diff   between the given revisions and ones that are in the
                 database

  GET  /db/\_rev Gets the limit of historical revisions to store for a
       s\_limit  single document in the database

  PUT  /db/\_rev Sets the limit of historical revisions to store for a
       s\_limit  single document in the database

  GET  /db/\_sec Returns the special security object for the database
       urity     

  PUT  /db/\_sec Sets the special security object for the database
       urity     

  POST /db/\_vie Removes view files that are not used by any design
       w\_cleanu document
       p         
  ------------------------------------------------------------------------

Retrieving a list of all databases
----------------------------------

-   **Method**: `GET /_all_dbs`
-   **Request**: None
-   **Response**: JSON list of DBs
-   **Roles permitted**: \_reader

### Return Codes

  Code    Description
  ------- --------------------------------
  200     Request completed successfully

Returns a list of all the databases. For example:

~~~~ {.sourceCode .http}
GET http://username.cloudant.com/_all_dbs
Accept: application/json
~~~~

The return is a JSON array:

~~~~ {.sourceCode .javascript}
[
   "_users",
   "contacts",
   "docs",
   "invoices",
   "locations"
]
~~~~

Operations on entire databases
------------------------------

For all the database methods, the database name within the URL path
should be the database name that you wish to perform the operation on.
For example, to obtain the meta information for the database `recipes`,
you would use the HTTP request:

~~~~ {.sourceCode .http}
GET /recipes
~~~~

For clarity, the form below is used in the URL paths:

~~~~ {.sourceCode .http}
GET /db
~~~~

Where `db` is the name of any database.

### Retrieving information about a database

-   **Method**: `GET /db`
-   **Request**: None
-   **Response**: Information about the database in JSON format
-   **roles permitted**: \_reader, \_admin

#### Return Codes

  ------------------------------------------------------------------------
  Code Description
  ---- -------------------------------------------------------------------
  200  The database exists and information about it is returned.

  404  The database could not be found. If further information is
       available, it will be returned as a JSON object.
  ------------------------------------------------------------------------

Gets information about the specified database. For example, to retrieve
the information for the database `recipe`:

The JSON response contains meta information about the database. A sample
of the JSON returned for an empty database is provided below:

The elements of the returned structure are shown in the table below:

  ------------------------------------------------------------------------
  Field       Description
  ----------- ------------------------------------------------------------
  compact\_ru Set to true if the database compaction routine is operating
  nning       on this database.

  db\_name    The name of the database.

  disk\_forma The version of the physical format used for the data when it
  t\_version  is stored on disk.

  disk\_size  Size in bytes of the data as stored on the disk. Views
              indexes are not included in the calculation.

  doc\_count  A count of the documents in the specified database.

  doc\_del\_c Number of deleted documents
  ount        

  instance\_s Always 0.
  tart\_time  

  purge\_seq  The number of purge operations on the database.

  update\_seq An opaque string describing the state of the database. It
              should not be relied on for counting the number of updates.

  other       Json object containing a data\_size field.
  ------------------------------------------------------------------------

### Creating a database

-   **Method**: `PUT /db`
-   **Request**: None
-   **Response**: JSON success statement
-   **roles permitted**: \_admin

  ------------------------------------------------------------------------
  Code Description
  ---- -------------------------------------------------------------------
  201  Database created successfully

  202  The database has been successfully created on some nodes, but the
       number of nodes is less than the write quorum.

  403  Invalid database name.

  412  Database aleady exists.
  ------------------------------------------------------------------------

Creates a new database. The database name must be composed of one or
more of the following characters:

-   Lowercase characters (`a-z`)

-   Name must begin with a lowercase letter

-   Digits (`0-9`)

-   Any of the characters `_`, `$`, `(`, `)`, `+`, `-`, and `/`.

Trying to create a database that does not meet these requirements will
return an error quoting these restrictions.

To create the database `recipes`:

The returned content contains the JSON status:

Anything else should be treated as an error, and the problem should be
taken from the HTTP response code.

### Deleting a database

-   **Method**: `DELETE /db`
-   **Request**: None
-   **Response**: JSON success statement
-   **roles permitted**: \_admin

#### Return Codes

  ------------------------------------------------------------------------
  Code Description
  ---- -------------------------------------------------------------------
  200  Database has been deleted

  404  The database could not be found. If further information is
       available, it will be returned as a JSON object.
  ------------------------------------------------------------------------

Deletes the specified database, and all the documents and attachments
contained within it.

To delete the database `recipes` you would send the request:

If successful, the returned JSON will indicate success

Retrieving multiple documents in one request
--------------------------------------------

### `GET /db/_all_docs`

-   **Method**: `GET /db/_all_docs`
-   **Request**: None
-   **Response**: JSON object containing document information, ordered
    by the document ID
-   **roles permitted**: \_reader

#### Query Arguments

  ------------------------------------------------------------------------
  Argument    Description                               Option Type  Defau
                                                        al           lt
  ----------- ----------------------------------------- ------ ----- -----
  `descending Return the documents in descending by key yes    boole false
  `           order                                            an    

  `endkey`    Stop returning records when the specified yes    strin 
              key is reached                                   g     

  `include_do Include the full content of the documents yes    boole false
  cs`         in the return                                    an    

  `inclusive_ Include rows whose key equals the endkey  yes    boole true
  end`                                                         an    

  `key`       Return only documents that match the      yes    strin 
              specified key                                    g     

  `limit`     Limit the number of the returned          yes    numer 
              documents to the specified number                ic    

  `skip`      Skip this number of records before        yes    numer 0
              starting to return the results                   ic    

  `startkey`  Return records starting with the          yes    strin 
              specified key                                    g     
  ------------------------------------------------------------------------

Returns a JSON structure of all of the documents in a given database.
The information is returned as a JSON structure containing meta
information about the return structure, and the list documents and basic
contents, consisting the ID, revision and key. The key is generated from
the document ID.

  Field        Description                                Type
  ------------ ------------------------------------------ ----------
  offset       Offset where the document list started     numeric
  rows         Array of document object                   array
  total\_rows  Number of documents in the database/view   numeric
  update\_seq  Current update sequence for the database   string

By default the information returned contains only the document ID and
revision. For example, the request:

Returns the following structure:

The information is returned in the form of a temporary view of all the
database documents, with the returned key consisting of the ID of the
document. The remainder of the interface is therefore identical to the
View query arguments and their behavior.

### `POST /db/_all_docs`

-   **Method**: `POST /db/_all_docs`
-   **Request**: JSON of the document IDs you want included
-   **Response**: JSON of the returned view
-   **roles permitted**: \_admin, \_reader

The `POST` to `_all_docs` allows to specify multiple keys to be selected
from the database. This enables you to request multiple documents in a
single request, in place of multiple api-get-doc requests.

The request body should contain a list of the keys to be returned as an
array to a `keys` object. For example:

~~~~ {.sourceCode .http}
POST /recipes/_all_docs
User-Agent: MyApp/0.1 libwww-perl/5.837

{
   "keys" : [
      "Zingylemontart",
      "Yogurtraita"
   ]
}
~~~~

The return JSON is the all documents structure, but with only the
selected keys in the output:

~~~~ {.sourceCode .javascript}
{
   "total_rows" : 2666,
   "rows" : [
      {
         "value" : {
            "rev" : "1-a3544d296de19e6f5b932ea77d886942"
         },
         "id" : "Zingylemontart",
         "key" : "Zingylemontart"
      },
      {
         "value" : {
            "rev" : "1-91635098bfe7d40197a1b98d7ee085fc"
         },
         "id" : "Yogurtraita",
         "key" : "Yogurtraita"
      }
   ],
   "offset" : 0
}
~~~~

Creating or updating multiple documents
---------------------------------------

-   **Method**: `POST /db/_bulk_docs`
-   **Request**: JSON of the docs and updates to be applied
-   **Response**: JSON success statement
-   **roles permitted**: \_admin, \_writer

### Return Codes

  ------------------------------------------------------------------------
  Code  Description
  ----- ------------------------------------------------------------------
  201   All documents have been created or updated

  202   Some documents have been created or updated, some updates have
        resulted in conflicts

  409   All updates have resulted in conflicts
  ------------------------------------------------------------------------

The bulk document API allows you to create and update multiple documents
at the same time within a single request. The basic operation is similar
to creating or updating a single document, except that you batch the
document structure and information. When creating new documents the
document ID is optional. For updating existing documents, you must
provide the document ID, revision information, and new document values.

For both inserts and updates the basic structure of the JSON document in
the request is the same:

### Request Body

  Field       Description               Type                Optional
  ----------- ------------------------- ------------------- -----------
  `docs`      Bulk Documents Document   array of objects    no

### Object in `docs` array

  ------------------------------------------------------------------------
  Field      Description                   Type    Optional
  ---------- ----------------------------- ------- -----------------------
  `_id`      Document ID                   string  yes, but mandatory for
                                                   updates

  `_rev`     Document revision             string  yes, but mandatory for
                                                   updates

  `_deleted` Whether the document should   boolean yes
             be deleted                            
  ------------------------------------------------------------------------

### Inserting Documents in Bulk

To insert documents in bulk into a database you need to supply a JSON
structure with the array of documents that you want to add to the
database. Using this method you can either include a document ID, or
allow the document ID to be automatically generated.

For example, the following inserts three new documents with the supplied
document IDs. If you omit the document ID, it will be generated:

The return type from a bulk insertion will be 201, with the content of
the returned structure indicating specific success or otherwise messages
on a per-document basis.

The return structure from the example above contains a list of the
documents created, here with the combination and their revision IDs:

The content and structure of the returned JSON will depend on the
transaction semantics being used for the bulk update; see bulk-semantics
for more information. Conflicts and validation errors when updating
documents in bulk must be handled separately; see bulk-validation.

#### Updating Documents in Bulk

The bulk document update procedure is similar to the insertion
procedure, except that you must specify the document ID and current
revision for every document in the bulk update JSON string.

For example, you could send the following request:

The return structure is the JSON of the updated documents, with the new
revision and ID information:

You can optionally delete documents during a bulk update by adding the
`_deleted` field with a value of `true` to each document ID/revision
combination within the submitted JSON structure.

The return type from a bulk insertion will be 201, with the content of
the returned structure indicating specific success or otherwise messages
on a per-document basis.

The content and structure of the returned JSON will depend on the
transaction semantics being used for the bulk update; see bulk-semantics
for more information. Conflicts and validation errors when updating
documents in bulk must be handled separately; see bulk-validation.

#### Bulk Documents Transaction Semantics

> Cloudant will only guarantee that some of the documents will be saved
> if your request yields a 202 response. The response will contain the
> list of documents successfully inserted or updated during the process.
>
> The response structure will indicate whether the document was updated
> by supplying the new `_rev` parameter indicating a new document
> revision was created. If the update failed, then you will get an
> `error` of type `conflict`. For example:
>
> ~~~~ {.sourceCode .javascript}
> [
>    {
>       "id" : "FishStew",
>       "error" : "conflict",
>       "reason" : "Document update conflict."
>    },
>    {
>       "id" : "LambStew",
>       "error" : "conflict",
>       "reason" : "Document update conflict."
>    },
>    {
>       "id" : "7f7638c86173eb440b8890839ff35433",
>       "error" : "conflict",
>       "reason" : "Document update conflict."
>    }
> ]
> ~~~~
>
> In this case no new revision has been created and you will need to
> submit the document update with the correct revision tag, to update
> the document.

#### Bulk Document Validation and Conflict Errors

The JSON returned by the `_bulk_docs` operation consists of an array of
JSON structures, one for each document in the original submission. The
returned JSON structure should be examined to ensure that all of the
documents submitted in the original request were successfully added to
the database.

The exact structure of the returned information is:

  Field           Description               Type
  --------------- ------------------------- -------------------
  docs [array]    Bulk Documents Document   array of objects

##### Fields of objects in docs array

  Field     Description                          Type
  --------- ------------------------------------ ---------
  id        Document ID                          string
  error     Error type                           string
  reason    Error string with extended reason    string

When a document (or document revision) is not correctly committed to the
database because of an error, you should check the `error` field to
determine error type and course of action. Errors will be one of the
following type:

-   `conflict`

    The document as submitted is in conflict. If you used the default
    bulk transaction mode then the new revision will not have been
    created and you will need to re-submit the document to the database.

    Conflict resolution of documents added using the bulk docs interface
    is identical to the resolution procedures used when resolving
    conflict errors during replication.

-   `forbidden`

    Entries with this error type indicate that the validation routine
    applied to the document during submission has returned an error.

    For example, if your validation routine includes the following:

    ~~~~ {.sourceCode .javascript}
    throw({forbidden: 'invalid recipe ingredient'});
    ~~~~

    The error returned will be:

    ~~~~ {.sourceCode .javascript}
    {
       "id" : "7f7638c86173eb440b8890839ff35433",
       "error" : "forbidden",
       "reason" : "invalid recipe ingredient"
    }
    ~~~~

Obtaining a list of changes
---------------------------

-   **Method**: `GET /db/_changes`
-   **Request**: None
-   **Response**: JSON success statement
-   **Roles permitted**: \_admin, \_reader

### Query Arguments

  -------------------------------------------------------------------------
  Arg Description                             Op Typ D Supported Values
  ume                                         ti e   e 
  nt                                          on     f 
                                              al     a 
                                                     u 
                                                     l 
                                                     t 
  --- --------------------------------------- -- --- - --------------------
  `do List of documents IDs to use to filter  ye arr   
  c_i updates                                 s  ay    
  ds`                                            of    
                                                 str   
                                                 ing   
                                                 s     

  `fe Type of feed                            ye str n `continuous`:
  ed`                                         s  ing o Continuous
                                                     r (non-polling) mode,
                                                     m `longpoll`: Long
                                                     a polling mode,
                                                     l `normal`: Normal
                                                       mode

  `fi Name of filter function from a design   ye str   
  lte document to get updates                 s  ing   
  r`                                                   

  `he Time in milliseconds after which an     ye num 6 
  art empty line is sent during longpoll or   s  eri 0 
  bea continuous if there have been no           c   0 
  t`  changes                                        0 
                                                     0 

  `in Include the document with the result    ye boo f 
  clu                                         s  lea a 
  de_                                            n   l 
  doc                                                s 
  s`                                                 e 

  `li Maximum number of rows to return        ye num n 
  mit                                         s  eri o 
  `                                              c   n 
                                                     e 

  `si Start the results from changes          ye num 0 
  nce immediately after the specified         s  eri   
  `   sequence number. If `since` is 0 (the      c     
      default), the request will return all            
      changes from the creation of the                 
      database.                                        

  `de Return the changes in descending (by    ye boo f 
  sce `seq`) order                            s  lea a 
  ndi                                            n   l 
  ng`                                                s 
                                                     e 

  `ti Number of milliseconds to wait for data ye num   
  meo in a `longpoll` or `continuous` feed    s  eri   
  ut` before terminating the response. If        c     
      both `heartbeat` and `timeout` are               
      suppled, `heartbeat` supersedes                  
      `timeout`.                                       
  -------------------------------------------------------------------------

Obtains a list of the changes made to the database. This can be used to
monitor for update and modifications to the database for post processing
or synchronization. The \_changes feed is not guaranteed to return
changes in the correct order. There are three different types of
supported changes feeds, poll, longpoll, and continuous. All requests
are poll requests by default. You can select any feed type explicitly
using the `feed` query argument.

-   **Poll**

    With polling you can request the changes that have occured since a
    specific sequence number. This returns the JSON structure containing
    the changed document information. When you perform a poll change
    request, only the changes since the specific sequence number are
    returned. For example, the query

    ~~~~ {.sourceCode .http}
    GET /recipes/_changes
    Content-Type: application/json
    ~~~~

    Will get all of the changes in the database. You can request a
    starting point using the `since` query argument and specifying the
    sequence number. You will need to record the latest sequence number
    in your client and then use this when making another request as the
    new value to the `since` parameter.

-   **Longpoll**

    With long polling the request to the server will remain open until a
    change is made on the database, when the changes will be reported,
    and then the connection will close. The long poll is useful when you
    want to monitor for changes for a specific purpose without wanting
    to monitoring continuously for changes.

    Because the wait for a change can be significant you can set a
    timeout before the connection is automatically closed (the `timeout`
    argument). You can also set a heartbeat interval (using the
    `heartbeat` query argument), which sends a newline to keep the
    connection open.

-   **Continuous**

    Continuous sends all new changes back to the client immediately,
    without closing the connection. In continuous mode the format of the
    changes is slightly different to accommodate the continuous nature
    while ensuring that the JSON output is still valid for each change
    notification.

    As with the longpoll feed type you can set both the timeout and
    heartbeat intervals to ensure that the connection is kept open for
    new changes and updates.

The return structure for `normal` and `longpoll` modes is a JSON array
of changes objects, and the last update sequence number. The structure
is described in the following table.

  Field      Description                                          Type
  ---------- ---------------------------------------------------- --------
  last\_seq  Last change sequence number.                         string
  results    Changes made to a database                           array
  changes    List of changes, field-by-field, for this document   array
  id         Document ID                                          string
  seq        Update sequence number                               string

In `continuous` mode, the server sends a `CRLF` (carriage-return,
linefeed) delimited line for each change. Each line contains the [JSON
object](#table-couchdb-api-db_db-json-changes).

You can also request the full contents of each document change (instead
of just the change notification) by using the `include_docs` parameter.

### Filtering

You can filter the contents of the changes feed in a number of ways. The
most basic way is to specify one or more document IDs to the query. This
causes the returned structure value to only contain changes for the
specified IDs. Note that the value of this query argument should be a
JSON formatted array.

You can also filter the `_changes` feed by defining a filter function
within a design document. The specification for the filter is the same
as for replication filters. You specify the name of the filter function
to the `filter` parameter, specifying the design document name and
filter name. For example:

~~~~ {.sourceCode .http}
GET /db/_changes?filter=design_doc/filtername
~~~~

The `_changes` feed can be used to watch changes to specific document
ID's or the list of `_design` documents in a database. If the `filters`
parameter is set to `_doc_ids` a list of doc IDs can be passed in the
`doc_ids` parameter as a JSON array.

Cleaning up cached view output
------------------------------

-   **Method**: `POST /db/_view_cleanup`
-   **Request**: None
-   **Response**: JSON success statement
-   **Roles permitted**: \_admin

Cleans up the cached view output on disk for a given view. For example:

~~~~ {.sourceCode .http}
POST /recipes/_view_cleanup
Content-Type: application/json
~~~~

If the request is successful, a basic status message us returned:

~~~~ {.sourceCode .javascript}
{
   "ok" : true
}
~~~~

Retrieving missing revisions
----------------------------

-   **Method**: `POST /db/_missing_revs`
-   **Request**: JSON list of document revisions
-   **Response**: JSON of missing revisions

Retrieving differences between revisions
----------------------------------------

-   **Method**: `POST /db/_revs_diff`
-   **Request**: JSON list of document revisions
-   **Response**: JSON list of differences from supplied
    document/revision list

The database security document
------------------------------

### Retrieving the security document

-   **Method**: `GET /db/_security`
-   **Request**: None
-   **Response**: JSON of the security object

Gets the current security object from the specified database. The
security object consists of two compulsory elements, `admins` and
`readers`, which are used to specify the list of users and/or roles that
have admin and reader rights to the database respectively. Any
additional fields in the security object are optional. The entire
security object is made available to validation and other internal
functions so that the database can control and limit functionality.

To get the existing security object you would send the following
request:

~~~~ {.sourceCode .javascript}
{
   "admins" : {
      "roles" : [],
      "names" : [
         "mc",
         "slp"
      ]
   },
   "readers" : {
      "roles" : [],
      "names" : [
         "tim",
         "brian"
      ]
   }
}
~~~~

Security object structure is:

-   **admins**: Roles/Users with admin privileges

    -   **roles** [array]: List of roles with parent privilege
    -   **users** [array]: List of users with parent privilege

-   **readers**: Roles/Users with reader privileges

    -   **roles** [array]: List of roles with parent privilege
    -   **users** [array]: List of users with parent privilege

> **note**
>
> If the security object for a database has never been set, then the
> value returned will be empty.

### Creating or updating the security document

-   **Method**: `PUT /db/_security`
-   **Request**: JSON specifying the admin and user security for the
    database
-   **Response**: JSON status message

Sets the security object for the given database. For example, to set the
security object for the `recipes` database:

~~~~ {.sourceCode .javascript}
PUT http://username.cloudant.com/recipes/_security
Content-Type: application/json

{
   "admins" : {
      "roles" : [],
      "names" : [
         "mc",
         "slp"
      ]
   },
   "readers" : {
      "roles" : [],
      "names" : [
         "tim",
         "brian"
      ]
   }
}
~~~~

If the setting was successful, a JSON status object will be returned:

~~~~ {.sourceCode .javascript}
{
   "ok" : true
}
~~~~

The revisions limit
-------------------

### Retrieving the revisions limit

-   **Method**: `GET /db/_revs_limit`
-   **Request**: None
-   **Response**: The current revision limit setting
-   **Roles permitted**: \_admin, \_reader

Gets the current `revs_limit` (revision limit) setting.

For example to get the current limit:

~~~~ {.sourceCode .http}
GET /recipes/_revs_limit
Content-Type: application/json
~~~~

The returned information is the current setting as a numerical scalar:

~~~~ {.sourceCode .javascript}
1000
~~~~

### Setting the revisions limit

-   **Method**: `PUT /db/_revs_limit`
-   **Request**: A scalar integer of the revision limit setting
-   **Response**: Confirmation of setting of the revision limit
-   **Roles permitted**: \_admin, \_writer

Sets the maximum number of document revisions that will be tracked even
after compaction has occurred. You can set the revision limit on a
database by using `PUT` with a scalar integer of the limit that you want
to set as the request body.

For example to set the revs limit to 100 for the `recipes` database:

~~~~ {.sourceCode .http}
PUT /recipes/_revs_limit
Content-Type: application/json

100
~~~~

If the setting was successful, a JSON status object will be returned:

~~~~ {.sourceCode .javascript}
{
   "ok" : true
}
~~~~
