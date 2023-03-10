/*************************
backend/http-functions.js
*************************

'backend/http-functions.js' is a reserved Velo file that lets you expose APIs that respond to fetch requests from external services.

In this file you create APIs to expose the functionality of your site as a service. That is, other people can use
the functionality of your site by writing code that calls your site's APIs, as defined by the functions you create here.

Using the provided code (below this comment block) as an example, users of your HTTP functions can call your API using the following patterns:

Production endpoints:

 • Premium site:
   https://mysite.com/_functions/multiply?leftOperand=3&rightOperand=4
 • Free sites:
   https://username.wixsite.com/mysite/_functions/multiply?leftOperand=3&rightOperand=4

Test endpoints:
 • Premium sites:
   https://mysite.com/_functions-dev/multiply?leftOperand=3&rightOperand=4
 • Free sites:
   https://username.wixsite.com/mysite/_functions-dev/multiply?leftOperand=3&rightOperand=4

---
About HTTP functions:
https://support.wix.com/en/article/velo-exposing-a-site-api-with-http-functions

API Reference:
https://www.wix.com/velo/reference/wix-http-functions

**********************/

// The following is an example of an HTTP function, which gets the product of 2 operands. Adapt the code below for your specific use case.

import { ok, badRequest, notFound, serverError } from 'wix-http-functions';
import wixSecretsBackend from 'wix-secrets-backend';
import wixData from 'wix-data';

// This function compares the authorization key provided in the
// request headers with the secret key stored in the Secrets Manager.
async function isPermitted(headers){
  try{
    const authHeader = headers.auth;
    const sharedAuthKey = await wixSecretsBackend.getSecret('my-site1');
    if (authHeader === sharedAuthKey) {
      return true;
    }
    return false;
  }
  catch(err){
    console.error(err);
    return false
  }
}

// multiply
export async function get_addRowToCollection(request) {

  const headers = request.headers;

  if (!await isPermitted(headers)) {
    let options = {
      'body': {
        'error': 'Not authorized',
      },
      'headers': {
        'Content-Type': 'application/json'
      }
    };
    return badRequest(options);
  }

  var insertRow = JSON.parse(headers.body);
  const collectionName = insertRow.collectionName;
  const rowDataToInsert = insertRow.rowData;
  const currentRowsProductLink = rowDataToInsert.productLink;


  // t toInsert = {
  //  "_id":          "00001",
  //  "title":        "Mr.",
  //  "first_name":   "John",
  //  "last_name":    "Doe"
  //
  // let response = {
  //   'headers': {
  //       'Content-Type': 'application/json'
  //   },
  //   'insertRow': headers
  // };

  // wixData.insert(collectionName, rowDataToInsert)

  try{

    let response = {
      body: {
        "collectionName": collectionName,
        // "rowDataToInsert": typeof(rowDataToInsert),
        'rowAlreadyExists': false,
        'productLink': rowDataToInsert.productLink,
        'rowAddedToDB': false
        // 'result': {}
        },
      headers: {
          "Content-Type": "application/json"
        }
    };

    let options = {
      "suppressAuth": true,
      "suppressHooks": true
    };

    return wixData.query(collectionName).eq("productLink", currentRowsProductLink).find(options)
      .then((results) => {

        if(results.items.length > 0) {

          response.body.rowAlreadyExists = true;

          return ok(response);

        // response.body.dataAlreadyExists = false;

        // console.log(results.items[0]); //see firstItem below
        }
        else{

          return wixData.insert(collectionName, rowDataToInsert, options)
          .then((itemValue) => {

            let item = itemValue;
            // response.body.item = itemValue;

            response.body.rowAddedToDB = true;

            return ok(response);

          });
          // return ok(response);

        }

        // return ok(response);
      // else {
      // // handle case where no matching items found
      //
      // }
      });

  }
  catch (error){

    let response = {
      body: {
        "error": error,
        },
        headers: {
          "Content-Type": "application/json"
        }
    };

    return error(response);
  }




}