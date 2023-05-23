// Everything from codifyUrl downwards has been removed

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


// To be used only when all products listing from all partner brands for the day have been updated or uploaded
// To avoid mal-updates (& products desappearnace)
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
				'queryResult': {},
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

			var listOfIDsOfItemsToRemove = [];


			// remove all items with p from queryAllItems
			if (queryAllItems.length > 0){

				let itemCounter = 0;

				while (itemCounter < queryAllItems.length){

					var currentItem = queryAllItems[itemCounter];

					// keep all items without p in list of items to remove
					if (currentItem.p != 'p'){
						listOfIDsOfItemsToRemove.push(currentItem._id);
					}

					itemCounter += 1;
				}

			}

			response.body.queryResult = listOfIDsOfItemsToRemove.length;


			// let listOfItemsToRemoveIDs = listOfIDsOfItemsToRemove; // it's filtered version

			return wixData.bulkRemove(collectionName, listOfIDsOfItemsToRemove, options)
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

	const currentRowsTitle = rowDataToInsert.title;
	const currentRowsProductCategory = rowDataToInsert.productcategory;
  	const currentRowsProductLink = rowDataToInsert.productlink;
	const currentRowsImageLink = rowDataToInsert.imagesrc;
  	var currentRowsProductPrice = rowDataToInsert.price;
	var  currentRowsProductGender = rowDataToInsert.gender;

	var currentRowsBaseProductLinksId = rowDataToInsert.baseproductlinksid;
	var currentRowsBaseImageSrcsId = rowDataToInsert.baseimagesrcsid;


  	var isResetP = JSON.parse(headers.is_reset_p);
	var currentRowsIsProductLinkUpdated = JSON.parse(headers.is_product_link_updated);
	var currentRowsIsImageSrcUpdated = JSON.parse(headers.is_image_src_updated);


	var eqColumnName = '';
	var eqColumnValue = '';

	// appropriately setting query parameters to search for existing product data or rows (if any)
	if (currentRowsIsProductLinkUpdated == true){

		eqColumnName = 'baseproductlinksid';
		eqColumnValue = currentRowsBaseProductLinksId;
	}
	else if (currentRowsIsImageSrcUpdated == true){

		eqColumnName = 'baseimagesrcsid';
		eqColumnValue = currentRowsBaseImageSrcsId;

	}
	else{

		eqColumnName = "imagesrc";
		eqColumnValue = currentRowsImageLink;
	}


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

			'currentRowsIsProductLinkUpdated': currentRowsIsProductLinkUpdated,
			'currentRowsIsProductLinkUpdatedType': typeof(currentRowsIsProductLinkUpdated),
			'currentRowsBaseProductLinksId': currentRowsBaseProductLinksId,

			'currentRowsIsImageSrcUpdated': currentRowsIsImageSrcUpdated,
			'currentRowsIsImageSrcUpdatedType': typeof(currentRowsIsImageSrcUpdated),
			'currentRowsBaseImageSrcsId': currentRowsBaseImageSrcsId,

			'eqColumnName': eqColumnName,
			'eqColumnNameType': typeof(eqColumnName),
			'eqColumnValue': eqColumnValue,
			'eqColumnValueType': typeof(eqColumnValue),
			'queryResult': {},
			'currentRowsProductGender': {},
			'isCurrentRowProductGenderInQueryResult': {},
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
		  	'imagesrc': '', //
		  	'productLinkLength': 0,
          	// 'productLink': '',
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

		response.body.imagesrc = currentRowsImageLink;

		// get rows that have the same image src, baseProductLinksId, or baseImageSrcsId to ensure existing
		// product info can be updated..
        return wixData.query(collectionName).eq(eqColumnName, eqColumnValue).find(options)
        .then((results) => {

			// response.body.isAddedOrUpdatedToCollection = results.items;

			let queryResult = results.items;
			response.body.queryResult = queryResult;

			let productLink = rowDataToInsert.productlink;

			let isProductLinkDBEqualscurrentRowsProductLinkList = [];

			let listOfItemsToUpdate = [];

			// CHECK AND TRY ADDING PRODUCT DATA IN DB..
			// checks whether or not one of the queryResult(s) absolutely matches the currentrow's data
			var isCurrentRowProductGenderInQueryResult = {};
			let currentDBItemCountPreUpdateTestAndAttempt = 0;


			while(currentDBItemCountPreUpdateTestAndAttempt < queryResult.length) {

				var currentDBRowToAbsoluteCheckGender = queryResult[currentDBItemCountPreUpdateTestAndAttempt];

				if (currentDBRowToAbsoluteCheckGender.gender == currentRowsProductGender){

					isCurrentRowProductGenderInQueryResult = true;

				}

				currentDBItemCountPreUpdateTestAndAttempt += 1;

			}

			response.body.isCurrentRowProductGenderInQueryResult = isCurrentRowProductGenderInQueryResult;
			response.body.currentRowsProductGender = currentRowsProductGender;


			// update existing rowData's productLink, price, and p
        	if(results.items.length > 0 && isCurrentRowProductGenderInQueryResult == true) {

				let currentDBItemCount = 0;

				// update existing rowData's productLink, price, and p
				while(currentDBItemCount < queryResult.length) {

					let currentDBItemToUpdate = queryResult[currentDBItemCount];
					var currentDBItemsGender = currentDBItemToUpdate.gender;

					// let imgSrcDB = value.imageSrc;
					let productLinkDB = currentDBItemToUpdate.productlink;


					let isProductLinkDBEqualscurrentRowsProductLink = productLinkDB == currentRowsProductLink;

					isProductLinkDBEqualscurrentRowsProductLinkList.push(isProductLinkDBEqualscurrentRowsProductLink);

					// if:
					// a. if the product link already exists i.e product link in database is equal to current row to be inserted or updated's product link,
					// b. current row's product link's was updated
					// c. current row's image src was updated,
					// update the current row's in db's product link, price and p..

					// (All in all, update a row (or product data) if it already exists by identifying:
					// a. whether or not the product and image link already exist within a row..
					// b. whether or not an existing product's 'product link' or image src has changed..

					if (
						(productLinkDB == currentRowsProductLink) ||
						// to ensure that only absolutely matching rows in db with the same gender are uploaded
						(currentRowsIsProductLinkUpdated == true && currentDBItemsGender == currentRowsProductGender)||
						(currentRowsIsImageSrcUpdated == true && currentDBItemsGender == currentRowsProductGender)

						){

						currentDBItemToUpdate.title = currentRowsTitle;
						currentDBItemToUpdate.productCategory = currentRowsProductCategory;
						currentDBItemToUpdate.productlink = productLink;
						currentDBItemToUpdate.imagesrc = currentRowsImageLink;
						currentDBItemToUpdate.price = rowDataToInsert.price;
						currentDBItemToUpdate.p = rowDataToInsert.p;
					  	// delete currentDBItemToUpdate._owner;
					  	// delete currentDBItemToUpdate._createdDate;
					 	// delete currentDBItemToUpdate._updatedDate;

						// setting response attributes before updating
						// response.body.isAddedOrUpdatedToCollection = results.items;
        	  			response.body.rowAlreadyExists = true;
			  			// response.body.popularityTagExist = true;
			  			// response.body.productLinkLength = 'N/A -> Already added';
						response.body.productLinkLength = productLink.length; //

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

				rowDataToInsert.productlink = productLink;

				// INSERT PRODUCT DATA IN DB..
        	  	 return wixData.insert(collectionName, rowDataToInsert, options)
        	  	.then((itemValue) => {

        	  	  	let item = itemValue;
        	  	  	// response.body.item = itemValue;

        	  	  	response.body.rowAddedToDB = true;
					response.body.isAndHasResetPValueForAll = isResetP;
					response.body.productLinkLength = productLink.length;
					response.body.isAddedOrUpdatedToCollection = true;

					// final return 2
        	  	  	return ok(response);

        	  	})
				// .then((ProductInsertionToDBResponseValue) => {
				//
				// 	// THEN INSERT POPULARITY TRACK FOR THE CURRENT PRODUCT AS WELL IF IT HAS NOT ALREADY BEEN ADDED..
				// 	let productLink = currentRowsProductLink;
				// 	response.body.productLinkLength = String(productLink.length);
				//
				// 	return wixData.query(collectionName + 'Popularity').eq("locale", productLink).find(options)
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
				// 			// response.body.productLink = productLink;
				//
				// 			let popularityData = {
				// 				'locale': productLink,
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

	if (collectionName == 'Singaporeproducts') {
		console.log('here');

		if ( priceString.includes('SGD$') || priceString.includes('SGD') ){

			let currency = 'S$';
			let amount = priceFloat.toFixed(0);
			convertedPrice = currency + amount;

		}
		else if ( priceString.includes('USD$') || priceString.includes('USD') || priceString.includes('$') ){
			let currency = 'S$';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'USD', 'SGD').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(0));
				// console.log(convertedPrice);
			});
		}
		else if ( priceString.includes(' AED') || priceString.includes('AED') || priceString.includes('د.إ') ){
			let currency = 'S$';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'AED', 'SGD').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(0));
				// console.log(convertedPrice);
			});
		}
		else if ( priceString.includes('EUR') || priceString.includes('€') ){
			let currency = 'S$';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'EUR', 'SGD').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(0));
				// console.log(convertedPrice);
			});
		}
		else if ( priceString.includes('GBP') || priceString.includes('£') ){
			let currency = 'S$';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'GBP', 'SGD').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(0));
				// console.log(convertedPrice);
			});
		}
		else if ( priceString.includes('CAD') || priceString.includes('C$') || priceString.includes('CAD$') ){
			let currency = 'S$';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'CAD', 'SGD').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(0));
				// console.log(convertedPrice);
			});
		}

	}
	else if (collectionName == 'Uaeproducts') {
		console.log('here');

		if ((priceString.includes('د.إ'))){
			let currency = 'AED ';
			let amount = priceFloat;
			convertedPrice = currency + String(amount.toFixed(0));

		}
		else if (priceString.includes('USD$') || priceString.includes('USD') || priceString.includes('$') ){

			let currency = 'AED ';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'USD', 'AED').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(0));
				// console.log(convertedPrice);
			});

		}
		else if ( priceString.includes('SGD$') || priceString.includes('SGD') || priceString.includes('SGD$') || priceString.includes('S$')){

			let currency = 'AED ';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'SGD', 'AED').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(0));
				// console.log(convertedPrice);
			});

		}
		else if ( priceString.includes('EUR') || priceString.includes('€') ){
			let currency = 'AED ';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'EUR', 'AED').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(0));
				// console.log(convertedPrice);
			});

		}
		else if ( priceString.includes('GBP') || priceString.includes('£') ){
			let currency = 'AED ';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'GBP', 'AED').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(0));
				// console.log(convertedPrice);
			});

		}
		else if (priceString.includes('CAD') || priceString.includes('C$') || priceString.includes('CAD$') ){
			let currency = 'AED ';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'CAD', 'AED').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(0));
				// console.log(convertedPrice);
			});

		}

	}
	else if (collectionName == 'Usaproducts') {
		console.log('here');

		if ( priceString.includes('USD') || priceString.includes('USD$') || priceString.includes('US$') ){
			let currency = '$';
			let amount = priceFloat;
			convertedPrice = currency + String(amount.toFixed(0));
		}
		else if ( priceString.includes('AED') || priceString.includes('د.إ') ){

			let currency = '$';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'AED', 'USD').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(0));
				// console.log(convertedPrice);
			});

		}
		else if ( priceString.includes('SGD$') || priceString.includes('SGD') || priceString.includes('SGD$') || priceString.includes('S$')){

			let currency = '$';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'SGD', 'USD').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(0));
				// console.log(convertedPrice);
			});

		}
		else if ( priceString.includes('EUR') || priceString.includes('€') ){
			let currency = '$';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'EUR', 'USD').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(0));
				// console.log(convertedPrice);
			});
		}
		else if ( priceString.includes('GBP') || priceString.includes('£') ){
			let currency = '$';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'GBP', 'USD').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(0));
				// console.log(convertedPrice);
			});
		}
		else if ( priceString.includes('CAD') || priceString.includes('C$') || priceString.includes('CAD$') ){
			let currency = '$';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'CAD', 'USD').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(0));
				// console.log(convertedPrice);
			});
		}

	}

	// UK PRICES - TO GBP
	else if (collectionName == 'Ukproducts') {
		console.log('here');

		if ( priceString.includes('GBP') || priceString.includes('gbp') || priceString.includes('£') || priceString.includes('pound') || priceString.includes('POUND')){
			let currency = '£';
			let amount = priceFloat;
			convertedPrice = currency + String(amount.toFixed(0));
		}
		else if (priceString.includes('USD$') || priceString.includes('USD') || priceString.includes('$') ){

			let currency = '£';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'USD', 'GBP').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(0));
				// console.log(convertedPrice);
			});

		}
		else if ( priceString.includes('AED') || priceString.includes('د.إ') ){

			let currency = '£';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'AED', 'GBP').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(0));
				// console.log(convertedPrice);
			});

		}
		else if ( priceString.includes('SGD$') || priceString.includes('SGD') || priceString.includes('SGD$') || priceString.includes('S$')){

			let currency = '£';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'SGD', 'GBP').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(0));
				// console.log(convertedPrice);
			});

		}
		else if ( priceString.includes('EUR') || priceString.includes('€') ){
			let currency = '£';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'EUR', 'GBP').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(0));
				// console.log(convertedPrice);
			});
		}
		else if ( priceString.includes('CAD') || priceString.includes('C$') || priceString.includes('CAD$') ){
			let currency = '£';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'CAD', 'GBP').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(0));
				// console.log(convertedPrice);
			});
		}

	}

	// EUROPER PRICES
	else if (collectionName == 'Euproducts') {
		console.log('here');

		if ( priceString.includes('EUR') || priceString.includes('eur') || priceString.includes('€')){
			let currency = '€';
			let amount = priceFloat;
			convertedPrice = currency + String(amount.toFixed(0));
		}
		else if (priceString.includes('USD$') || priceString.includes('USD') || priceString.includes('$') ){

			let currency = '€';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'USD', 'EUR').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(0));
				// console.log(convertedPrice);
			});

		}
		else if ( priceString.includes('AED') || priceString.includes('د.إ') ){

			let currency = '€';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'AED', 'EUR').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(0));
				// console.log(convertedPrice);
			});

		}
		else if ( priceString.includes('SGD$') || priceString.includes('SGD') || priceString.includes('SGD$') || priceString.includes('S$')){

			let currency = '€';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'SGD', 'EUR').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(0));
				// console.log(convertedPrice);
			});

		}
		else if ( priceString.includes('GBP') || priceString.includes('£') ){
			let currency = '€';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'GBP', 'EUR').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(0));
				// console.log(convertedPrice);
			});
		}
		else if ( priceString.includes('CAD') || priceString.includes('C$') || priceString.includes('CAD$') ){
			let currency = '€';
			let amount = 0;

			await priceConverterFunction(priceFloat, 'CAD', 'EUR').then((value) => {
				amount = value;
				convertedPrice = currency + String(amount.toFixed(0));
				// console.log(convertedPrice);
			});
		}

	}


	console.log('convertedPrice: ' + convertedPrice);

  if (convertedPrice == ''){

    applicablePriceValue = priceString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // if (collectionName == 'Singaporeproducts'){
    //   applicablePriceValue = 'S$' + String(Number(priceFloat.toFixed(0))).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // }
    // else if (collectionName == 'Uaeproducts'){
    //   applicablePriceValue = 'AED' + String(Number(priceFloat.toFixed(0))).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // }
    // else if (collectionName == 'Usaproducts'){
    //   applicablePriceValue = '$' + String(Number(priceFloat.toFixed(0))).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // }
  }
  else{
    applicablePriceValue = convertedPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  if (applicablePriceValue.includes('£')){

	  applicablePriceValue.replace(' ', '');

  }

	return applicablePriceValue // replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	// else if (usersCountryCode == 'AE'){
	// 	dbCollectionToFocusOn = 'Uaeproducts';
	// 	timeOut = 2500;
	// }
	// else if (usersCountryCode == 'US'){
	// 	dbCollectionToFocusOn = 'Usaproducts';
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