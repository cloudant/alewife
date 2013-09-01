Local (non-replicating) Document Methods
========================================

The Local (non-replicating) document interface allows you to create
local documents that are not replicated to other databases. These
documents can be used to hold configuration or other information that is
required specifically on the local server instance.

Local documents have the following limitations:

-   Local documents are not replicated to other databases.

-   The ID of the local document must be known for the document to
    accessed. You cannot obtain a list of local documents from the
    database.

-   Local documents are not output by views, or the `_all_docs` view.

Local documents can be used when you want to store configuration or
other information for the current (local) instance of a given database.

A list of the available methods and URL paths are provided below:

  ------------------------------------------------------------------------
  Method Path              Description
  ------ ----------------- -----------------------------------------------
  GET    /db/\_local/local Returns the latest revision of the
         -doc              non-replicated document

  PUT    /db/\_local/local Inserts a new version of the non-replicated
         -doc              document

  DELETE /db/\_local/local Deletes the non-replicated document
         -doc              

  COPY   /db/\_local/local Copies the non-replicated document
         -doc              
  ------------------------------------------------------------------------

Retrieving a local document
---------------------------

-   **Method**: `GET /db/_local/local-doc`
-   **Request**: None
-   **Response**: JSON of the returned document
-   **Roles permitted**: \_reader
-   **Query Arguments**:

    -   **Argument**: rev

        -   **Description**: Specify the revision to return
        -   **Optional**: yes
        -   **Type**: string
        -   **Supported Values**:

            -   **true**: Includes the revisions

    -   **Argument**: revs

        -   **Description**: Return a list of the revisions for the
            document
        -   **Optional**: yes
        -   **Type**: boolean

    -   **Argument**: revs\_info

        -   **Description**: Return a list of detailed revision
            information for the document
        -   **Optional**: yes
        -   **Type**: boolean
        -   **Supported Values**

            -   **true**: Includes the revisions

-   **Return Codes**:

    -   **400**: The format of the request or revision was invalid
    -   **404**: The specified document or revision cannot be found, or
        has been deleted

Gets the specified local document. The semantics are identical to
accessing a standard document in the specified database, except that the
document is not replicated. See api-get-doc.

Creating or updating a local document
-------------------------------------

-   **Method**: `PUT /db/_local/local-doc`
-   **Request**: JSON of the document
-   **Response**: JSON with the committed document information
-   **Roles permitted**: \_writer
-   **Return Codes**:

    -   **201**: Document has been created successfully

Stores the specified local document. The semantics are identical to
storing a standard document in the specified database, except that the
document is not replicated. See api-put-doc.

Deleting a local document
-------------------------

-   **Method**: `DELETE /db/_local/local-doc`
-   **Request**: None
-   **Response**: JSON with the deleted document information
-   **Roles permitted**: \_writer
-   **Query Arguments**:

    -   **Argument**: rev

        -   **Description**: Current revision of the document for
            validation
        -   **Optional**: yes
        -   **Type**: string

-   **HTTP Headers**

    -   **Header**: `If-Match`

        -   **Description**: Current revision of the document for
            validation
        -   **Optional**: yes

-   **Return Codes**:

    -   **409**: Supplied revision is incorrect or missing

Deletes the specified local document. The semantics are identical to
deleting a standard document in the specified database, except that the
document is not replicated. See api-del-doc.

Copying a local document
------------------------

-   **Method**: `COPY /db/_local/local-doc`
-   **Request**: None
-   **Response**: JSON of the copied document
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

Copies the specified local document. The semantics are identical to
copying a standard document in the specified database, except that the
document is not replicated. See api-copy-doc.
