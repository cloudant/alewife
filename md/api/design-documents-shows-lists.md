Querying show functions
=======================

-   **Method**: `GET /db/_design/design-doc/_show/function-name/doc-id`
-   **Request**: None
-   **Response**: Content returned by the show function
-   **Roles permitted**: \_reader
-   **Query Arguments**: Any arguments will be passed to the list
    function. The second parameter of the list function is a request
    object containing a `query` field. This field holds an object with a
    field for each query parameter.

Executes the specified `show-name` from the specified `design-doc`
design document with the document specified by `doc-id` passed to it.
The `/doc-id` part of the URL is optional. The response is completely
determined by the show function.

Example request
---------------

Querying list functions
=======================

-   **Method**:
    `GET /db/_design/design-doc/_list/function-name/view-name`
-   **Request Body**: None
-   **Response Body**: Content returned by the list function
-   **Roles permitted**: \_reader
-   **Query Arguments**: Query arguments are the same as those for
    querying a view. Any other arguments will be passed to the list
    function. The second parameter of the list function is a request
    object containing a `query` field. This field holds an object with a
    field for each query parameter.

Executes the specified function from the specified design document with
the data from the specified view passed to it. The response is
completely determined by the list function.

Example request
---------------
