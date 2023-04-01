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

export async function get_clearDataBase(request) {

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

  	var body = JSON.parse(headers.body);
  	const collectionName = body.collectionName;

	let response = {
        body: {
          "collectionName": collectionName,
		  'result': null
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

	//let user = wixUsers.currentUser;
	//let userId = user.id;
	// const itemId = event.context.itemId; // this is the item in the repeater assuming that the button is in the repeater.
	return wixData.truncate(collectionName, options)
	  .then((result) => {

		  response.body.result = result;

		  return ok(response);

	  }).catch((error) => {
		let response = {
      'body': {
        'error': error,
      },
      'headers': {
        'Content-Type': 'application/json'
      }
    };
		return badRequest(response);
	});

}

export async function get_resetP(request) {

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

	const body = JSON.parse(headers.body);
	const collectionName = body.collection_name;


	try{

		let response = {
	        body: {
				'pResetCollectionName': '',
				'pResetError': [],
				'pResetInserted': 0,
				'pResetSkipped': 0,
				'pResetUpdated': 0
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

	  	// resetting p if applicable




		let returnValue = await wixData.query(collectionName).limit(1000).find(options).then((results) => {
			let collectionItems = results.items;
			// response.body.pResetCollection = collectionItems;

			if (collectionItems.length > 0){
			  // reset p value as empty string
			  for (let i in collectionItems){
				  collectionItems[Number(i)].p = '';
				  // delete collectionItems[Number(i)]._owner;
				  // delete collectionItems[Number(i)]._createdDate;
				  // delete collectionItems[Number(i)]._updatedDate
			  }
			}

			return wixData.bulkUpdate(collectionName, collectionItems, options)
				.then((results) => {

					response.body.pResetCollectionName = collectionName;
					response.body.pResetErrors = results.errors;
					response.body.pResetInserted = results.inserted;
					response.body.pResetSkipped = results.skipped;
					response.body.pResetUpdated = results.updated;

					if (results.errors.length > 0){
						return badRequest(response);
					}
					else{
						return ok(response);
					}
				}).catch((error) => {
					let response = {
	    				body: {
							'error': error
	    				  },
	    				headers: {
	    				    "Content-Type": "application/json"
	    		  		}
	    			};
					return error(response);
				});

		}).catch((error) => {
			let response = {
	    		body: {
					'error': error
	    		  },
	    		headers: {
	    		    "Content-Type": "application/json"
	      		}
	    	};
			return error(response);
		});

		return returnValue;


	}
	catch (error){

		let response = {
	        body: {
	          	"ErrorWhileResettingP": {},

	          },
	        headers: {
	            "Content-Type": "application/json"
	          }
	    };

		response.body.ErrorWhileResettingP = error;

		return error(response);

	}

}



export async function get_removePlessAll(request){

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

	const body = JSON.parse(headers.body);
	const collectionName = body.collection_name;

	let response = {
	        body: {
				'removePlessCollectionName': '',
				'noOfItemsRemoved': 0,
    			// 'removedItemIDs': ,
    			'noOfItemsSkipped': 0,
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

	try{

		return wixData.query(collectionName).limit(1000).find(options)
		.then((results) => {

			let queryAllItems = results.items;

			// remove all items with p from queryAllItems
			if (queryAllItems.length > 0){

				let itemCounter = 0;

				while (itemCounter < queryAllItems.length){

					var currentItem = queryAllItems[0];

					// keep all items without p in list of items to remove
					if (currentItem.p == ''){
						queryAllItems.push(currentItem._id);
						queryAllItems.shift();
					}
					// remove all items with p from list of items
					else if (currentItem.p == 'p'){
						queryAllItems.shift();
					}

					itemCounter += 1;
				}

			}

			let listOfItemsToRemoveIDs = queryAllItems; // it's filtered version

			return wixData.bulkRemove(collectionName, listOfItemsToRemoveIDs)
			.then((results) => {

				let removed = results.removed; // 2
    			let removedIds = results.removedItemIds;
    			let skipped = results.skipped; // 0

				response.body.removePlessCollectionName = collectionName;
				response.body.noOfItemsRemoved = removed;
    			response.body.noOfItemsSkipped = skipped;

				return ok(response);

			}).catch ((error) => {

      			let response = {

      			  body: {
      			    "errorWhileBulkRemovingNonPs": error,
      			    },

      			    headers: {
      			      "Content-Type": "application/json"
      			    }
      			}

				  return error(response);

			  });

		}).catch ((error) => {

      		let response = {
      		  body: {
      		    "error": error,
      		    },
      		    headers: {
      		      "Content-Type": "application/json"
      		    }
      		};

      		return error(response)});


	}catch (error){

		let response = {
	        body: {
	          	"ErrorWhileRemovingPlessAll": {},

	          },
	        headers: {
	            "Content-Type": "application/json"
	          }
	    };

		response.body.ErrorWhileRemovingPlessAll = error;

		return error(response);

	}

}







// ADD DATA TO DATABASE..
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

	// ACCESSING AND SETTING ROW DATA
  	var insertRow = JSON.parse(headers.body);
  	const collectionName = insertRow.collectionName;
  	const rowDataToInsert = insertRow.rowData;

  	// SETTING P
	rowDataToInsert.p = 'p';


  	const currentRowsProductLink = rowDataToInsert.productLink;

	const currentRowsImageLink = rowDataToInsert.imageSrc;

  	let currentRowsProductPrice = rowDataToInsert.price;

  	let isResetP = JSON.parse(headers.is_reset_p);


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
          	"collectionName": collectionName, //
		  	'isAndHasResetPValueForAll': null, //
		  	'pValue': '', // update during updates or insertion
		  	// 'pResetCollection': {},
		  	// 'resetPValueResult': {},
          	// "rowDataToInsert": typeof(rowDataToInsert),
          	'rowAlreadyExists': false,
		  	'rowAddedToDB': false,
		  	// 'popularityTagExist': false,
		  	// 'popularityTagAdded': false,
          	'productPriceOriginal': JSON.parse(JSON.stringify(rowDataToInsert.price)),
          	'productPriceConverted': '',
		  	'imageSrc': '', //
		  	'codifiedUrlLength': 0,
          	// 'codifiedUrl': '',
		  	'isAddedOrUpdatedToCollection': {},
		  	'UpdateCollectionResult': {},
		  	'isProductLinkDBEqualscurrentRowsProductLink' : null,
		  	'pResetCollectionName': '',
			'pResetError': [],
			'pResetInserted': 0,
			'pResetSkipped': 0,
			'pResetUpdated': 0
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

		response.body.imageSrc = currentRowsImageLink;

        return wixData.query(collectionName).eq("imageSrc", currentRowsImageLink).find(options)
        .then((results) => {

			// response.body.isAddedOrUpdatedToCollection = results.items;

			let queryResult = results.items;
			let codifiedUrl = codifyUrl(rowDataToInsert.productLink);

			let isProductLinkDBEqualscurrentRowsProductLinkList = [];

			let listOfItemsToUpdate = [];

			// CHECK AND TRY ADDING PRODUCT DATA IN DB..
        	if(results.items.length > 0) {

				let currentDBItemCount = 0;

				// update existing rowData's productLink, price, and p
				while(currentDBItemCount < queryResult.length) {

					let currentDBItemToUpdate = queryResult[currentDBItemCount];

					// let imgSrcDB = value.imageSrc;
					let productLinkDB = currentDBItemToUpdate.productLink;

					let isProductLinkDBEqualscurrentRowsProductLink = (stripUrlInitials(decodeCodifiedUrl(productLinkDB)) == stripUrlInitials(currentRowsProductLink));

					isProductLinkDBEqualscurrentRowsProductLinkList.push(isProductLinkDBEqualscurrentRowsProductLink);

					// if product link in database is equal to current row to be inserted or updated's product link,
					// update relative row in db's product link, price and p..
					if (stripUrlInitials(decodeCodifiedUrl(productLinkDB)) == stripUrlInitials(currentRowsProductLink)){

						currentDBItemToUpdate.productLink = codifiedUrl;
						currentDBItemToUpdate.price = rowDataToInsert.price;
						currentDBItemToUpdate.p = rowDataToInsert.p;
					  	// delete currentDBItemToUpdate._owner;
					  	// delete currentDBItemToUpdate._createdDate;
					 	// delete currentDBItemToUpdate._updatedDate;

						// setting response attributes before updating
						// response.body.isAddedOrUpdatedToCollection = results.items;
        	  			response.body.rowAlreadyExists = true;
			  			// response.body.popularityTagExist = true;
			  			// response.body.codifiedUrlLength = 'N/A -> Already added';
						response.body.codifiedUrlLength = codifiedUrl.length; //

						response.body.isProductLinkDBEqualscurrentRowsProductLink = isProductLinkDBEqualscurrentRowsProductLinkList;

						listOfItemsToUpdate.push(currentDBItemToUpdate)

					}

					currentDBItemCount += 1;



				}

				// bulk update relative row in db
				return wixData.bulkUpdate(collectionName, listOfItemsToUpdate, options)
				.then((results) => {

					response.body.pResetCollectionName = collectionName;
					response.body.pResetErrors = results.errors;
					response.body.pResetInserted = results.inserted;
					response.body.pResetSkipped = results.skipped;
					response.body.pResetUpdated = results.updated;

					// setting attributes below by derivation
					response.body.pValue = rowDataToInsert.p //
					response.body.isAndHasResetPValueForAll = isResetP;
					response.body.isAddedOrUpdatedToCollection = true;
					response.body.UpdateCollectionResult = results;

					// let returned = results;

					// response.body.sizeAdded = returned.size;

					return ok(response);

					//. if (returned.length)

				}).catch((error) => {

					let response = {
	        			body: {
							'error': error
	        			  },
	        			headers: {
	        			    "Content-Type": "application/json"
	        	  		}
	    			};

					return error(response);
				});



				// return ok(response);


        	}
        	else{

				rowDataToInsert.productLink = codifiedUrl;

				// INSERT PRODUCT DATA IN DB..
        	  	 return wixData.insert(collectionName, rowDataToInsert, options)
        	  	.then((itemValue) => {

        	  	  	let item = itemValue;
        	  	  	// response.body.item = itemValue;

        	  	  	response.body.rowAddedToDB = true;
					response.body.isAndHasResetPValueForAll = isResetP;
					response.body.codifiedUrlLength = codifiedUrl.length;
					response.body.isAddedOrUpdatedToCollection = true;

					// final return 2
        	  	  	return ok(response);

        	  	})
				// .then((ProductInsertionToDBResponseValue) => {
				//
				// 	// THEN INSERT POPULARITY TRACK FOR THE CURRENT PRODUCT AS WELL IF IT HAS NOT ALREADY BEEN ADDED..
				// 	let codifiedUrl = codifyUrl(currentRowsProductLink);
				// 	response.body.codifiedUrlLength = String(codifiedUrl.length);
				//
				// 	return wixData.query(collectionName + 'Popularity').eq("locale", codifiedUrl).find(options)
				// 	.then((results) => {
				//
				// 		if(results.items.length > 0) {
				//
				// 			response.body.popularityTagExist = true;
				//
				// 			return ok(response);
				//
				//
        		// 		}
				// 		else{
				//
				// 			// response.body.codifiedUrl = codifiedUrl;
				//
				// 			let popularityData = {
				// 				'locale': codifiedUrl,
				// 				'numberOfVisits': 0
				// 			};
				//
				// 			return wixData.insert(collectionName + 'Popularity', popularityData, options)
				// 			.then((value) => {
				//
				// 					response.body.popularityTagAdded = true;
				//
				// 					return ok(response);
				//
				// 				// else {
				// 				//
				// 				// 	response.body.popularityTagAdded = false;
				// 				//
				// 				// 	return ok(response);
				// 				//
				// 				// }
				//
				// 			});
				//
				//
				//
				//
				// 		}
				//
				// 	});
				//
				// });
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


// format price rightly..
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

function stripUrlInitials(urlString){


	if (urlString.includes('https://www.')){
		urlString = urlString.replace('https://www.', '');
	}
	else if (urlString.includes('https://')){
		// console.log('replacing https://');
		urlString = urlString.replace('https://', '');
	}
	else if (urlString.includes('http://www.')){
		urlString = urlString.replace('http://www.', '');
	}
	else if (urlString.includes('http://')){
		urlString = urlString.replace('http://', '');
	}

	return urlString;


}

// codification of string
function codifyUrl(urlString){

	if (urlString.includes('https://www.')){
		urlString = urlString.replace('https://www.', '');
	}
	else if (urlString.includes('https://')){
		// console.log('replacing https://');
		urlString = urlString.replace('https://', '');
	}
	else if (urlString.includes('http://www.')){
		urlString = urlString.replace('http://www.', '');
	}
	else if (urlString.includes('http://')){
		urlString = urlString.replace('http://', '');
	}

	// console.log('urlStirng length: ' + urlString.length);

	// let alpha = 'abcdefghijklmnopqrstuvwxyz';
	let alphaCodes = [];
	// let additives = ["|", "!", 'I', '$', '£', ':', ")", '&', '%', 'œ', '∆', '†', ' ', '√', 'µ', '∫', '√', 'Ω', "  ", ]

	// 1. char to alpha code..
	for (let i in urlString){
		let alphaCode = String.fromCharCode(urlString.charCodeAt(Number(i)) + 128);
		// console.log(urlString[Number(i)]);
		// if (alphaCode == ''){
		// 	alphaCode = String.fromCharCode()
		// }
		alphaCodes.push(alphaCode);
	}

	// a = alphaCodes.join('');


	// console.log('alphacode pre: ' + alphaCodes);
	// let rec = [];
	// alphaCodes = JSON.parse(JSON.stringify((alphaCodes)));
	// var look = JSON.parse(JSON.stringify((alphaCodes.join(''))));
	//
	// console.log('look: ' + look);
	//
	// for (let i in look){
	// 	let alphaCode = String.fromCharCode(look.charCodeAt(Number(i)) - 128);
	// 	// if (alphaCode == ''){
	// 	// 	alphaCode = String.fromCharCode()
	// 	// }
	// 	rec.push(alphaCode);
	// }
	//
	// console.log('alphacode post: ' + rec.join(''));



	//


	// 2. sum of alpha codes.. (hard to revert)
	// let sumAlphaCodesToList = String(alphaCodes.reduce((partialSum, a) => partialSum + a, 0)).split('');
	// console.log('sumAlphaCodesToList: ' + sumAlphaCodesToList);

	// 3. obtaining approx midpoint of url to approx end of url from alpha codes..
	// let alphaCodesMid = Math.round(alphaCodes.length / 1.8) ;
	// let alphaCodesMidPlusStop = alphaCodes.length - Math.round(0.134 * alphaCodes.length);
	// let alphaCodesMidPlus = alphaCodes.slice(alphaCodesMid, alphaCodesMidPlusStop); // codes midpoint plus
	let tagLong = []
	// console.log('alphaCodesMidPlus: ' + alphaCodesMidPlus);

	let originalAlphaCodes = JSON.parse(JSON.stringify(alphaCodes));
	alphaCodes.reverse();
	let originalLengthAlpahCodes = JSON.parse(JSON.stringify(alphaCodes.length));


	let opTrack = 0;

	let tlIndex = 0;

	// 4 populate tagLong
	while (opTrack < originalLengthAlpahCodes){

		// console.log('here1');


		// let randomNum = generateRandomNumber(alphaCodes.length - 1, 0);
		let randomAlphaCodeOne = '';
		let randomAlphaCodeTwo = '';

		while (randomAlphaCodeOne == '' && randomAlphaCodeTwo == ''){
			randomAlphaCodeOne = originalAlphaCodes[generateRandomNumber(originalAlphaCodes.length - 1, 0)];
			randomAlphaCodeTwo = originalAlphaCodes[generateRandomNumber(originalAlphaCodes.length - 1, 0)];
		}

		// console.log('here2');

		// console.log('randomNum: ' + randomNum);

		let randomCharOne = generateAlphaNumbericRandomChar();
		let randomCharTwo = generateAlphaNumbericRandomChar();

		let midCode = randomCharOne + randomAlphaCodeOne + randomCharTwo + randomAlphaCodeTwo;

		alphaCodes.splice(tlIndex, 0, midCode);
		tlIndex += 2;
		opTrack += 1;

		// console.log('tlIndex: ' + tlIndex);
		// console.log('opTrack: ' + opTrack);
		// tagLong.push(midCode.length);
	}

	// console.log('length post midC' + alphaCodes.length);

	// 4. randomize alphacodes midplus..
	let randomizedMidPlus = [];


	// 5. the 5th end
	// let cursor = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@£$%^&*()_+œ∑´®†¥¨^øπ“‘ßå∂ƒ©˙∆˚¬…æΩ≈ç√∫~µ≤≥÷';
	let cursor = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ¡™#¢∞§¶•ªº–≠ÍÎÏÌÓÔÒ…Æ«ÛÙÇ◊ıˆ˜≤≥÷';
	let count = 0;


	while (count < 5){
		alphaCodes.push(cursor[generateRandomNumber(cursor.length -1, 0)]);

		count += 1;
	}

	// 6. 75%
	count = 0;
	let sI =  Math.floor(alphaCodes.length * .75);


	while (count < 5){
		alphaCodes.splice(sI, 0, cursor[generateRandomNumber(cursor.length -1, 0)]);

		count += 1;
		sI += 2;
	}


	// 7. 50%
	count = 0;
	let mid = Math.floor(alphaCodes.length / 2);


	while (count < 5){
		alphaCodes.splice(mid, 0, cursor[generateRandomNumber(cursor.length -1, 0)]);

		count += 1;
		mid += 2;
	}


	// 8. 25%
	count = 0;
	let sII =  Math.floor(alphaCodes.length * .25);


	while (count < 5){
		alphaCodes.splice(sII, 0, cursor[generateRandomNumber(cursor.length -1, 0)]);

		// console.log('SII', count, sII + count, alphaCodes[sII + count]);

		count += 1;
		sII += 2;
	}

	// console.log('all alphaCodes: ' +(alphaCodes));
	// console.log('all length at SII: ' +(alphaCodes.length));







	let codifiedUrl = alphaCodes.join('');

	// console.log('url length: ' + urlString.length);

	// console.log('alphaCodes joined: ' + codifiedUrl);
	// console.log('alphaCodes joined length: ' + codifiedUrl.length);

	// console.log('alphaCodes: ' + alphaCodes);
	// console.log('alphaCodes length: ' + alphaCodes.length);

	// console.log('tagLong: ' + tagLong);
	// console.log('tagLong length: ' + tagLong.length);

	// console.log('alphaCode 73: ' + alphaCodes[73]);

	return JSON.parse(JSON.stringify(codifiedUrl));

}


// generate a random non alphanumeric non space character..
function generateAlphaNumbericRandomChar(){

	let randomNonAlphaNumbericNonSpaceCharacter = '';

	let numRange = [Math.ceil(48), Math.floor(57)];
	let lowerCase = [Math.ceil(97), Math.floor(122)];
	let upperCase = [Math.ceil(65), Math.floor(90)];

	let listCases = [numRange, lowerCase, upperCase];

	let minListCases = Math.ceil(0);
	let maxListCases = Math.floor(2);

	let randomListCaseIndex = generateRandomNumber(minListCases, maxListCases);
	let randomListCase = listCases[randomListCaseIndex];

	let min = randomListCase[0];
	let max = randomListCase[1];

	let randomCharOne = String.fromCharCode(Math.floor( Math.random() * ( max - min) + min));

	while (randomCharOne.includes(' ')){
		randomCharOne = String.fromCharCode(Math.floor( Math.random() * (max - min) + min));
	}

	return randomCharOne;

}

function generateRandomNumber(max, min){

	return Math.floor( Math.random() * ( max - min) + min)
}

// decode codified url
function decodeCodifiedUrl(codifiedUrl) {

	if (codifiedUrl.includes('https://www.')){
		codifiedUrl = codifiedUrl.replace('https://www.', '');
	}
	else if (codifiedUrl.includes('https://')){
		// console.log('replacing https://');
		codifiedUrl = codifiedUrl.replace('https://', '');
	}
	else if (codifiedUrl.includes('http://www.')){
		codifiedUrl = codifiedUrl.replace('http://www.', '');
	}
	else if (codifiedUrl.includes('http://')){
		codifiedUrl = codifiedUrl.replace('http://', '');
	}

	let urlLength = (codifiedUrl.length - 20) / 5;
	let lengthPreSII = Math.floor(((urlLength * 2) + 15) * .25);
	let lengthPreMid = Math.floor(((urlLength * 2) + 10) * .50);
	let lengthPreSI = Math.floor(((urlLength * 2) + 5)* .75);

	// convert codifiedUrl string to array
	// let counter = 0;
	// console.log('codifiedUrl: ' + codifiedUrl.length);

	// 0 to first block;


	let shiftCounter = 0;
	let codifiedUrlListIndexCounter = 0;
	let unfinishedBusiness = false;

	let codifiedUrlList = [];
	let codifiedUrlListUnpack = {};

	let codifiedUrlListLastBlock = (urlLength * 2);

	// generate codifiedUrlList
	// 1. codifiedUrlList to first unblock
	codifiedUrlListUnpack = generateCodifiedListPercent(
		shiftCounter,
		codifiedUrl,
		codifiedUrlList,
		codifiedUrlListIndexCounter,
		lengthPreSII,
		true,
		unfinishedBusiness
	);

	// 2. codifiedUrlList to second unblock
	codifiedUrlListUnpack = generateCodifiedListPercent(
		codifiedUrlListUnpack['currentShiftCounterValue'],
		codifiedUrl,
		codifiedUrlListUnpack['codifiedUrlListRecentValue'],
		codifiedUrlListUnpack['codifiedUrlListIndexCounter'],
		lengthPreMid,
		true,
		codifiedUrlListUnpack['unfinishedBusinessBooleanValue']
	);

	// 3. codifiedUrlList to third unblock
	codifiedUrlListUnpack = generateCodifiedListPercent(
		codifiedUrlListUnpack['currentShiftCounterValue'],
		codifiedUrl,
		codifiedUrlListUnpack['codifiedUrlListRecentValue'],
		codifiedUrlListUnpack['codifiedUrlListIndexCounter'],
		lengthPreSI,
		true,
		codifiedUrlListUnpack['unfinishedBusinessBooleanValue']
	);

	// 4. codifiedUrlList full list
	codifiedUrlListUnpack = generateCodifiedListPercent(
		codifiedUrlListUnpack['currentShiftCounterValue'],
		codifiedUrl,
		codifiedUrlListUnpack['codifiedUrlListRecentValue'],
		codifiedUrlListUnpack['codifiedUrlListIndexCounter'],
		codifiedUrlListLastBlock,
		false,
		codifiedUrlListUnpack['unfinishedBusinessBooleanValue']
	);

	codifiedUrlList = codifiedUrlListUnpack['codifiedUrlListRecentValue'];


	// console.log('full list: ' + codifiedUrlList);

	// dequeue mid..

	// let countNoOfDeletedItems = 0;
	let codifiedUrlListlength = JSON.parse(JSON.stringify(codifiedUrlList.length));
	let currentIndex = 0;

	while (currentIndex < codifiedUrlListlength){

		let currentItem = codifiedUrlList[0];
		// console.log('current item: ' + currentItem);
		let countNumberOfTimesHere = 1;

		// console.log('String.fromCharCode(currentItem.charCodeAt(0) - 128)' + String.fromCharCode(currentItem.charCodeAt(0) - 128));

		if (currentItem.length == 1){
			// console.log('currentItem.length == 1: ' + currentItem.length);
			// console.log('number of times here: ' + countNumberOfTimesHere);
			let c = String.fromCharCode(currentItem.charCodeAt(0) - 128);
			// console.log('b');
			codifiedUrlList.push(c);
			codifiedUrlList.shift();
		}
		else if (currentItem.length > 1){
			// console.log('currentItem.length > 1: ' + currentItem.length)
			codifiedUrlList.shift();
		}

		currentIndex += 1;

	}


	codifiedUrlList.reverse();

	let returnValue = 'https://www.' + codifiedUrlList.join('');

	// console.log(returnValue);

	return returnValue;

}


function generateCodifiedListPercent(
	currentShiftCounterValue,
	codifiedUrl,
	codifiedUrlListRecentValue,
	codifiedUrlListIndexCounter,
	blockInFocusInputIndex,
	applyUnblock,
	unfinishedBusinessBooleanValue
){

	// let shiftCounter = currentShiftCounterValue;
	// let codifiedUrlList = codifiedUrlListRecentValue;


	// obataining the length of the las item in codifiedUrlList if applicable..
	let isLastCodifiedUrlListItemsLengthAfterUnblockEqualToOne = false;
	let isLastCodifiedUrlListItemsLengthAfterUnblockGreaterThanOne = false;

	// if the current printing point is not the start of the codified url and codifiedUrlList has been populated to an unblocking,
	// check if the last unblocked item's (string) length is equal to 1.. useful after each unblock
	if (currentShiftCounterValue != 0 && codifiedUrlListRecentValue.length > 0){

		// codifiedUrlListIndexCounter = codifiedUrlListIndexCounter - 1;




		// console.log('codifiedUrlListRecentValue length: ' + codifiedUrlListRecentValue.length);
		// console.log('codifiedUrlListIndexCounter: ' + codifiedUrlListIndexCounter);
		// console.log('Item at codifiedUrlListIndexCounter: ' + codifiedUrlListRecentValue[codifiedUrlListIndexCounter - 1]);
		// console.log('currentShiftCounterValue: ' + currentShiftCounterValue);
		// console.log('Item at currentShiftCounterValue: ' + codifiedUrl[currentShiftCounterValue]);


		let lengthOfLastItem = codifiedUrlListRecentValue[codifiedUrlListIndexCounter - 1].length;

		if (lengthOfLastItem == 1){
			isLastCodifiedUrlListItemsLengthAfterUnblockEqualToOne = true;
			// isLastCodifiedUrlListItemsLengthAfterUnblockGreaterThanOne = false
		}
		else if (lengthOfLastItem > 1){
			isLastCodifiedUrlListItemsLengthAfterUnblockGreaterThanOne = true;
			// isLastCodifiedUrlListItemsLengthAfterUnblockEqualToOne = false
		}
	}

	if (currentShiftCounterValue == 0 || (currentShiftCounterValue != 0 && isLastCodifiedUrlListItemsLengthAfterUnblockEqualToOne == true)){

		while (codifiedUrlListIndexCounter < blockInFocusInputIndex && unfinishedBusinessBooleanValue == false){

			// console.log('in equal to one');

			let tai = codifiedUrl[currentShiftCounterValue] + codifiedUrl[currentShiftCounterValue + 1] + codifiedUrl[currentShiftCounterValue + 2] + codifiedUrl[currentShiftCounterValue + 3];
			let c = codifiedUrl[currentShiftCounterValue + 4];

			if (codifiedUrlListIndexCounter == blockInFocusInputIndex){
				unfinishedBusinessBooleanValue = true;
			}

			codifiedUrlListRecentValue.push(tai);
			codifiedUrlListIndexCounter += 1;
			currentShiftCounterValue += 4;

			if (codifiedUrlListIndexCounter != blockInFocusInputIndex){
				codifiedUrlListRecentValue.push(c);
				codifiedUrlListIndexCounter += 1;
				currentShiftCounterValue += 1;
			}else{
				// currentShiftCounterValue += 1;
				unfinishedBusinessBooleanValue = true;
			}
		}
	}

	else if ((currentShiftCounterValue != 0 && isLastCodifiedUrlListItemsLengthAfterUnblockGreaterThanOne == true)){

		while (codifiedUrlListIndexCounter < blockInFocusInputIndex && unfinishedBusinessBooleanValue == false){

			// console.log('in greater than');

			let c = codifiedUrl[currentShiftCounterValue];
			let tai = codifiedUrl[currentShiftCounterValue + 1] + codifiedUrl[currentShiftCounterValue + 2] + codifiedUrl[currentShiftCounterValue + 3] + codifiedUrl[currentShiftCounterValue + 4];

			// if codifiedUrlListIndexCounter is same as blockInFocusInputIndex i.e prog has gotten to index of stoppage,
			// don't add the fourth sequence i.e the next index, rather signify that the fourth
			// sequence or the next index has not been added

			// console.log('codifiedUrlListIndexCounter: ' + codifiedUrlListIndexCounter);
			// console.log('blockInFocusInputIndex: ' + blockInFocusInputIndex);

			if (codifiedUrlListIndexCounter == blockInFocusInputIndex){
				unfinishedBusinessBooleanValue = true;
			}

			codifiedUrlListRecentValue.push(c);
			codifiedUrlListIndexCounter += 1;
			currentShiftCounterValue += 1;

			if (codifiedUrlListIndexCounter != blockInFocusInputIndex){
				codifiedUrlListRecentValue.push(tai);
				codifiedUrlListIndexCounter += 1;
				currentShiftCounterValue += 4;
			}else{
				// currentShiftCounterValue += 1;
				unfinishedBusinessBooleanValue = true;
			}


		}

		// console.log('codifiedUrlListIndexCounter: ' + codifiedUrlListIndexCounter);
		// console.log('blockInFocusInputIndex: ' + blockInFocusInputIndex);


	}

	// unblocking
	if (applyUnblock == true){

		// first block to next start
		if (unfinishedBusinessBooleanValue == true){
			// console.log('IN TRUE');
			// console.log('Pre Block Item shiftCounterValue: ' + codifiedUrl[currentShiftCounterValue - 1]);
			// console.log('Block identified at at shiftCounterValue: ' + codifiedUrl[currentShiftCounterValue]);
			// console.log('Post Block Item shiftCounterValue: ' + codifiedUrl[currentShiftCounterValue + 1]);
			// console.log('');

			// let currentShiftCounterValueTwo = currentShiftCounterValue;

			// let indexToStartFrom = codifiedUrlListIndexCounter;
			let doNum = 0;

			while (doNum < 5){

				// console.log('codifiedUrlListRecentValue: ' + codifiedUrlListRecentValue);
				// console.log('codifiedUrlListRecentValueLength: ' + codifiedUrlListRecentValue.length);
				let lengthOfItemBeforeBlock = codifiedUrlListRecentValue[codifiedUrlListIndexCounter - 1].length;

				let block = codifiedUrl[currentShiftCounterValue];
				let next = '';

				if (lengthOfItemBeforeBlock > 1){
					next = codifiedUrl[currentShiftCounterValue + 1];
					codifiedUrlListRecentValue.push(next);
					codifiedUrlListIndexCounter += 1;
					currentShiftCounterValue += 2; // next block sequence to be focused on..
				}
				else if (lengthOfItemBeforeBlock == 1){
					next = codifiedUrl[currentShiftCounterValue + 1] + codifiedUrl[currentShiftCounterValue + 2] + codifiedUrl[currentShiftCounterValue + 3] + codifiedUrl[currentShiftCounterValue + 4];
					codifiedUrlListRecentValue.push(next);
					codifiedUrlListIndexCounter += 1;
					currentShiftCounterValue += 5;
				}

				doNum += 1;

			}


		}

		else if (unfinishedBusinessBooleanValue == false){
			// console.log('IN FALSE');
			// console.log('Pre Block Item shiftCounterValue: ' + codifiedUrl[currentShiftCounterValue - 1]);
			// console.log('Block identified at at shiftCounterValue: ' + codifiedUrl[currentShiftCounterValue]);
			// console.log('Post Block Item shiftCounterValue: ' + codifiedUrl[currentShiftCounterValue + 1]);
			// console.log('');

			// codifiedUrlListIndexCounter += 1;

			// let currentShiftCounterValueTwo = currentShiftCounterValue;

			let indexToStartFrom = codifiedUrlListIndexCounter;

			// console.log('codifiedUrlListRecentValue: ' + codifiedUrlListRecentValue);
			// console.log('codifiedUrlListRecentValueLength: ' + codifiedUrlListRecentValue.length);
			// let lengthOfItemBeforeBlock = codifiedUrlListRecentValue[codifiedUrlListIndexCounter - 1].length;

			let doNum = 0;

			while (doNum < 5){

				// console.log('codifiedUrlListRecentValue: ' + codifiedUrlListRecentValue);
				// console.log('codifiedUrlListRecentValueLength: ' + codifiedUrlListRecentValue.length);
				let lengthOfItemBeforeBlock = codifiedUrlListRecentValue[codifiedUrlListIndexCounter - 1].length;

				let block = codifiedUrl[currentShiftCounterValue];
				let next = '';

				if (lengthOfItemBeforeBlock == 1){

					next = codifiedUrl[currentShiftCounterValue + 1] + codifiedUrl[currentShiftCounterValue + 2] + codifiedUrl[currentShiftCounterValue + 3] + codifiedUrl[currentShiftCounterValue + 4];
					codifiedUrlListRecentValue.push(next);
					codifiedUrlListIndexCounter += 1;
					currentShiftCounterValue += 5; // next block sequence to be focused on..

				}
				else if (lengthOfItemBeforeBlock > 1){

					next = codifiedUrl[currentShiftCounterValue + 1];
					codifiedUrlListRecentValue.push(next);
					codifiedUrlListIndexCounter += 1;
					currentShiftCounterValue += 2; // next block sequence to be focused on..

				}

				doNum += 1;

			}

		}

		unfinishedBusinessBooleanValue = false;

	}

	// console.log('gen: ' + codifiedUrlListRecentValue);

	return {
		'currentShiftCounterValue': currentShiftCounterValue,
		'codifiedUrlListRecentValue': codifiedUrlListRecentValue,
		'codifiedUrlListIndexCounter': codifiedUrlListIndexCounter,
		'blockInFocusInputIndex': blockInFocusInputIndex,
		'unfinishedBusinessBooleanValue': unfinishedBusinessBooleanValue
	}

}