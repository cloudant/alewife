Document Methods
================

The document methods can be used to create, read, update and delete
documents within a database.

A list of the available methods and URL paths is provided below:

  ------------------------------------------------------------------------
  Method Path            Description
  ------ --------------- -------------------------------------------------
  POST   /db             Create a new document

  GET    /db/doc         Returns the latest revision of the document

  HEAD   /db/doc         Returns bare information in the HTTP Headers for
                         the document

  PUT    /db/doc         Inserts a new document, or new version of an
                         existing document

  DELETE /db/doc         Deletes the document

  COPY   /db/doc         Copies the document

  GET    /db/doc/attachm Gets the attachment of a document
         ent             

  PUT    /db/doc/attachm Adds an attachment of a document
         ent             

  DELETE /db/doc/attachm Deletes an attachment of a document
         ent             
  ------------------------------------------------------------------------

CRUD operations on documents
----------------------------

### Creating a new document

-   **Method**: `POST /db`
-   **Request**: JSON of the new document
-   **Response**: JSON with the committed document information
-   **Roles permitted**: \_writer

#### Query Arguments

  -------------------------------------------------------------------------
  Argumen Description                         Option Type  Supported Values
  t                                           al           
  ------- ----------------------------------- ------ ----- ----------------
  `batch` Allow document store request to be  yes    strin `ok`: enable
          batched with others                        g     batching
  -------------------------------------------------------------------------

#### Return Codes

  ------------------------------------------------------------------------
  Code   Description
  ------ -----------------------------------------------------------------
  201    Document has been created successfully

  409    Conflict - a document with the specified document ID already
         exists
  ------------------------------------------------------------------------

#### Response Headers

  Field       Description
  ----------- --------------------------------------------------------
  `ETAG`      Revision of the document, Same as the `_rev` field.

Create a new document in the specified database, using the supplied JSON
document structure. If the JSON structure includes the `_id` field, then
the document will be created with the specified document ID. If the
`_id` field is not specified, a new unique ID will be generated.

For example, you can generate a new document with a generated UUID using
the following request:

~~~~ {.sourceCode .http}
POST /recipes/
Content-Type: application/json

{
   "servings" : 4,
   "subtitle" : "Delicious with fresh bread",
   "title" : "Fish Stew"
}
~~~~

The returned JSON will specify the automatically generated ID and
revision information:

~~~~ {.sourceCode .javascript}
{
   "id" : "64575eef70ab90a2b8d55fc09e00440d",
   "ok" : true,
   "rev" : "1-9c65296036141e575d32ba9c034dd3ee"
}
~~~~

The document id is guaranteed to be unique per database.

#### Specifying the Document ID

The document ID can be specified by including the `_id` field in the
JSON of the submitted record. The following request will create the same
document with the ID `FishStew`:

~~~~ {.sourceCode .http}
POST /recipes/
Content-Type: application/json

{
   "_id" : "FishStew",
   "servings" : 4,
   "subtitle" : "Delicious with fresh bread",
   "title" : "Fish Stew"
}
~~~~

The structure of the submitted document is as shown in the table below:

In either case, the returned JSON will specify the document ID, revision
ID, and status message:

~~~~ {.sourceCode .javascript}
{
   "id" : "FishStew",
   "ok" : true,
   "rev" : "1-9c65296036141e575d32ba9c034dd3ee"
}
~~~~

If a document with the given id already exists, a `409 conflict`
response will be returned.

#### Batch Mode Writes

You can write documents to the database at a higher rate by using the
batch option. This collects document writes together in memory (on a
user-by-user basis) before they are committed to disk. This increases
the risk of the documents not being stored in the event of a failure,
since the documents are not written to disk immediately.

To use the batched mode, append the `batch=ok` query argument to the URL
of the `PUT` or `POST` request. The server will respond with a 202 HTTP
response code immediately.

#### Including Attachments

