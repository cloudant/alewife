Authorization Settings
======================

Cloudant's API allows you to read and modify the permissions of each
user. Users are either identified by their Cloudant username or by their
API key. You can also set permissions for unauthenticated users.

A list of the available methods and URL paths is provided below. Note
that the root URL is **<https://cloudant.com/>** rather than
**<https://username.cloudant.com/>**:

  --------------------------------------------------------------------------
  Metho Path                      Description              Parameters
  d                                                        
  ----- ------------------------- ------------------------ -----------------
  POST  <https://cloudant.com/api Set permissions for a    database,
        /set_permissions>         user and database        username, roles[]

  POST  <https://cloudant.com/api Generate a random API    ---
        /generate_api_key>        key                      
  --------------------------------------------------------------------------

Setting permissions
-------------------

-   **Method**: `POST https://cloudant.com/api/set_permissions`
-   **Request Body**: Contains parameters as url-encoded form fields
-   **Response**: JSON document indicating success or failure
-   **Roles permitted**: admin

### Query Arguments

  -------------------------------------------------------------------------
  Ar Description          Op T Supported Values
  gu                      ti y 
  me                      on p 
  nt                      al e 
  -- -------------------- -- - --------------------------------------------
  `d The database for     no s 
  at which permissions       t 
  ab are set. This has to    r 
  as be a string of the      i 
  e` form                    n 
     "accountname/databas    g 
     ename".                   

  `u The user name or API ye s 
  se key for which        s  t 
  rn permissions are set     r 
  am                         i 
  e`                         n 
                             g 

  `r The roles the user   no s `_admin`: Gives the user all permissions,
  ol can have. This          t including setting permissions, `_reader`:
  es parameter can be        r Gives the user permission to read documents
  `  passed multiple         i from the database, `_writer`: Gives the user
     times for each role.    n permission to create and modify documents in
                             g the database
  -------------------------------------------------------------------------

### Example Request

~~~~ {.sourceCode .http}
POST /api/set_permissions HTTP/1.1
Host: cloudant.com
Content-Length: 83
Content-Type: application/x-www-form-urlencoded

username=aUserNameOrApiKey&database=accountName/db&roles=_reader&roles=_writer
~~~~

### Example Response

~~~~ {.sourceCode .javascript}
{
  "ok": true
}
~~~~

Generating an API Key
---------------------

-   **Method**: `POST https://cloudant.com/api/generate_api_key`
-   **Request Body**: Empty
-   **Response**: JSON document containing the generated key and
    password
-   **Roles permitted**: admin
-   **Query Arguments**: none

### Structure of the JSON document returned

-   **ok**: true if request was successful
-   **key**: String containing the generated key
-   **password**: String containing the generated password

### Example Request

~~~~ {.sourceCode .http}
POST /api/generate_api_key HTTP/1.1
Host: cloudant.com
~~~~

### Example Response

~~~~ {.sourceCode .javascript}
{
  "password": "generatedPassword",
   "ok": true,
   "key": "generatedKey"
}
~~~~
