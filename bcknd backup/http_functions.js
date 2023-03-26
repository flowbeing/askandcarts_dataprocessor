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
import wixPayBackend from 'wix-pay-backend';

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
  let currentRowsProductPrice = rowDataToInsert.price;


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
          'productPriceOriginal': JSON.parse(JSON.stringify(rowDataToInsert.price)),
          'productPriceConverted': '',
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

      return convertProductPrice(currentRowsProductPrice, collectionName).then((newPriceValue) => {

        // currentRowsProductPrice = newPriceValue;

        response.body.productPriceConverted = newPriceValue;
        rowDataToInsert.price = newPriceValue;

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

async function convertProductPrice(
	priceString,
  collectionName){

	let priceFloat = 0;
	let listPriceNumbers = [];

	let convertedPrice = '';

  let applicablePriceValue = '';

	// obtaining price as a number
	for (let i in priceString){
		let isCharNumber = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'].filter((numberOrDot) => numberOrDot == priceString[i]).length > 0;

		if (isCharNumber){
			listPriceNumbers.push(priceString[i]);
		}

	}

	priceFloat = Number(listPriceNumbers.join(""));

	// console.log('priceFloat: ' + priceFloat);

	if (collectionName == 'singaporeProducts') {
		console.log('here');

		if ( priceString.includes('SGD$') || priceString.includes('SGD') ){

			let currency = 'S$';
			let amount = priceFloat.toFixed(2);
			convertedPrice = currency + amount;

		}
		else if ( priceString.includes('USD$') || priceString.includes('USD') || priceString.includes('$') ){
			let currency = 'S$';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'USD', 'SGD').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(2));
				// console.log(convertedPrice);
			});
		}
		else if ( priceString.includes(' AED') || priceString.includes('AED') || priceString.includes('د.إ') ){
			let currency = 'S$';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'AED', 'SGD').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(2));
				// console.log(convertedPrice);
			});
		}
		else if ( priceString.includes('EUR') || priceString.includes('€') ){
			let currency = 'S$';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'EUR', 'SGD').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(2));
				// console.log(convertedPrice);
			});
		}
		else if ( priceString.includes('GBP') || priceString.includes('£') ){
			let currency = 'S$';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'GBP', 'SGD').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(2));
				// console.log(convertedPrice);
			});
		}
		else if ( priceString.includes('CAD') || priceString.includes('C$') || priceString.includes('CAD$') ){
			let currency = 'S$';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'CAD', 'SGD').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(2));
				// console.log(convertedPrice);
			});
		}

	}
	else if (collectionName == 'uaeProducts') {
		console.log('here');

		if ((priceString.includes('د.إ'))){
			let currency = 'AED ';
			let amount = priceFloat;
			convertedPrice = currency + String(amount.toFixed(2));
		}
		else if (priceString.includes('USD$') || priceString.includes('USD') || priceString.includes('$') ){

			let currency = 'AED ';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'USD', 'AED').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(2));
				// console.log(convertedPrice);
			});

		}
		else if ( priceString.includes('SGD$') || priceString.includes('SGD') || priceString.includes('SGD$') || priceString.includes('S$')){

			let currency = 'AED ';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'SGD', 'AED').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(2));
				// console.log(convertedPrice);
			});

		}
		else if ( priceString.includes('EUR') || priceString.includes('€') ){
			let currency = 'AED ';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'EUR', 'AED').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(2));
				// console.log(convertedPrice);
			});
		}
		else if ( priceString.includes('GBP') || priceString.includes('£') ){
			let currency = 'AED ';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'GBP', 'AED').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(2));
				// console.log(convertedPrice);
			});
		}
		else if (priceString.includes('CAD') || priceString.includes('C$') || priceString.includes('CAD$') ){
			let currency = 'AED ';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'CAD', 'AED').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(2));
				// console.log(convertedPrice);
			});
		}

	}
	else if (collectionName == 'usaProducts') {
		console.log('here');

		if ( priceString.includes('USD') || priceString.includes('USD$') || priceString.includes('US$') ){
			let currency = '$';
			let amount = priceFloat;
			convertedPrice = currency + String(amount.toFixed(2));
		}
		else if ( priceString.includes('AED') || priceString.includes('د.إ') ){

			let currency = '$';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'AED', 'USD').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(2));
				// console.log(convertedPrice);
			});

		}
		else if ( priceString.includes('SGD$') || priceString.includes('SGD') || priceString.includes('SGD$') || priceString.includes('S$')){

			let currency = '$';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'SGD', 'USD').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(2));
				// console.log(convertedPrice);
			});

		}
		else if ( priceString.includes('EUR') || priceString.includes('€') ){
			let currency = '$';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'EUR', 'USD').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(2));
				// console.log(convertedPrice);
			});
		}
		else if ( priceString.includes('GBP') || priceString.includes('£') ){
			let currency = '$';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'GBP', 'USD').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(2));
				// console.log(convertedPrice);
			});
		}
		else if ( priceString.includes('CAD') || priceString.includes('C$') || priceString.includes('CAD$') ){
			let currency = '$';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'CAD', 'USD').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(2));
				// console.log(convertedPrice);
			});
		}

	}

	console.log('convertedPrice: ' + convertedPrice);

  if (convertedPrice == ''){

    applicablePriceValue = priceString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // if (collectionName == 'singaporeProducts'){
    //   applicablePriceValue = 'S$' + String(Number(priceFloat.toFixed(2))).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // }
    // else if (collectionName == 'uaeProducts'){
    //   applicablePriceValue = 'AED' + String(Number(priceFloat.toFixed(2))).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // }
    // else if (collectionName == 'usaProducts'){
    //   applicablePriceValue = '$' + String(Number(priceFloat.toFixed(2))).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // }
  }
  else{
    applicablePriceValue = convertedPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

	return applicablePriceValue // replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	// else if (usersCountryCode == 'AE'){
	// 	dbCollectionToFocusOn = 'uaeProducts';
	// 	timeOut = 2500;
	// }
	// else if (usersCountryCode == 'US'){
	// 	dbCollectionToFocusOn = 'usaProducts';
	// }
}



async function priceConverterFunction(price, fromCurrency, toCurrency) {

	let returnValue = 0;

	const conversionOptions =	{
			  "amounts": [price],
			  "from": fromCurrency,
			  "to": toCurrency
			};

	await wixPayBackend.currencies.currencyConverter.convertAmounts(conversionOptions)
  		.then((convertedAmounts) => {
  			returnValue = convertedAmounts.amounts[0];
  		});

	return returnValue;

}