You can include one or more attachments with a given document by
incorporating the attachment information within the JSON of the
document. This provides a simpler alternative to loading documents with
attachments than making a separate call (see api-put-attachment).

-   **\_id** (optional): Document ID
-   **\_rev** (optional): Revision ID (when updating an existing
    document)
-   **\_attachments** (optional): Document Attachment

    -   **filename**: Attachment information

        -   **content\_type**: MIME Content type string
        -   **data**: File attachment content, Base64 encoded

The `filename` will be the attachment name. For example, when sending
the JSON structure below:

~~~~ {.sourceCode .javascript}
{
   "_id" : "FishStew",
   "servings" : 4,
   "subtitle" : "Delicious with fresh bread",
   "title" : "Fish Stew"
   "_attachments" : {
      "styling.css" : {
         "content-type" : "text/css",
         "data" : "cCB7IGZvbnQtc2l6ZTogMTJwdDsgfQo=",
         },
   },
}
~~~~

The attachment `styling.css` can be accessed using
`/recipes/FishStew/styling.css`. For more information on attachments,
see api-get-attachment.

The document data embedded into the structure must be encoded using
base64.

### Retrieving a document

-   **Method**: `GET /db/doc`
-   **Request**: None
-   **Response**: Returns the JSON for the document
-   **Roles permitted**: \_reader

#### Query Arguments

  --------------------------------------------------------------------------
  Argumen Description                    Optio Type Defa Supported Values
  t                                      nal        ult  
  ------- ------------------------------ ----- ---- ---- -------------------
  `confli Returns the conflict tree for  yes   bool fals `true`: Includes
  cts`    the document.                        ean  e    conflicting
                                                         revisions

  `rev`   Specify the revision to return yes   stri      
                                               ng        

  `revs`  Return a list of the revisions yes   bool      
          for the document                     ean       

  `revs_i Return a list of detailed      yes   bool fals `true`: Includes
  nfo`    revision information for the         ean  e    the revisions
          document                                       
  --------------------------------------------------------------------------

#### Return Codes

  ------------------------------------------------------------------------
  Code   Description
  ------ -----------------------------------------------------------------
  200    Document retrieved

  400    The format of the request or revision was invalid

  404    The specified document or revision cannot be found, or has been
         deleted
  ------------------------------------------------------------------------

Returns the specified `doc` from the specified `db`. For example, to
retrieve the document with the id `DocID` you would send the following
request:

The returned JSON is the JSON of the document, including the document ID
and revision number:

Unless you request a specific revision, the latest revision of the
document will always be returned.

#### Attachments

If the document includes attachments, then the returned structure will
contain a summary of the attachments associated with the document, but
not the attachment data itself.

The JSON for the returned document will include the `_attachments`
field, with one or more attachment definitions. For example:

The format of the returned JSON is shown in the table below:

-   **\_id** (optional): Document ID
-   **\_rev** (optional): Revision ID (when updating an existing
    document)
-   **\_attachments** (optional): Document Attachment

    -   **filename**: Attachment information

        -   **content\_type**: MIME Content type string
        -   **length**: Length (bytes) of the attachment data
        -   **revpos**: Revision where this attachment exists
        -   **digest**: MD5 checksum of the attachment
        -   **stub**: Indicates whether the attachment is a stub

#### Getting a List of Revisions

You can obtain a list of the revisions for a given document by adding
the `revs=true` parameter to the request URL. For example:

~~~~ {.sourceCode .http}
GET /recipes/FishStew?revs=true
Accept: application/json
~~~~

The returned JSON structure includes the original document, including a
`_revisions` structure that includes the revision information:

~~~~ {.sourceCode .javascript}
{
   "servings" : 4,
   "subtitle" : "Delicious with a green salad",
   "_id" : "FishStew",
   "title" : "Irish Fish Stew",
   "_revisions" : {
      "ids" : [
         "a1a9b39ee3cc39181b796a69cb48521c",
         "7c4740b4dcf26683e941d6641c00c39d",
         "9c65296036141e575d32ba9c034dd3ee"
      ],
      "start" : 3
   },
   "_rev" : "3-a1a9b39ee3cc39181b796a69cb48521c"
}
~~~~

