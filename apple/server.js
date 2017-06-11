"use strict";
const server = module.exports = {};

const jsonApi = require("../.");
const fs = require("fs");
const path = require("path");
const ldap_auth = require("./ldap_auth");

process.title = "jsonapi-server";

jsonApi.setConfig({
  graphiql: false,
  swagger: {
    title: "Apple DP JSON:API Server",
    version: "0.1.1",
    description: "Apple Rest API for RPP and DP management.",
    contact: {
      name: "API Contact",
      email: "akirka@gmail.com",
      url: "megawin-corp.com"
    },
    license: {
      name: "Copyright Protected",
      url: ""
    }
  },
  protocol: "https",
  tls: {
    cert: fs.readFileSync('/etc/ssl/rpp_server.crt'),
    key: fs.readFileSync('/etc/ssl/rpp_server.key'),
    passphrase: 'charger.'
  },
  hostname: process.env.HOSTNAME,
  port: 16006,
  base: "1",
  meta: {
    description: "Apple Rest API for RPP and DP management payload."
  }
});

/**
 * Swagger sends the request.params.filter = '[isWritable]=true&[isHistorical]=true' which needs to
 * be converted from the string to a JSON object like so
 * {
 *  isWritable:true,
 *  isHistorical:true
 *  }
 * @param param If a string, then convert to json object but if not a string then do nothing.
 * @return {*} The resulting json from the string or if it is not a string then just return the
 * param with no changes.
 */
const toJSON = function (param) {
  const results = {};
  let key;
  let value;
  if (typeof param === 'string' ){
    param.split('&').forEach((obj) => {
      obj.split('=').forEach((item) => {
        if (item.includes('[')){
          key = item.replace(/\[|\]/g,'');
        } else {
          results[key] = item;
        }
      });
    });
    return results;
  }
  return param;
};

jsonApi.authenticate(function(request, callback) {

  //Fix the params if they are sent as a string like what swagger does. If you don't do this to the
  //stuff that swagger ui sends, then the restapi will crash and burn.
  request.params.filter = toJSON(request.params.filter);
  request.params.fields = toJSON(request.params.fields);
  request.params.include = toJSON(request.params.include);
  request.params.page = toJSON(request.params.page);
  request.params.sort = toJSON(request.params.sort);

  //Allow the request for the swagger.json as it should not be protected resource.
   if (request.route.path.toLowerCase() === "swagger.json") return callback();
  //Check for authorization header.
  if (request.headers.hasOwnProperty('authorization') === false) return callback("Fail");

  // If a "blockMe" header is provided, block access.
  if (request.headers.blockme) return callback("Fail");

  // If a "blockMe" cookie is provided, block access.
  if (request.cookies.blockMe) return callback("Fail");

  //Check the authorization header to see if it is ok with ldap.
  ldap_auth.authorize(request.headers.authorization, function (statusCode, response) {

    if (statusCode !== 200) return callback("Fail");

    //Ok, the user is authorized.
    return callback();
  });

});

fs.readdirSync(path.join(__dirname, "/resources")).filter(function(filename) {
  return /^[a-z].*\.js$/.test(filename);
}).map(function(filename) {
  return path.join(__dirname, "/resources/", filename);
}).forEach(require);

jsonApi.onUncaughtException(function(request, error) {
  const errorDetails = error.stack.split("\n");
  console.error(JSON.stringify({
    request: request,
    error: errorDetails.shift(),
    stack: errorDetails
  }));
});

jsonApi.start();
server.start = jsonApi.start;
server.close = jsonApi.close;
