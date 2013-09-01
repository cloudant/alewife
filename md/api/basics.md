API Basics
==========

The Cloudant API is the primary method of accessing and changing data on
Cloudant. Requests are made using HTTP and requests are used to request
information from the database, store new data, and perform views and
formatting of the information stored within the documents. Since
Cloudant uses open, well documented standards as the basis of its API,
it is easy to access in a large number of programming languages. Have a
look at [this repository](https://github.com/cloudant/haengematte) for
examples of accessing Cloudant in many programming languages.

Requests to the API can be categorised by the different areas of the
CLoudant system that you are accessing, and the HTTP method used to send
the request. Different methods imply different operations, for example
retrieval of information from the database is typically handled by the
`GET` operation, while updates are handled by either a `POST` or `PUT`
request. There are some differences between the information that must be
supplied for the different methods. For a guide to the basic HTTP
methods and request structure, see api-format.

For nearly all operations, the submitted data, and the returned data
structure, is defined within a JavaScript Object Notation (JSON) object.
Basic information on the content and data types for JSON are provided in
json.

Errors when accessing the Cloudant API are reported using standard HTTP
Status Codes. A guide to the generic codes returned by Cloudant are
provided in errors.

When accessing specific areas of the Cloudant API, specific information
and examples on the HTTP methods and request, JSON structures, and error
codes are provided.

Request Format and Responses
----------------------------

Cloudant supports the following HTTP request methods:

-   `GET`

    Request the specified item. As with normal HTTP requests, the format
    of the URL defines what is returned. With Cloudant this can include
    static items, database documents, and configuration and statistical
    information. In most cases the information is returned in the form
    of a JSON document.

-   `HEAD`

    The `HEAD` method is used to get the HTTP header of a `GET` request
    without the body of the response.

-   `POST`

    Upload data. Within Cloudant's API, `POST` is used to set values,
    including uploading documents, setting document values, and starting
    certain administration commands.

-   `PUT`

    Used to put a specified resource. In Cloudant's API, `PUT` is used
    to create new objects, including databases, documents, views and
    design documents.

-   `DELETE`

    Deletes the specified resource, including documents, views, and
    design documents.

-   `COPY`

    A special method that can be used to copy documents and objects.

If you use an unsupported HTTP request type with a URL that does not
support the specified type, a 405 error will be returned, listing the
supported HTTP methods. For example:

~~~~ {.sourceCode .javascript}
{
    "error":"method_not_allowed",
    "reason":"Only GET,HEAD allowed"
}
~~~~

The Cloudant design document API and the functions when returning HTML
(for example as part of a show or list) enable you to include custom
HTTP headers through the `headers` block of the return object.

HTTP Headers
------------

Because Cloudant uses HTTP for all external communication, you need to
ensure that the correct HTTP headers are supplied (and processed on
retrieval) so that you get the right format and encoding. Different
environments and clients will be more or less strict on the effect of
these HTTP headers (especially when not present). Where possible you
should be as specific as possible.

### Request Headers

-   `Content-type`

    Specifies the content type of the information being supplied within
    the request. The specification uses MIME type specifications. For
    the majority of requests this will be JSON (`application/json`). For
    some settings the MIME type will be plain text. When uploading
    attachments it should be the corresponding MIME type for the
    attachment or binary (`application/octet-stream`).

    The use of the `Content-type` on a request is highly recommended.

-   `Accept`

    Specifies the list of accepted data types to be returned by the
    server (i.e. that are accepted/understandable by the client). The
    format should be a list of one or more MIME types, separated by
    colons.

    For the majority of requests the definition should be for JSON data
    (`application/json`). For attachments you can either specify the
    MIME type explicitly, or use `*/*` to specify that all file types
    are supported. If the `Accept` header is not supplied, then the
    `*/*` MIME type is assumed (i.e. client accepts all formats).

    The use of `Accept` in queries to Cloudant is not required, but is
    highly recommended as it helps to ensure that the data returned can
    be processed by the client.

    If you specify a data type using the `Accept` header, Cloudant will
    honor the specified type in the `Content-type` header field
    returned. For example, if you explicitly request `application/json`
    in the `Accept` of a request, the returned HTTP headers will use the
    value in the returned `Content-type` field.

    For example, when sending a request without an explicit `Accept`
    header, or when specifying `*/*`:

    ~~~~ {.sourceCode .http}
    GET /recipes HTTP/1.1
    Host: username.cloudant.com
    Accept: */*
    ~~~~

    The returned headers are:

    ~~~~ {.sourceCode .http}
    Server: CouchDB/1.0.2 (Erlang OTP/R14B)
    Date: Thu, 13 Jan 2011 13:39:34 GMT
    Content-Type: text/plain;charset=utf-8
    Content-Length: 227
    Cache-Control: must-revalidate
    ~~~~

    Note that the returned content type is `text/plain` even though the
    information returned by the request is in JSON format.

    Explicitly specifying the `Accept` header:

    ~~~~ {.sourceCode .http}
    GET /recipes HTTP/1.1
    Host: username.cloudant.com
    Accept: application/json
    ~~~~

    The headers returned include the `application/json` content type:

    ~~~~ {.sourceCode .http}
    Server: CouchDB/1.0.2 (Erlang OTP/R14B)
    Date: Thu, 13 Jan 2011 13:40:11 GMT
    Content-Type: application/json
    Content-Length: 227
    Cache-Control: must-revalidate
    ~~~~

-   `If-None-Match`

    This header can optionally be sent to find out whether a document
    has been modified since it was last read or updated. The value of
    the `If-None-Match` header should match the last `Etag` value
    received.

### Response Headers

Response headers are returned by the server when sending back content
and include a number of different header fields, many of which are
standard HTTP response header and have no significance to how Cloudant
operates. The list of response headers important to Cloudant are listed
below.

-   `Content-type`

    Specifies the MIME type of the returned data. For most request, the
    returned MIME type is `text/plain`. All text is encoded in Unicode
    (UTF-8), and this is explicitly stated in the returned
    `Content-type`, as `text/plain;charset=utf-8`.

-   `Cache-control`

    The cache control HTTP response header provides a suggestion for
    client caching mechanisms on how to treat the returned information.
    Cloudant typically returns the `must-revalidate`, which indicates
    that the information should be revalidated if possible. This is used
    to ensure that the dynamic nature of the content is correctly
    updated.

-   `Content-length`

    The length (in bytes) of the returned content.

-   `Etag`

    The `Etag` HTTP header field is used to show the revision for a
    document or the response from a show function. For documents, the
    value is identical to the revision of the document. The value can be
    used with an `If-None-Match` request header to get a
    `304 Not Modified` response if the revision is still current.

    ETags cannot currently be used with views or lists, since the ETags
    returned from those requests are just random numbers that change on
    every request.

JSON Basics
-----------

The majority of requests and responses to and from Cloudant use the
JavaScript Object Notation (JSON) for formatting the content and
structure of the data and responses.

JSON is used because it is the simplest and easiest to use solution for
working with data within a web browser, as JSON structures can be
evaluated and used as JavaScript objects within the web browser
environment. JSON also integrates with the server-side JavaScript used
within Cloudant.

JSON supports the same basic types as supported by JavaScript, these
are:

-   Number (either integer or floating-point).

-   String; this should be enclosed by double-quotes and supports
    Unicode characters and backslash escaping. For example:

    ~~~~ {.sourceCode .javascript}
    "A String"
    ~~~~

-   Boolean - a `true` or `false` value. You can use these strings
    directly. For example:

    ~~~~ {.sourceCode .javascript}
    { "value": true}
    ~~~~

-   Array - a list of values enclosed in square brackets. For example:

    ~~~~ {.sourceCode .javascript}
    ["one", "two", "three"]
    ~~~~

-   Object - a set of key/value pairs (i.e. an associative array, or
    hash). The key must be a string, but the value can be any of the
    supported JSON values. For example:

    ~~~~ {.sourceCode .javascript}
    {
       "servings" : 4,
       "subtitle" : "Easy to make in advance, and then cook when ready",
       "cooktime" : 60,
       "title" : "Chicken Coriander"
    }
    ~~~~

    In Cloudant databases, the JSON object is used to represent a
    variety of structures, including all documents in a database.

Parsing JSON into a JavaScript object is supported through the
`JSON.parse()` function in JavaScript, or through various libraries that
will perform the parsing of the content into a JavaScript object for
you. Libraries for parsing and generating JSON are available in all
major programming languages.

> **warning**
>
> Care should be taken to ensure that your JSON structures are valid,
> invalid structures will cause Cloudant to return an HTTP status code
> of 500 (server error).

HTTP Status Codes
-----------------

With the interface to Cloudant working through HTTP, error codes and
statuses are reported using a combination of the HTTP status code
number, and corresponding data in the body of the response data.

A list of the error codes returned by Cloudant and generic descriptions
of the related errors are provided below. The meaning of different
status codes for specific request types are provided in the
corresponding API call reference.

-   `200 - OK`

    Request completed successfully.

-   `201 - Created`

    Resource created successfully.

-   `202 - Accepted`

    Request has been accepted, but the corresponding operation may not
    have completed. This is used for background operations, such as
    database compaction or for bulk operations where some updates might
    have led to a conflict.

-   `304 - Not Modified`

    The content requested has not been modified. This is used with the
    ETag system to identify the version of information returned.

-   `400 - Bad Request`

    Bad request structure. The error can indicate an error with the
    request URL, path or headers. Differences in the supplied MD5 hash
    and content also trigger this error, as this may indicate message
    corruption.

-   `401 - Unauthorized`

    The item requested was not available using the supplied
    authorization, or authorization was not supplied.

-   `403 - Forbidden`

    The requested item or operation is forbidden.

-   `404 - Not Found`

    The requested resource could not be found. The content will include
    further information, as a JSON object, if available. The structure
    will contain two keys, `error` and `reason`. For example:

    ~~~~ {.sourceCode .javascript}
    {"error":"not_found","reason":"no_db_file"}
    ~~~~

-   `405 - Resource Not Allowed`

    A request was made using an invalid HTTP request type for the URL
    requested. For example, you have requested a `PUT` when a `POST` is
    required. Errors of this type can also be triggered by invalid URL
    strings.

-   `406 - Not Acceptable`

    The requested content type is not supported by the server.

-   `409 - Conflict`

    Request resulted in an update conflict.

-   `412 - Precondition Failed`

    The request headers from the client and the capabilities of the
    server do not match.

-   `415 - Bad Content Type`

    The content types supported, and the content type of the information
    being requested or submitted indicate that the content type is not
    supported.

-   `416 - Requested Range Not Satisfiable`

    The range specified in the request header cannot be satisfied by the
    server.

-   `417 - Expectation Failed`

    When sending documents in bulk, the bulk load operation failed.

-   `500 - Internal Server Error`

    The request was invalid, either because the supplied JSON was
    invalid, or invalid information was supplied as part of the request.