-   **\_id** (optional): Document ID
-   **\_rev** (optional): Revision ID (when updating an existing
    document)
-   **\_revisions**: Document Revisions

    -   **ids** [array]: Array of valid revision IDs, in reverse order
        (latest first)
    -   **start**: Prefix number for the latest revision

#### Obtaining an Extended Revision History

You can get additional information about the revisions for a given
document by supplying the `revs_info` argument to the query:

~~~~ {.sourceCode .http}
GET /recipes/FishStew?revs_info=true
Accept: application/json
~~~~

This returns extended revision information, including the availability
and status of each revision:

~~~~ {.sourceCode .javascript}
{
   "servings" : 4,
   "subtitle" : "Delicious with a green salad",
   "_id" : "FishStew",
   "_revs_info" : [
      {
         "status" : "available",
         "rev" : "3-a1a9b39ee3cc39181b796a69cb48521c"
      },
      {
         "status" : "available",
         "rev" : "2-7c4740b4dcf26683e941d6641c00c39d"
      },
      {
         "status" : "available",
         "rev" : "1-9c65296036141e575d32ba9c034dd3ee"
      }
   ],
   "title" : "Irish Fish Stew",
   "_rev" : "3-a1a9b39ee3cc39181b796a69cb48521c"
}
~~~~

-   **\_id** (optional): Document ID
-   **\_rev** (optional): Revision ID (when updating an existing
    document)
-   **\_revs\_info** [array]: Document Extended Revision Info

    -   **rev**: Full revision string
    -   **status**: Status of the revision

#### Obtaining a Specific Revision

To get a specific revision, add the `rev` argument to the request, and
specify the full revision number:

~~~~ {.sourceCode .http}
GET /recipes/FishStew?rev=2-7c4740b4dcf26683e941d6641c00c39d
Accept: application/json
~~~~

The specified revision of the document will be returned, including a
`_rev` field specifying the revision that was requested:

~~~~ {.sourceCode .javascript}
{
   "_id" : "FishStew",
   "_rev" : "2-7c4740b4dcf26683e941d6641c00c39d",
   "servings" : 4,
   "subtitle" : "Delicious with a green salad",
   "title" : "Fish Stew"
}
~~~~

#### Retrieving conflicting revisions

To get a list of conflicting revisions, set the `conflicts` argument to
`true`.

~~~~ {.sourceCode .http}
GET /recipes/FishStew?conflicts=true
Accept: application/json
~~~~

If there are conflicts, the returned document will include a
`_conflicts` field specifying the revisions that are in conflict.

~~~~ {.sourceCode .javascript}
{
   "_id" : "FishStew",
   "_rev" : "2-7c4740b4dcf26683e941d6641c00c39d",
   "servings" : 4,
   "subtitle" : "Delicious with a green salad",
   "title" : "Fish Stew",
   "_conflicts": ["2-65db2a11b5172bf928e3bcf59f728970","2-5bc3c6319edf62d4c624277fdd0ae191"]
}
~~~~

#### Overriding the default read quorum

As in the case of updates there is an r query-string parameter that sets
the quorum for reads. When a document is read, requests are issued to
all N copies of the partition hosting the document and the client
receives a response when r matching success responses are received. The
default quorum is the simple majority of N, which is the recommended
choice for most applications.

### Retrieving revision and size of a document

-   **Method**: `HEAD /db/doc`
-   **Request**: None
-   **Response**: None
-   **Roles permitted**: \_reader

Returns the HTTP Headers containing a minimal amount of information
about the specified document. The method supports the same query
arguments and returns the same status codes as the `GET` method, but
only the header information (including document size, and the revision
as an ETag), is returned. For example, a simple `HEAD` request:

~~~~ {.sourceCode .http}
HEAD /recipes/FishStew
Content-Type: application/json
~~~~

