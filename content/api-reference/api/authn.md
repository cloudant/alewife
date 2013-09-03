Authentication Methods
======================

Most requests require the credentials of a Cloudant account. There are
two ways to provide those credentials. They can either be provided using
HTTP Basic Auth or as an HTTP cookie named AuthSession. The cookie can
be obtained by performing a POST request to `/_session`. With the cookie
set, information about the logged in user can be retrieved with a GET
request and with a DELETE request you can end the session. Further
details are provided below.

  -------------------------------------------------------------------------
  Meth Path   Description             Headers                     Form
  od                                                              Parameter
                                                                  s
  ---- ------ ----------------------- --------------------------- ---------
  GET  /\_ses Returns cookie based    AuthSession cookie returned ---
       sion   login user information  by POST request             

  POST /\_ses Do cookie based user    `Content-Type: application/ name,
       sion   login                   x-www-form-urlencoded`      password

  DELE /\_ses Logout cookie based     AuthSession cookie returned ---
  TE   sion   user                    by POST request             
  -------------------------------------------------------------------------

Here is an example of a post request to obtain the authentication
cookie.

~~~~ {.sourceCode .javascript}
name=YourUserName&password=YourPassword
~~~~

And this is the corresponding reply with the Set-Cookie header.

Once you have obtained the cookie, you can make a GET request to obtain
the username and its roles:

The body of the reply looks like this:

To log out, you have to send a DELETE request to the same URL and sumbit
the Cookie in the request.

This will result in the following response.
