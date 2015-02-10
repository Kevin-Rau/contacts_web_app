# Web App Example &mdash; Contacts

_created by Prof. Ken Anderson_

This is the start of a web application that is implemented in Node,
Express, and AngularJS.

It currently only has functionality that demonstrates how to login
and logout users and how to allow admin users to create new users
and delete existing users.

It makes use of RequireJS to allow for clean and modular AngularJS
code.

It provides an accounts.js utility application to manage users
and passwords off-line. Indeed, if you attempt to deploy this
application, you will need to use accounts.js to add an 'admin'
user and give that user a password. Run `node accounts.js` for
details.

The next step for this application is to add the ability to create,
view, sort, edit, and delete contacts for a particular user.

## Running the Application

To launch this web app, type `node server.js` in the root level of
the application. Then naviagate to `http://localhost:3000/` in your
favorite web browser.