Returns the following HTTP Headers:

~~~~ {.sourceCode .javascript}
HTTP/1.1 200 OK
Server: CouchDB/1.0.1 (Erlang OTP/R13B)
Etag: "7-a19a1a5ecd946dad70e85233ba039ab2"
Date: Fri, 05 Nov 2010 14:54:43 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 136
Cache-Control: must-revalidate
~~~~

The `Etag` header shows the current revision for the requested document,
and the `Content-Length` specifies the length of the data, if the
document were requested in full.

Adding any of the query arguments (as supported by `` `GET ``\_ method),
then the resulting HTTP Headers will correspond to what would be
returned. Note that the current revision is not returned when the
refs\_info\` argument is used. For example:

~~~~ {.sourceCode .http}
HTTP/1.1 200 OK
Server: CouchDB/1.0.1 (Erlang OTP/R13B)
Date: Fri, 05 Nov 2010 14:57:16 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 609
Cache-Control: must-revalidate
~~~~

### Creating or updating a document

-   **Method**: `PUT /db/doc`
-   **Request**: JSON of the new document, or updated version of the
    existing document
-   **Response**: JSON of the document ID and revision
-   **Roles permitted**: \_writer

#### Query Arguments

  -------------------------------------------------------------------------
  Argumen Description                         Option Type  Supported Values
  t                                           al           
  ------- ----------------------------------- ------ ----- ----------------
  `batch` Allow document store request to be  yes    strin `ok`: Enable
          batched with others                        g     batching
  -------------------------------------------------------------------------

#### HTTP Headers

  Header         Description                                     Optional
  -------------- ----------------------------------------------- ----------
  `If-Match`     Current revision of the document for validation yes

#### Return Codes

  Code    Description
  ------- ---------------------------------------------
  201     Document has been created successfully
  202     Document accepted for writing (batch mode)

The `PUT` method creates a new named document, or creates a new revision
of the existing document. Unlike the `POST` method, you must specify the
document ID in the request URL.

For example, to create the document `DocID`, you would send the
following request:

The return type is JSON of the status, document ID,and revision number:

#### Updating an Existing Document

To update an existing document you must specify the current revision
number within the `rev` parameter. For example:

Alternatively, you can supply the current revision number in the
`If-Match` HTTP header of the request. For example:

~~~~ {.sourceCode .http}
PUT /test/DocID
If-Match: 1-61029d20ba39869b1fc879227f5d9f2b
Content-Type: application/json
~~~~

The JSON returned will include the updated revision number:

#### Overriding the default write quorum

The w query-string parameter on updates overrides the default write
quorum for the database. When the N copies of each document are written,
the client will receive a response after w of them have been committed
successfully (the operations to commit the remaining copies will
continue in the background). w defaults to the simple majority of N,
which is the recommended choice for most applications.

#### See also

For information on batched writes, which can provide improved
performance, see api-batch-writes.

### Deleting a document

-   **Method**: `DELETE /db/doc`
-   **Request**: None
-   **Response**: JSON of the deleted revision
-   **Roles permitted**: \_writer

#### Query Arguments

  -------------------------------------------------------------------------
  Argument  Description                                 Optional  Type
  --------- ------------------------------------------- --------- ---------
  `rev`     Current revision of the document for        yes       string
            validation                                            
  -------------------------------------------------------------------------

#### HTTP Headers

  Header         Description                                     Optional
  -------------- ----------------------------------------------- ----------
  `If-Match`     Current revision of the document for validation yes

#### Return Codes

  Code    Description
  ------- -------------------------------------------------
  409     Revision is missing, invalid or not the latest

Deletes the specified document from the database. You must supply (one
of) the current (latest) revision(s), either by using the `rev`
parameter to specify the revision:

~~~~ {.sourceCode .http}
DELETE /test/DocID?rev=3-a1a9b39ee3cc39181b796a69cb48521c
~~~~

Alternatively, you can use ETags with the `If-Match` field:

~~~~ {.sourceCode .http}
DELETE /test/DocID
If-Match: 3-a1a9b39ee3cc39181b796a69cb48521c
~~~~

The returned JSON contains the document ID, revision and status:

~~~~ {.sourceCode .javascript}
{
   "id" : "DocID",
   "ok" : true,
   "rev" : "4-2719fd41187c60762ff584761b714cfb"
}
~~~~

> **note**
>
> Note that deletion of a record increments the revision number. The use
> of a revision for deletion of the record allows replication of the
> database to correctly track the deletion in synchronized copies.

### Copying a document

-   **Method**: `COPY /db/doc`
-   **Request**: None
-   **Response**: JSON of the new document and revision
-   **Roles permitted**: \_writer

#### Query Arguments

  Argument    Description             Optional    Type
  ----------- ----------------------- ----------- -----------
  `rev`       Revision to copy from   yes         string

#### HTTP Headers

  Header            Description                                  Optional
  ----------------- -------------------------------------------- ----------
  `Destination`     Destination document (and optional revision) no

#### Return Codes

  Code    Description
  ------- ---------------------------------------------------
  201     Document has been copied and created successfully
  409     Revision is missing, invalid or not the latest

The `COPY` command (which is non-standard HTTP) copies an existing
document to a new or existing document.

The source document is specified on the request line, with the
`Destination` HTTP Header of the request specifying the target document.

#### Copying a Document to a new document

You can copy the latest version of a document to a new document by
specifying the current document and target document:

~~~~ {.sourceCode .http}
COPY /test/DocID
Content-Type: application/json
Destination: NewDocId
~~~~

The above request copies the document `DocID` to the new document
`NewDocId`. The response is the ID and revision of the new document.

~~~~ {.sourceCode .javascript}
{
   "id" : "NewDocId",
   "rev" : "1-9c65296036141e575d32ba9c034dd3ee"
}
~~~~

#### Copying from a Specific Revision

To copy *from* a specific version, add the `rev` argument to the query
string:

~~~~ {.sourceCode .http}
COPY /test/DocID?rev=5-acfd32d233f07cea4b4f37daaacc0082
Content-Type: application/json
Destination: NewDocID
~~~~

The new document will be created using the information in the specified
revision of the source document.

#### Copying to an Existing Document

To copy to an existing document, you must specify the current revision
string for the target document, adding the `rev` parameter to the
`Destination` HTTP Header string. For example:

~~~~ {.sourceCode .http}
COPY /test/DocID
Content-Type: application/json
Destination: ExistingDocID?rev=1-9c65296036141e575d32ba9c034dd3ee
~~~~

The return value will be the new revision of the copied document:

~~~~ {.sourceCode .javascript}
{
   "id" : "ExistingDocID",
   "rev" : "2-55b6a1b251902a2c249b667dab1c6692"
}
~~~~

Attachments
-----------

### Retrieving an attachment

-   **Method**: `GET /db/doc/attachment`
-   **Request**: None
-   **Response**: Returns the attachment data
-   **Roles permitted**: \_reader

Returns the file attachment `attachment` associated with the document
`doc`. The raw data of the associated attachment is returned (just as if
you were accessing a static file. The returned HTTP `Content-type` will
be the same as the content type set when the document attachment was
submitted into the database.

#### HTTP Range Requests

HTTP allows you to specify byte ranges for requests. This allows the
implementation of resumable downloads and skippable audio and video
streams alike. This is available for all attachments inside Cloudant. To
request a range of bytes from an attachments, submit a Range header with
your request:

~~~~ {.sourceCode .http}
GET /db/doc/attachment HTTP/1.1
Host: username.cloudant.com
Range: bytes=0-12
~~~~

The response will return a status code 206 and specify the number of
bytes sent in the `Content-Length` header as well as the range in the
`Content-Range` header.

~~~~ {.sourceCode .http}
206 Partial Content
Content-Type: application/octet-stream
Content-Range: bytes 0-12/30
Content-Length: 13
Accept-Ranges: bytes
~~~~

HTTP supports many ways to specify single and even multiple byte ranges.
Read all about it in [RFC
2616](http://tools.ietf.org/html/rfc2616#section-14.27).

### Creating or updating an attachment

-   **Method**: `PUT /db/doc/attachment`
-   **Request**: Raw document data
-   **Response**: JSON document status
-   **Roles permitted**: \_writer

#### Query Arguments

  Argument    Description                  Optional    Type
  ----------- ---------------------------- ----------- -----------
  `rev`       Current document revision    no          string

#### HTTP Headers

  ------------------------------------------------------------------------
  Header             Description                                 Optional
  ------------------ ------------------------------------------- ---------
  `Content-Length`   Length (bytes) of the attachment being      no
                     uploaded                                    

  `Content-Type`     MIME type for the uploaded attachment       no

  `If-Match`         Current revision of the document for        yes
                     validation                                  
  ------------------------------------------------------------------------

#### Return Codes

  Code    Description
  ------- -------------------------------
  201     Attachment has been accepted

Upload the supplied content as an attachment to the specified document
(`doc`). The `attachment` name provided must be a URL encoded string.
You must also supply either the `rev` query argument or the `If-Match`
HTTP header for validation, and the HTTP headers (to set the attachment
content type). The content type is used when the attachment is requested
as the corresponding content-type in the returned document header.

For example, you could upload a simple text document using the following
request:

~~~~ {.sourceCode .http}
PUT /recipes/FishStew/basic?rev=8-a94cb7e50ded1e06f943be5bfbddf8ca
Content-Length: 10
Content-Type: text/plain

Roast it
~~~~

Or by using the `If-Match` HTTP header:

~~~~ {.sourceCode .http}
PUT /recipes/FishStew/basic
If-Match: 8-a94cb7e50ded1e06f943be5bfbddf8ca
Content-Length: 10
Content-Type: text/plain

Roast it
~~~~

The returned JSON contains the new document information:

~~~~ {.sourceCode .javascript}
{
   "id" : "FishStew",
   "ok" : true,
   "rev" : "9-247bb19a41bfd9bfdaf5ee6e2e05be74"
}
~~~~

> **note**
>
> Uploading an attachment updates the corresponding document revision.
> Revisions are tracked for the parent document, not individual
> attachments.

#### Updating an Existing Attachment

Uploading an attachment using an existing attachment name will update
the corresponding stored content of the database. Since you must supply
the revision information to add an attachment to a document, this serves
as validation to update the existing attachment.

### Creating a document with an inline attachment

Inline attachments are just like any other attachment, except that their
data is included in the document itself via Base 64 encoding when the
document is created or updated.

~~~~ {.sourceCode .javascript}
{
  "_id":"attachment_doc",
  "_attachments": {
    "foo.txt": {
      "content_type":"text/plain",
      "data": "VGhpcyBpcyBhIGJhc2U2NCBlbmNvZGVkIHRleHQ="
    }
  }
}
~~~~

### Deleting an attachment

-   **Method**: `DELETE /db/doc/attachment`
-   **Request**: None
-   **Response**: JSON status
-   **Roles permitted**: \_writer

#### Query Arguments

  Argument    Description                  Optional    Type
  ----------- ---------------------------- ----------- -----------
  `rev`       Current document revision    no          string

#### HTTP Headers

  Header         Description                                     Optional
  -------------- ----------------------------------------------- ----------
  `If-Match`     Current revision of the document for validation yes

#### Return Codes

  Code    Description
  ------- --------------------------------------------
  200     Attachment deleted successfully
  409     Supplied revision is incorrect or missing

Deletes the attachment `attachment` to the specified `doc`. You must
supply the `rev` argument with the current revision to delete the
attachment.

For example to delete the attachment `basic` from the recipe `FishStew`:

The returned JSON contains the updated revision information:
