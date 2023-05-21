# lacks location fetching - lacks extreme ip (original)
# secret key edited

# lacks decode url
# orderProducts function has been edited to remove decodeUrl()
# everything from decodeUrl function down had been deleted


// Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction

import wixData from 'wix-data';
import wixLocation from 'wix-location';
import {fetch} from 'wix-fetch';
import wixWindow from 'wix-window';
import wixCrm from 'wix-crm';

// user's country
var usersCountryCode = '';
var usersCountry = '';

// list of all currencies
// var allCurrenciesDict = {}
//
// currencies.getAllCurrencies()
//   .then((listOfAllCurrencies) => {
//
// 	  for (var currencyIndex in listOfAllCurrencies){
//
// 		  console.log(listOfAllCurrencies[currencyIndex].code, listOfAllCurrencies[currencyIndex].symbol)
//
//
// 	  }
//
//     // const firstCurrencyCode = listOfAllCurrencies[0].code;
//     // const firstCurrencyCSymbol = listOfAllCurrencies[0].symbol;
//
//   });

var dbQueryAllResponseItems = [];
/// VARIABLES TO DEFINE FEATURED PRODUCTS

// MEN AND WOMEN
var furnituresMenAndWomen = []; // Furnitures
var furnituresMenAndWomenAmazonless = []

// Main gallery's copy
var mainGalleryCopy = [];

var productsInFocusSortedByRelevanceMobileCopy = [];
var productsInFocusSortedByRelevanceDesktopCopy = [];

var productsInFocusAfterSearch = [];

var orignalLengthOfMobileAndDesktopProductList = 0;

// WOMEN
var recommendedForWomen = [];
var recommendedForWomenAmazonless = [];
var shoesAndMoreWomen = []; // SHOES, & MORE (NECKLACE, EARRING)
var shoesAndMoreWomenAmazonless = [];
var handbagsAndMoreWomen = []; // Bags & Jewelleries (BRACELET , WATCH)
var handbagsAndMoreWomenAmazonless = [];
var clothesAndPerfumesWomen = []; // CLOTHES AND PERFUMES
var clothesAndPerfumesWomenAmazonless = [];
var flowersAndRingsWomen = []; // Rings
var flowersAndRingsWomenAmazonless = [];
var travelBagsAndOtherBagsWomen = []; // TRAVEL BAGS & OTHER BAGS
var travelBagsAndOtherBagsWomenAmazonless = [];
var otherAccessoriesWomen = []; // OTHER ACCESSORIES
var otherAccessoriesWomenAmazonless = [];
var luxuryTechWomen = []; // TECH
var luxuryTechWomenAmazonless = []; // TECH
var giftsForHim = []; // GIFTS FOR HIM (WATCHES, PERFUMES, FLOWERS)
var giftsForHimAmazonless = [];

// MEN
var shoesAndWatchesMen = []; // SHOES AND WATCHES
var shoesAndWatchesMenAmazonless = [];
var necklacesAndBraceletsMen = []; // NECKLACES AND Bracelets
var necklacesAndBraceletsMenAmazonless = [];
var clothesAndPerfumesMen = []; // CLOTHES AND PERFUMES
var clothesAndPerfumesMenAmazonless = [];
var flowersAndRingsMen = []; // Rings
var flowersAndRingsMenAmazonless = [];
var travelBagsAndOtherBagsMen = []; // TRAVEL BAGS & OTHER BAGS
var travelBagsAndOtherBagsMenAmazonless = [];
var otherAccessoriesMen = []; // OTHER ACCESSORIES
var otherAccessoriesMenAmazonless = [];
var luxuryTechMen = []; // TECH
var luxuryTechMenAmazonless = []; // TECH
var giftsForHer = []; // GIFTS FOR HER (WATCHES, PERFUMES, FLOWERS)
var giftsForHerAmazonless = [];

// OTHERS
// var featuredWatches = [];
// var featuredHandbags = [];
// var featuredShoes = [];
// var featuredBelts = [];
// var featuredBracelets = [];
// var featuredFurnitures = [];
// var featuredClothings = [];
// var featuredEarrings = [];
// var featuredPerfumes = [];
// var featuredNecklaces = [];
// var featuredFlowers = [];
// var featuredTravelBags = [];
// var featuredRings = [];
// var featuredBags = [];
// var featuredAccessories = [];

var timeOut = 5000;

async function resolveGalleryItems(){

	var ipLoc = {};

	var dbCollectionToFocusOn = '';

	var eIPURL='https://extreme-ip-lookup.com/json/?key=uLYcH3A5LvgGZm9CKjxM';



	var options = {
      "suppressAuth": true,
      "suppressHooks": true,
    };

	// fetching each featured category's products as per visitor's country..
	return fetch(eIPURL, {
	    method: 'get'
	})
	.then((httpResponse) => {

	   if (httpResponse.ok) {
	      return httpResponse.json();
	   }
	})
	.then((json) => {

		ipLoc = json;

		if (ipLoc.countryCode != ''){

			// user's country
			usersCountry = ipLoc.country;

			console.log(ipLoc.countryCode);

			/// defining collection in focus by user country
			if (ipLoc.countryCode == 'SG') {
				dbCollectionToFocusOn = 'Singaporeproducts';
				usersCountryCode = 'SG';
			}
			else if (ipLoc.countryCode == 'AE'){
				dbCollectionToFocusOn = 'Uaeproducts';
				usersCountryCode = 'AE';
				// timeOut = 2500;
			}
			else{ // ipLoc.countryCode == 'US'
				dbCollectionToFocusOn = 'Usaproducts';
				usersCountryCode = 'US';
			}

			console.log(dbCollectionToFocusOn);



			return dbCollectionToFocusOn;

		}
		else{

			console.error('Error encountered while parsing origin');
		}

	})
	.then((dbCollectionToFocusOn) => {


		// obtaining products as per current country
		return retrieveDatabaseItems(
			dbCollectionToFocusOn,
			options
		);

	});


}

function retrieveDatabaseItems(
	dbCollectionToFocusOn,
	options
){

	return wixData.query(dbCollectionToFocusOn).limit(1000).find(options)
		.then((dbQueryAllResponse) => {

			console.log(dbQueryAllResponse)

			dbQueryAllResponseItems	= dbQueryAllResponse.items;

			// check for and add more results
			while (dbQueryAllResponse.hasNext()) {
    		    dbQueryAllResponse.next().then((nextResult) => {
					dbQueryAllResponseItems = dbQueryAllResponseItems.concat(nextResult.items);
				});
    		}
    		return dbQueryAllResponseItems;

		}).catch((error) => {

			console.log('ERROR LOADING DB!!')
			return error(error);

		});
}

$w.onReady(function () {

// about us button
    $w('#aboutUsText').onClick((event) => {
        wixLocation.to('https://www.askandcarts.com/about-us');
    });

    // terms and conditions button
    $w('#termsAndConditionsText').onClick((event) => {
        wixLocation.to('https://www.askandcarts.com/terms-and-conditions-and-privacy-policy');
    });

    // store policy button
    $w('#privacyPolicyText').onClick((event) => {
        wixLocation.to('https://www.askandcarts.com/terms-and-conditions-and-privacy-policy#privacy-policy');
    });

    // scroll to join newsletter widget if the loading device is a smartphone or tablet
    if (wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet") {

        $w('#section5').hide();
        $w('#recommendedForWomenGallery').hide();
        $w('#mobileLine2').scrollTo();
        // $w('#gallery1').scrollTo();
        $w('#input2').label.bold();

    }

	// Get subscribers (Join) form..
	$w('#getSubscribers1').onWixFormSubmit((event) => {

		console.log('here 1');
		console.log('userInput: ' + $w('#input2').value);
		var userInput = $w('#input2').value;

		setTimeout(() => {

			const contactInfo = {
			  name: {
			    first: " ",
			    last: "Undefined Gender"
			  },
			  emails: [
			    {
			      email: userInput,
			    },
			    {
			      email: userInput
			    }
			  ],

			  phones: [
  				  {
  				    tag: "MOBILE",
  				    countryCode: usersCountryCode,
  				    phone: "once or twice a month",
  				    primary: true
  				  }
  				],

			  addresses: [
    			  {
    			    tag: "HOME",
    			    address: {
    			      formatted: usersCountry,
    			      location: {
    			        latitude: 0,
    			        longitude: 0
    			      },
    			      city: "",
    			      subdivision: "",
    			      country: usersCountryCode,
    			      postalCode: "00000"
    			    }
    			  }
    			],
			};

			console.log('here 2');
			// console.log('contactInfo: ' + contactInfo.phones[0].countryCode);


			wixCrm.contacts.appendOrCreateContact(contactInfo)
		  	.then((resolvedContact) => {
				console.log('resolvedContact ' + resolvedContact);
		  	  	return resolvedContact;
		  	})
		  	.catch((error) => {
		  	  	console.error(error);
		  	});

			console.log('here 3');

		}, 500);

	});

	// $w('#line1').hide();

	resolveGalleryItems();


	setTimeout(() => {

	    // redirect to not available
		// if (usersCountryCode != 'AE' && usersCountryCode != 'US' && usersCountryCode != 'SG'){
		// 	wixLocation.to('https://askandcarts.com/not-available');
		// 	close();
		// }

		// removing items (products) without product category or gender & products that exist more than once in the database..
		var properDbQueryAllResponseItems = [];

		for (let itemIndexString in dbQueryAllResponseItems){

			var currentDBItem = dbQueryAllResponseItems[Number(itemIndexString)];
			var currentDBItemGenderType = typeof(currentDBItem.gender);
			var currentDBItemProductCategoryType = typeof(currentDBItem.productcategory);

			var currentDBItemTitle = currentDBItem.title;
			var currentDBItemPrice = currentDBItem.price;
			var currentDBItemImageSrc = currentDBItem.imagesrc;

			// console.log('currentDBItemGenderType: ' + currentDBItem.gender + ", " + currentDBItemGenderType);
			// console.log('currentDBItemProductCategoryType: ' + currentDBItem.productcategory + ", " + currentDBItem.gender + ', ' + currentDBItemProductCategoryType);


			if (
				currentDBItemGenderType != 'object' && currentDBItemProductCategoryType != 'object'
				){
					// console.log('currentDBItemGenderType: ' + currentDBItemGenderType);
					// console.log('currentDBItemProductCategoryType: ' + currentDBItemProductCategoryType);

					// console.log('currentDBItemProductCategoryType: ' + currentDBItem.productcategory + ", " + currentDBItem.gender + ', ' + currentDBItemProductCategoryType);




					// checking whether the current product has very similar variations in the database..
					var numberOfTimesCurrentDBItemExistsInDB = dbQueryAllResponseItems.filter(
						(product) => {

							var ninetyFourPercentCurrentDBItemTitleIndex = Math.round(0.94 * currentDBItemTitle.length);
							var ninetyFourPercentCurrentDBItemTitle = currentDBItemTitle.substring(0, ninetyFourPercentCurrentDBItemTitleIndex);


							var currentDBItemGender = currentDBItem.gender;

							var ninetyFourPercentCurrentDBItemImageSrcIndex =  Math.round(0.94 * currentDBItemImageSrc.length);
							var ninetyFourPercentCurrentDBItemImageSrc =  currentDBItemImageSrc.substring(0, ninetyFourPercentCurrentDBItemImageSrcIndex);

							// --

							var ninetyFourPercentAProductFromDBsTitleIndex =  Math.round(0.94 * (product.title).length);
							var ninetyFourPercentAProductFromDBsTitle =  product.title.substring(0, ninetyFourPercentAProductFromDBsTitleIndex)


							var aProductFromDBsGender = product.gender;

							var ninetyFourPercentAProductFromDBsImageSrcIndex =  Math.round(0.94 * (product.imagesrc).length);
							var ninetyFourPercentAProductFromDBsImageSrc =  product.imagesrc.substring(0, ninetyFourPercentAProductFromDBsImageSrcIndex);

							var ninetyFourPercentAProductFromDBsPrice = product.price;

							// console.log(
							// 	ninetyFourPercentAProductFromDBsTitle + ' == ' +  ninetyFourPercentCurrentDBItemTitle + '\n' +
							// 		aProductFromDBsGender + ' == ' + currentDBItemGender + '\n' +
							// 		ninetyFourPercentAProductFromDBsImageSrc + ' == ' + ninetyFourPercentCurrentDBItemImageSrc + '\n' +
							// 		ninetyFourPercentAProductFromDBsPrice + ' == ' + currentDBItemPrice
							// );

							// comparing every product within DB with current product
							return  ninetyFourPercentAProductFromDBsTitle == ninetyFourPercentCurrentDBItemTitle
									&& aProductFromDBsGender == currentDBItemGender
									&& ninetyFourPercentAProductFromDBsImageSrc == ninetyFourPercentCurrentDBItemImageSrc
									&& ninetyFourPercentAProductFromDBsPrice == currentDBItemPrice;

						}
					).length;

					console.log('numberOfTimesCurrentDBItemExistsInDB: ' + numberOfTimesCurrentDBItemExistsInDB);


					// checking whether the an current item that has very similar variations in the database has been added to 'properDbQueryAllResponseItems' list
					var isCurrentDBItemAlreadyAddedToProperDbQueryAllResponseItems = false;

					if (numberOfTimesCurrentDBItemExistsInDB > 1){

						isCurrentDBItemAlreadyAddedToProperDbQueryAllResponseItems = properDbQueryAllResponseItems.filter((addedProducts) => {

							var ninetyFourPercentCurrentDBItemTitleIndex = Math.round(0.94 * currentDBItemTitle.length);
							var ninetyFourPercentCurrentDBItemTitle = currentDBItemTitle.substring(0, ninetyFourPercentCurrentDBItemTitleIndex);

							var currentDBItemGender = currentDBItem.gender;

							var ninetyFourPercentCurrentDBItemImageSrcIndex =  Math.round(0.94 * currentDBItemImageSrc.length);
							var ninetyFourPercentCurrentDBItemImageSrc =  currentDBItemImageSrc.substring(0, ninetyFourPercentCurrentDBItemImageSrcIndex);

							// --

							var ninetyFourPercentAddedProductsTitleIndex =  Math.round(0.94 * (addedProducts.title).length);
							var ninetyFourPercentAddedProductsTitle =  addedProducts.title.substring(0, ninetyFourPercentAddedProductsTitleIndex)


							var addedProductsGender = addedProducts.gender;

							var ninetyFourPercentAddedProductsImageSrcIndex =  Math.round(0.94 * (addedProducts.imagesrc).length);
							var ninetyFourPercentAddedProductsImageSrc =  addedProducts.imagesrc.substring(0, ninetyFourPercentAddedProductsImageSrcIndex);

							var ninetyFourPercentAddedProductsPrice = addedProducts.price;

							// comparing every product within DB with current product
							return  ninetyFourPercentAddedProductsTitle == ninetyFourPercentCurrentDBItemTitle
									&& addedProductsGender == currentDBItemGender
									&& ninetyFourPercentAddedProductsImageSrc == ninetyFourPercentCurrentDBItemImageSrc
									&& ninetyFourPercentAddedProductsPrice == currentDBItemPrice;

						}).length > 0;
					}


					if (numberOfTimesCurrentDBItemExistsInDB == 1){

						properDbQueryAllResponseItems.push(currentDBItem);

					}
					else if (numberOfTimesCurrentDBItemExistsInDB > 1 && isCurrentDBItemAlreadyAddedToProperDbQueryAllResponseItems == false){

						properDbQueryAllResponseItems.push(currentDBItem);

					}

			}
		}

		// shuffled (proper) list of available products - To ensure that visitors do not keep seeing the same products over and over again

		properDbQueryAllResponseItems = properDbQueryAllResponseItems.sort(function () {
		  return Math.random() - 0.5;
		})

		dbQueryAllResponseItems = properDbQueryAllResponseItems;
		console.log('items length: ' + dbQueryAllResponseItems.length);


		// var gallery1ItemsReformatted = [];
		var gallery1AlreadyIncludedCategoryTrackerList = [];
		var gallery1AlreadyIncludedAsPerTheirRelativeGenderTrackerList = [];
		var ladiesShoesAndBagsIncludedTracker = [];

		// counting the number of products per gender --> for use in recommendedForWomen..
		// var dbQueryAllResponseItemsTotalProductsCount = dbQueryAllResponseItems.length;
		// var dbQueryAllResponseItemsMensProductCount = dbQueryAllResponseItems.filter(item => item.gender == 'MEN').length;
		// var dbQueryAllResponseItemsWomensProductCount = dbQueryAllResponseItemsTotalProductsCount - dbQueryAllResponseItemsMensProductCount;

		// making a perfect count of product per category per gender
		var totalProductsPerCategoryPerGender = {'WOMEN': {}, 'MEN': {}};

		// tracking available categories for each gender
		var availableProductsCategoryForEachGender = {
			'WOMEN': [], 'MEN': []
		}

		var count = 0;
		var countEntry = 0;

		// if (dbQueryAllResponseItems.length == 0){
		// 	wixLocation.to('https://flowbeing.wixsite.com/my-site-1');
		// }

		dbQueryAllResponseItems.forEach((item) => {

			countEntry += 1;

			console.log('countEntry: ' + countEntry);
			// console.log('here');
			var productCat = item.productcategory;
			var productGender = item.gender;



			// check whether or not the current product's category has been added to availableProductsCategoryForEachGender,
			// if it hasn't been added, add it to the appropriate gender..
			var isCurrentProductCategoryInAvailableProductsCategoryForEachGender = false;

			if (productGender.includes('WOMEN') || productGender.includes('FEMALE')){
				isCurrentProductCategoryInAvailableProductsCategoryForEachGender =
				availableProductsCategoryForEachGender['WOMEN'].filter((productCategory) => productCategory == productCat).length > 0;

				if (isCurrentProductCategoryInAvailableProductsCategoryForEachGender == false){
					availableProductsCategoryForEachGender['WOMEN'].push(productCat);
					totalProductsPerCategoryPerGender['WOMEN'][productCat] = [];
				}

				totalProductsPerCategoryPerGender.WOMEN[productCat].push(item);

				console.log('countEntryWOMEN: ' + countEntry);


			}
			else if(productGender.includes('MEN') || (productGender.includes('MALE') && !productGender.includes('FEMALE')) ){
				isCurrentProductCategoryInAvailableProductsCategoryForEachGender =
				availableProductsCategoryForEachGender['MEN'].filter((productCategory) => productCategory == productCat).length > 0;

				if (isCurrentProductCategoryInAvailableProductsCategoryForEachGender == false){
					console.log('pushed category for men: ' + productCat )
					availableProductsCategoryForEachGender['MEN'].push(productCat);
					totalProductsPerCategoryPerGender['MEN'][productCat] = [];
				}

				totalProductsPerCategoryPerGender.MEN[productCat].push(item);

				console.log('countEntryMEN: ' + countEntry);

			}



			// console.log(totalProductsPerCategoryPerGender.WOMEN.productcategory == undefined);
			// var currentCategoryWithinCurrentGender = totalProductsPerCategoryPerGender[productGender][productCat];
			// console.log('typeof: ' + typeof(currentCategoryWithinCurrentGender));
			// console.log('typeof(0): ' + typeof(0));

			// console.log('productGender: ' + productGender + ', ' + 'productCat: ' + productCat);
			// console.log('typeof([0]): ' + typeof([0]));

			// if (productGender.includes('WOMEN') || productGender.includes('FEMALE') // && gallery1AlreadyIncludedAsPerTheirRelativeGenderTrackerList
            //
            // ){
			// 	// if (typeof(totalProductsPerCategoryPerGender[productGender][productCat]) != 'object') {
			// 	// 	// console.log('gender: women, productCategory: ' + productCat + ', undefined: ' + typeof(totalProductsPerCategoryPerGender[productGender][productCat]));
			// 	// 	totalProductsPerCategoryPerGender.WOMEN[item.productcategory] = [item];
			// 	//
			// 	// }
			// 	// if (typeof(totalProductsPerCategoryPerGender[productGender][productCat]) == 'object'){
			// 	// 	// console.log('gender: women, productCategory: ' + productCat + ', defined: ' + typeof(totalProductsPerCategoryPerGender[productGender][productCat]));
			// 	// 	totalProductsPerCategoryPerGender.WOMEN[item.productcategory].push(item);
			// 	// }
			//
			// 	totalProductsPerCategoryPerGender.WOMEN[item.productcategory].push(item);
			//
			// 	count += 1;
			// 	console.log('countW: ' + count);
			//
			// }
			// else if (productGender.includes('MEN') || (productGender.includes('MALE') && !productGender.includes('FEMALE'))){
			//
			// 	// if (typeof(totalProductsPerCategoryPerGender[productGender][productCat]) != 'object') {
			// 	// 	// console.log('gender: men, productCategory: ' + productCat + ', undefined: ' + typeof(totalProductsPerCategoryPerGender[productGender][productCat]));
			// 	// 	totalProductsPerCategoryPerGender.MEN[item.productcategory] = [item];
			// 	// }
			// 	// if (typeof(totalProductsPerCategoryPerGender[productGender][productCat]) == 'object'){
			// 	// 	// console.log('gender: women, productCategory: ' + productCat + ', defined: ' + typeof(totalProductsPerCategoryPerGender[productGender][productCat]));
			// 	// 	totalProductsPerCategoryPerGender.MEN[item.productcategory].push(item);
			// 	// }
			//
			// 	totalProductsPerCategoryPerGender.MEN[item.productcategory].push(item);
			//
			//
			// 	count += 1;
			// 	console.log('countM: ' + count);
			// }


		});


		var womensFeatureableProducts = totalProductsPerCategoryPerGender.WOMEN;
		var mensFeatureableProducts = totalProductsPerCategoryPerGender.MEN;

		// list of shoes and bags that are available for women
		var womensFeaturableShoesList = womensFeatureableProducts['SHOE'];
		var womensFeaturableBagsList = womensFeatureableProducts['HANDBAG'];

        console.log('got here 1');

        var womensFeaturableShoesListCopy = [];
        var womensFeaturableBagsListCopy = [];

        if (typeof(womensFeaturableShoesList) == 'object'){

		    womensFeaturableShoesListCopy = JSON.parse(JSON.stringify(womensFeaturableShoesList));// womensFeatureableProducts['SHOE'];

        }

        if (typeof(womensFeaturableBagsList) == 'object'){

            womensFeaturableBagsListCopy = JSON.parse(JSON.stringify(womensFeaturableBagsList)); // womensFeatureableProducts['HANDBAG'];

        }

        console.log('got here 2');

		// console.log('type check');
		// for (var x in womensFeaturableShoesList){
		// 	console.log(JSON.stringify(womensFeaturableShoesList[x].productlink == womensFeaturableShoesListCopy[x].productlink));
		// }
		// console.log(womensFeaturableBagsList == womensFeaturableBagsListCopy);

		console.log('');
		// console.log('womensFeatureableProducts: ' + womensFeatureableProducts);
		// console.log('mensFeatureableProducts: ' + mensFeatureableProducts);

		/// product categories that's currently available per gender selection
		var availableProductCategoriesForMen = availableProductsCategoryForEachGender['MEN'];
		var availableProductCategoriesForWomen = availableProductsCategoryForEachGender['WOMEN'];


        console.log('got here 3');

		console.log('');
		console.log("Available Categories Men: [" + availableProductCategoriesForMen + ']');
		console.log("Available Categories Women: [" + availableProductCategoriesForWomen + ']');

        console.log('got here 4');


		// var gallery1MensProductsCount = gallery1AlreadyIncludedAsPerTheirRelativeGenderTrackerList.filter(gender => gender == 'MEN').length;
		// var gallery1WomensProductsCount = gallery1AlreadyIncludedAsPerTheirRelativeGenderTrackerList.filter(gender => gender == 'WOMEN').length;

		/// setting recommendedForWomen's limit based on the number of items in dbQueryAllResponseItems
		var recommendedForWomenContentTargetCount = 10;

		if (dbQueryAllResponseItems.length < 10){

			recommendedForWomenContentTargetCount = dbQueryAllResponseItems.length;

		}


		var currentProductItemsIndexWithinListOfAllProducts = 1;
		var numberOfLuxuryTechInRecommendedGalleryTracker = 0;



		/// obtain recommendedForWomensGallery's content while ensuring 10 women's products have been added..
		// if (dbQueryAllResponseItems.length >= recommendedForWomenContentTargetCount){

			// while (recommendedForWomen.length < recommendedForWomenContentTargetCount) {

			while (currentProductItemsIndexWithinListOfAllProducts < dbQueryAllResponseItems.length) {

				// console.log('got here x1');
				console.log('currentProductItemsIndexWithinListOfAllProducts x1' + currentProductItemsIndexWithinListOfAllProducts);

				for (var gender in totalProductsPerCategoryPerGender){

					// console.log('got here x2');

						for (var productCategory in totalProductsPerCategoryPerGender[gender]){

							// console.log('got here x3');

							// ' + productCategory);

							if (totalProductsPerCategoryPerGender[gender][productCategory].length != 0){

								// console.log('got here 4a');

								/// current product within current product category
								var currentProduct = totalProductsPerCategoryPerGender[gender][productCategory][0];

								// console.log('currentProduct: ' + currentProduct.title);

								if (currentProduct.siteName != ''){

									// defining item's title
									var currentProductTitle = currentProduct.title;

									if (currentProductTitle.length > 30){
										currentProductTitle = currentProduct.title.substring(0,59) + '..';
									}
									else{
										currentProductTitle = currentProduct.title;
									}


									// gallery1MensProductsCount = gallery1AlreadyIncludedAsPerTheirRelativeGenderTrackerList.filter(gender => gender == 'MEN').length;
									// gallery1WomensProductsCount = gallery1AlreadyIncludedAsPerTheirRelativeGenderTrackerList.filter(gender => gender == 'WOMEN').length;

									// console.log('gallery1MensProductsCount: ' + gallery1MensProductsCount);
									// console.log('gallery1WomensProductsCount: ' + gallery1WomensProductsCount);

									// adding current item to recommendedForWomen while making sure men's product within recommendedForWomen does not exceed
									// if (gender == 'MEN' && gallery1MensProductsCount == 2){
									// 	var doNothing = {};
									// }

									console.log('got here 4b');


									var indexOfCurrentProduct = dbQueryAllResponseItems.indexOf(currentProduct);

										// populating each available women's category with their relevant products
										if (currentProduct.gender == 'WOMEN'){


											if (productCategory == 'SHOE' || productCategory == 'NECKLACE' || productCategory == 'EARRING'){

												shoesAndMoreWomen.push({

													"type": "image",
	  												"title": currentProductTitle,
	 		  										"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  												'description': currentProduct.price,
	  												'link': currentProduct.productcategory,
	  												'slug': String(indexOfCurrentProduct)
												});

												if (productCategory == 'NECKLACE' && giftsForHer.length < 20){
													giftsForHer.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productcategory,
	  													'slug': String(indexOfCurrentProduct)
													});
												}

												// populating amazonless
												if (!currentProduct.imagesrc.includes('amazon')){

													shoesAndMoreWomenAmazonless.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productcategory,
	  													'slug': String(indexOfCurrentProduct)
													});

													if (productCategory == 'NECKLACE' && giftsForHerAmazonless.length < 20 && !currentProduct.imagesrc.includes('amazon')){
													giftsForHerAmazonless.push({

															"type": "image",
	  														"title": currentProductTitle,
	 		  												"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  														'description': currentProduct.price,
	  														'link': currentProduct.productcategory,
	  														'slug': String(indexOfCurrentProduct)
														});
													}

												}

											}
											else if (productCategory == 'HANDBAG' || productCategory == 'BRACELET' || productCategory == 'WATCH' || productCategory == 'WATCHES'){
												handbagsAndMoreWomen.push({

													"type": "image",
	  												"title": currentProductTitle,
	 		  										"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  												'description': currentProduct.price,
	  												'link': currentProduct.productcategory,
	  												'slug': String(indexOfCurrentProduct)
												});

												if (productCategory == 'BRACELET' && giftsForHer.length < 20){
													giftsForHer.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productcategory,
	  													'slug': String(indexOfCurrentProduct)
													});
												}

												// populating amazonless
												if (!currentProduct.imagesrc.includes('amazon')){

													handbagsAndMoreWomenAmazonless.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productcategory,
	  													'slug': String(indexOfCurrentProduct)
													});

													if (productCategory == 'BRACELET' && giftsForHerAmazonless.length < 20 && !currentProduct.imagesrc.includes('amazon')){

													giftsForHerAmazonless.push({

															"type": "image",
	  														"title": currentProductTitle,
	 		  												"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  														'description': currentProduct.price,
	  														'link': currentProduct.productcategory,
	  														'slug': String(indexOfCurrentProduct)
														});
													}

												}

											}
											else if (productCategory == 'FURNITURE'){
												furnituresMenAndWomen.push({

													"type": "image",
	  												"title": currentProductTitle,
	 		  										"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  												'description': currentProduct.price,
	  												'link': currentProduct.productcategory,
	  												'slug': String(indexOfCurrentProduct)
												})

												// populating Amazonless
												if (!currentProduct.imagesrc.includes('amazon')){

													furnituresMenAndWomenAmazonless.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productcategory,
	  													'slug': String(indexOfCurrentProduct)
													});

												}

											}
											else if (productCategory == 'CLOTHING' || productCategory == 'PERFUME'){
												clothesAndPerfumesWomen.push({

													"type": "image",
	  												"title": currentProductTitle,
	 		  										"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  												'description': currentProduct.price,
	  												'link': currentProduct.productcategory,
	  												'slug': String(indexOfCurrentProduct)
												})

												// populating Amazonless
												if (!currentProduct.imagesrc.includes('amazon')){

													clothesAndPerfumesWomenAmazonless.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productcategory,
	  													'slug': String(indexOfCurrentProduct)
													});

												}

											}
											else if (productCategory == 'FLOWER' || productCategory == 'RING'){
												flowersAndRingsWomen.push({

													"type": "image",
	  												"title": currentProductTitle,
	 		  										"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  												'description': currentProduct.price,
	  												'link': currentProduct.productcategory,
	  												'slug': String(indexOfCurrentProduct)
												});

												if (giftsForHer.length < 20){
													giftsForHer.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productcategory,
	  													'slug': String(indexOfCurrentProduct)
													});
												}

												// populating amazonless
												if (!currentProduct.imagesrc.includes('amazon')){

													flowersAndRingsWomenAmazonless.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productcategory,
	  													'slug': String(indexOfCurrentProduct)
													});

													if (productCategory == 'RING' && giftsForHerAmazonless.length < 20 && !currentProduct.imagesrc.includes('amazon')){
													giftsForHerAmazonless.push({

															"type": "image",
	  														"title": currentProductTitle,
	 		  												"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  														'description': currentProduct.price,
	  														'link': currentProduct.productcategory,
	  														'slug': String(indexOfCurrentProduct)
														});
													}

												}
											}
											else if (productCategory == 'TRAVEL BAG' || productCategory == 'BAG'){
												travelBagsAndOtherBagsWomen.push({

													"type": "image",
	  												"title": currentProductTitle,
	 		  										"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  												'description': currentProduct.price,
	  												'link': currentProduct.productcategory,
	  												'slug': String(indexOfCurrentProduct)
												})

												// populating Amazonless
												if (!currentProduct.imagesrc.includes('amazon')){

													travelBagsAndOtherBagsWomenAmazonless.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productcategory,
	  													'slug': String(indexOfCurrentProduct)
													});

												}
											}
											else if (productCategory == 'ACCESSORIES'){

												otherAccessoriesWomen.push({

													"type": "image",
	  												"title": currentProductTitle,
	 		  										"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  												'description': currentProduct.price,
	  												'link': currentProduct.productcategory,
	  												'slug': String(indexOfCurrentProduct)
												});

												// populating Amazonless
												if (!currentProduct.imagesrc.includes('amazon')){

													otherAccessoriesWomenAmazonless.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productcategory,
	  													'slug': String(indexOfCurrentProduct)
													});

												}
											}
											else if (productCategory == 'LUXURY TECH'){

												luxuryTechWomen.push({

													"type": "image",
	  												"title": currentProductTitle,
	 		  										"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  												'description': currentProduct.price,
	  												'link': currentProduct.productcategory,
	  												'slug': String(indexOfCurrentProduct)
												});

												// populating Amazonless
												if (!currentProduct.imagesrc.includes('amazon')){

													luxuryTechWomenAmazonless.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productcategory,
	  													'slug': String(indexOfCurrentProduct)
													});

												}
											}

										}

										// populating all product categories for men
										if (currentProduct.gender == 'MEN'){

											// var isDisplayMensShoesAndWatches = isItemsInList(availableProductCategoriesForMen, ['SHOE', 'WATCH', 'WATCHES']);
											// var isDisplayMensNecklacesAndBRACELET = isItemsInList(availableProductCategoriesForMen, ['NECKLACE', 'BRACELET']);
											// var isDisplayFurnituresForMen = isItemsInList(availableProductCategoriesForMen, ['FURNITURE']);
											// var isDisplayMensClothesAndPerfumes = isItemsInList(availableProductCategoriesForMen, ['CLOTHING', 'PERFUME']);
											// var isDisplayFlowersAndMensRings = isItemsInList(availableProductCategoriesForMen, ['FLOWER', 'RING']);
											// var isDisplayMensTravelBagsAndOtherBags = isItemsInList(availableProductCategoriesForMen, ['TRAVEL BAG', 'BAG']);
											// var isDisplayOtherAccessoriesForMen = isItemsInList(availableProductCategoriesForMen, ['ACCESSORIES']);
											// var isDisplayGiftsForHer = isItemsInList(availableProductCategoriesForWomen, ['FLOWER', 'RING', 'NECKLACE', ]);


											if (productCategory == 'SHOE' || productCategory == 'WATCH' || productCategory == 'WATCHES'){
												shoesAndWatchesMen.push({

													"type": "image",
	  												"title": currentProductTitle,
	 		  										"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  												'description': currentProduct.price,
	  												'link': currentProduct.productcategory,
	  												'slug': String(indexOfCurrentProduct)
												});

												if ((productCategory == 'WATCH' || productCategory == 'WATCHES') && giftsForHim.length < 20){
													giftsForHim.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productcategory,
	  													'slug': String(indexOfCurrentProduct)
													});
												}

												// populating amazonless
												if (!currentProduct.imagesrc.includes('amazon')){

													shoesAndWatchesMenAmazonless.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productcategory,
	  													'slug': String(indexOfCurrentProduct)
													});

													if ((productCategory == 'WATCH' || productCategory == 'WATCHES') && giftsForHimAmazonless.length < 20 && !currentProduct.imagesrc.includes('amazon')){

														giftsForHimAmazonless.push({

																"type": "image",
	  															"title": currentProductTitle,
	 		  													"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  															'description': currentProduct.price,
	  															'link': currentProduct.productcategory,
	  															'slug': String(indexOfCurrentProduct)
															});
														}

												}

											}
											else if (productCategory == 'NECKLACE' || productCategory == 'BRACELET'){

												necklacesAndBraceletsMen.push({

													"type": "image",
	  												"title": currentProductTitle,
	 		  										"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  												'description': currentProduct.price,
	  												'link': currentProduct.productcategory,
	  												'slug': String(indexOfCurrentProduct)
												});

												if (!currentProduct.imagesrc.includes('amazon')){

													necklacesAndBraceletsMenAmazonless.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productcategory,
	  													'slug': String(indexOfCurrentProduct)
													});

												}


											}
											else if (productCategory == 'FURNITURE'){

												if (isItemsInList(furnituresMenAndWomen, [
													{

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productcategory,
	  													'slug': String(indexOfCurrentProduct)
													}]) == false){

													furnituresMenAndWomen.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productcategory,
	  													'slug': String(indexOfCurrentProduct)
													});

												};

												if (!currentProduct.imagesrc.includes('amazon')){

													if (isItemsInList(furnituresMenAndWomen, [
													{

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productcategory,
	  													'slug': String(indexOfCurrentProduct)
													}]) == false){

														furnituresMenAndWomenAmazonless.push({

															"type": "image",
	  														"title": currentProductTitle,
	 		  												"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  														'description': currentProduct.price,
	  														'link': currentProduct.productcategory,
	  														'slug': String(indexOfCurrentProduct)
														});

													}

												}

											}
											else if (productCategory == 'CLOTHING' || productCategory == 'PERFUME'){

												clothesAndPerfumesMen.push({

													"type": "image",
	  												"title": currentProductTitle,
	 		  										"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  												'description': currentProduct.price,
	  												'link': currentProduct.productcategory,
	  												'slug': String(indexOfCurrentProduct)
												});


												if (!currentProduct.imagesrc.includes('amazon')){

													clothesAndPerfumesMenAmazonless.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productcategory,
	  													'slug': String(indexOfCurrentProduct)
													});

												}

											}
											else if (productCategory == 'FLOWER' || productCategory == 'RING'){

												flowersAndRingsMen.push({

													"type": "image",
	  												"title": currentProductTitle,
	 		  										"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  												'description': currentProduct.price,
	  												'link': currentProduct.productcategory,
	  												'slug': String(indexOfCurrentProduct)
												});

												if (giftsForHim.length < 20){
													giftsForHim.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productcategory,
	  													'slug': String(indexOfCurrentProduct)
													});
												}

												if (!currentProduct.imagesrc.includes('amazon')){

													flowersAndRingsMenAmazonless.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productcategory,
	  													'slug': String(indexOfCurrentProduct)
													});

													if (giftsForHimAmazonless.length < 20){
														giftsForHimAmazonless.push({

															"type": "image",
	  														"title": currentProductTitle,
	 		  												"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  														'description': currentProduct.price,
	  														'link': currentProduct.productcategory,
	  														'slug': String(indexOfCurrentProduct)
														});
													}

												}

											}
											else if (productCategory == 'TRAVEL BAG' || productCategory == 'BAG'){

												travelBagsAndOtherBagsMen.push({

													"type": "image",
	  												"title": currentProductTitle,
	 		  										"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  												'description': currentProduct.price,
	  												'link': currentProduct.productcategory,
	  												'slug': String(indexOfCurrentProduct)
												});

												// populating amazonless
												if (!currentProduct.imagesrc.includes('amazon')){

													travelBagsAndOtherBagsMenAmazonless.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productcategory,
	  													'slug': String(indexOfCurrentProduct)
													});

												}

											}
											else if (productCategory == 'ACCESSORIES'){

												otherAccessoriesMen.push({

													"type": "image",
	  												"title": currentProductTitle,
	 		  										"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  												'description': currentProduct.price,
	  												'link': currentProduct.productcategory,
	  												'slug': String(indexOfCurrentProduct)
												})

												// populating amazonless
												if (!currentProduct.imagesrc.includes('amazon')){

													otherAccessoriesMenAmazonless.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productcategory,
	  													'slug': String(indexOfCurrentProduct)
													});

												}

											}
											else if (productCategory == 'LUXURY TECH'){

												luxuryTechMen.push({

													"type": "image",
	  												"title": currentProductTitle,
	 		  										"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  												'description': currentProduct.price,
	  												'link': currentProduct.productcategory,
	  												'slug': String(indexOfCurrentProduct)
												});

												// populating Amazonless
												if (!currentProduct.imagesrc.includes('amazon')){

													luxuryTechMenAmazonless.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productcategory,
	  													'slug': String(indexOfCurrentProduct)
													});

												}
											}

										}

										console.log('got here 4c');
										// populating recommendedForWomen's list i.e list of products that are meant for women
										if (currentProduct.gender == 'WOMEN' && currentProduct.productcategory != 'CLOTHING' && recommendedForWomen.length < 10){

											console.log('got here 4ci');

											// Ensuring that not more than one 'LUXURY TECH' product gets recommended.. e.g Fancy TVs..
											if (currentProduct.productcategory == 'LUXURY TECH' && numberOfLuxuryTechInRecommendedGalleryTracker == 0){

												recommendedForWomen.push(

												{

													"type": "image",
	  												"title": currentProductTitle,
	 		  										"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  												'description': currentProduct.price,
	  												'link': currentProduct.productcategory,
	  												'slug': String(indexOfCurrentProduct)
												});
											}
											else if (currentProduct.productcategory != 'LUXURY TECH'){

												recommendedForWomen.push(

												{

													"type": "image",
	  												"title": currentProductTitle,
	 		  										"src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  												'description': currentProduct.price,
	  												'link': currentProduct.productcategory,
	  												'slug': String(indexOfCurrentProduct)
												});

											}


											console.log('got here 4d');

											/// track bags and / or shoes has been added to recommendedForWomenGallery..
											if ((currentProduct.gender == 'WOMEN' && currentProduct.productcategory == 'HANDBAG') ||
											(currentProduct.gender == 'WOMEN' && currentProduct.productcategory == 'SHOE')){
												ladiesShoesAndBagsIncludedTracker.push(currentProduct.productcategory);

												if (currentProduct.productcategory == 'SHOE'){
													// womensFeaturableShoesList.pop(currentProduct);
													// console.log('');
													// console.log('removed from copy: ' + womensFeaturableShoesListCopy[0].title + ', ' + womensFeaturableShoesListCopy[0].gender);
													womensFeaturableShoesListCopy.splice(0, 1);
													// console.log('womensFeaturableShoesList after item removal: ' + womensFeaturableShoesList.length);
												}
												else if (currentProduct.productcategory == 'HANDBAG'){
													// womensFeaturableBagsList.pop(currentProduct);
													// console.log('');
													// console.log('removed from copy: ' + womensFeaturableBagsListCopy[0].title + ', ' + womensFeaturableBagsListCopy[0].gender);
													womensFeaturableBagsListCopy.splice(0, 1);
													// console.log('womensFeaturableBagsList after item removal: ' + womensFeaturableBagsList.length);
												}
											}

											console.log('got here 4e');



										}

										console.log('got here 4f');

										// removing current product from totalProductsPerCategoryPerGender dict to prevent it from being added and
										// displayed more than once on recommendedForWomen's gallery..
										// totalProductsPerCategoryPerGender[gender][productCategory].pop(0);
										// console.log('removed from main: ' + currentProduct.title + ', ' + currentProduct.gender);
										// console.log('');
										totalProductsPerCategoryPerGender[gender][productCategory].splice(0, 1); // remove the item to prevent it from being added again later

										// gallery1AlreadyIncludedAsPerTheirRelativeGenderTrackerList.push(gender);




									// console.log(currentProductItemsIndexWithinListOfAllProducts);

									// console.log(currentProduct.imagesrc);

										// if ((gender == 'WOMEN' && gallery1WomensProductsCount == 8) || (gender == 'MEN' && gallery1MensProductsCount == 2)){
										// 	break;
										// }



								}

								currentProductItemsIndexWithinListOfAllProducts += 1;
								console.log('got here 4g');
								console.log('currentProductItemsIndexWithinListOfAllProducts 4g' + currentProductItemsIndexWithinListOfAllProducts);
								// console.log(currentProductItemsIndexWithinListOfAllProducts);

									// if ((gender == 'WOMEN' && gallery1WomensProductsCount == 8) || (gender == 'MEN' && gallery1MensProductsCount == 2)){
									// 	break;
									// }






							}

							// if (recommendedForWomen.length == 10){
							// 	break
							// }

								// if ((gender == 'WOMEN' && gallery1WomensProductsCount == 8) || (gender == 'MEN' && gallery1MensProductsCount == 2)){
								// 		break;
								// 	}



						}

				}

							// if ((gender == 'WOMEN' && gallery1WomensProductsCount == 8) || (gender == 'MEN' && gallery1MensProductsCount == 2)){
							// 			break;
							// 		}


			}
            console.log('got here 5');
		// console.log('');
		// console.log('womensFeaturableBagsList after item removal: ' + womensFeaturableBagsList.length);
		// console.log('here');
		// console.log('womensFeaturableShoesList after item removal: ' + womensFeaturableShoesList.length);
		// console.log('ladiesShoesAndBagsIncludedTracker: ' + ladiesShoesAndBagsIncludedTracker);








		// console.log('');
		// console.log('gallery1AlreadyIncludedAsPerTheirRelativeGenderTrackerList: ' + gallery1AlreadyIncludedAsPerTheirRelativeGenderTrackerList);



		/// ensuring that at least two ladies clothings and bags have been included in recommendedForWomenGallery
		var ladiesShoesIncludedCount = ladiesShoesAndBagsIncludedTracker.filter((shoeOrBagIncluded) => shoeOrBagIncluded == 'SHOE').length;
		var ladiesBagsIncludedCount = ladiesShoesAndBagsIncludedTracker.filter((shoeOrBagIncluded) => shoeOrBagIncluded == 'HANDBAG').length;

		// for (var index in recommendedForWomen){
		// 		console.log(recommendedForWomen[index]);
		// 		console.log('typeof(index): ' + typeof(index));
		// }
		// console.log('');
		// console.log(womensFeatureableProducts['BRACELET']['0']);





		if (ladiesShoesIncludedCount < 3 ||
				ladiesBagsIncludedCount < 3){

			// console.log('');
			// console.log('ladiesBagsIncludedCount: ' + ladiesBagsIncludedCount);
			// console.log('ladiesShoesIncludedCount: ' + ladiesShoesIncludedCount);





			var maxNumberOfShoesThatShouldBeAddedTorecommendedForWomen = 0;
			var maxNumberOfBagsThatShouldBeAddedTorecommendedForWomen = 0;

			// console.log('womensFeaturableShoesListCopy: ' + womensFeaturableShoesListCopy);
			// console.log('ladiesShoesIncludedCount: ' + ladiesShoesIncludedCount);


			// if shoe products exists in the shoe category with up to one product
			if (typeof(womensFeaturableShoesListCopy) == 'object'){

				if (womensFeaturableShoesListCopy.length >= 1){

					maxNumberOfShoesThatShouldBeAddedTorecommendedForWomen = 3 - ladiesShoesIncludedCount;

					// console.log('');
					// console.log('maxNumberOfShoesThatShouldBeAddedTorecommendedForWomen: ' + maxNumberOfShoesThatShouldBeAddedTorecommendedForWomen);

				}

				// loop to remove non handbag or shoe item from featuredGallery and replace with shoes instead
				for (var indexOne = 0 ; indexOne < womensFeaturableShoesListCopy.length; indexOne ++){

					// remove a featured general gallery item that's not a handbag or shoe..
					for (var indexTwo in recommendedForWomen){

						if (recommendedForWomen[indexTwo].link != 'SHOE' && recommendedForWomen[indexTwo].link != 'HANDBAG'){

							recommendedForWomen.splice(Number(indexTwo), 1);

							break;

						}
					}

					// add shoe product to featured general item
					var currentShoeProduct = womensFeaturableShoesListCopy[indexOne];
					var indexOfCurrentProduct = dbQueryAllResponseItems.findIndex((product) => product.productlink == currentShoeProduct.productlink); // dbQueryAllResponseItems.indexOf(currentShoeProduct);
					// console.log('');
					// console.log('slug extra shoe: ' + indexOfCurrentProduct);
					// console.log('currentShoeProduct extra shoe: ' + currentShoeProduct.title, currentShoeProduct.productlink);
					// console.log('');

					recommendedForWomen.push(

										{
											"type": "image",
	  										"title": currentShoeProduct.title,
	 		  								"src": currentShoeProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  										'description': currentShoeProduct.price,
	  										'link': currentShoeProduct.productcategory,
	  										'slug': String(indexOfCurrentProduct)
										}

					);

					womensFeaturableShoesListCopy.splice(Number(indexOne), 1);

					if (indexOne == maxNumberOfShoesThatShouldBeAddedTorecommendedForWomen - 1){ // manually augmented
						break;
					}

				}
			}

			// if handbag products exists in the handbag category with up to one product
			if (typeof(womensFeaturableBagsListCopy) == 'object'){

				if (womensFeaturableBagsListCopy.length >= 1){

					maxNumberOfBagsThatShouldBeAddedTorecommendedForWomen = 3 - ladiesBagsIncludedCount;

					// console.log('');
					// console.log('maxNumberOfBagsThatShouldBeAddedTorecommendedForWomen: ' + maxNumberOfBagsThatShouldBeAddedTorecommendedForWomen);

				}


				// i.e loop to remove non handbag or shoe item from featuredGallery and replace with handbag instead
				for (var indexOne = 0 ; indexOne < womensFeaturableBagsListCopy.length; indexOne ++){

					// console.log('');
					// console.log('womensFeaturableBagsListCopy.length: ' + womensFeaturableBagsListCopy.length);


					// remove a featured general gallery  that's not a bag or shoe..
					for (var indexTwo in recommendedForWomen){

						if (recommendedForWomen[indexTwo].link != 'SHOE' && recommendedForWomen[indexTwo].link != 'HANDBAG'){

							recommendedForWomen.splice(Number(indexTwo), 1);

							break;

						}
					}

					// add bag product to featured general item
					var currentBagProduct = womensFeaturableBagsListCopy[indexOne];
					var indexOfCurrentProduct = dbQueryAllResponseItems.findIndex((product) => product.productlink == currentBagProduct.productlink); // dbQueryAllResponseItems.indexOf(currentBagProduct);
					// console.log('');
					// console.log('slug extra bag: ' + indexOfCurrentProduct);
					// console.log('currentBagProduct extra shoe: ' + currentBagProduct.title + ' , ' + currentBagProduct.productlink);
					// console.log('');
					recommendedForWomen.push(

										{
											"type": "image",
	  										"title": currentBagProduct.title,
	 		  								"src": currentBagProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  										'description': currentBagProduct.price,
	  										'link': currentBagProduct.productcategory,
	  										'slug': String(indexOfCurrentProduct)
										}

					);

					womensFeaturableBagsListCopy.splice(Number(indexOne), 1);
					if (indexOne == maxNumberOfBagsThatShouldBeAddedTorecommendedForWomen - 1){ // manually augmented
						break;
					}
				}
			}
		}

		console.log('got here 6');



		// custom button
		// console.log($w('#customButton'));
		// $w('#customButton').show();

		/// CONFIGURING CONTENTS FOR RECOMMENDED GALLERY
		if(wixWindow.formFactor === "Desktop"){
			$w('#recommendedForWomenGallery').items = recommendedForWomen;
			$w('#recommendedForWomenGallery').show();
		}


		// CONFIGURING THE FILTERS AND CONTENTS OF THE MAIN GALLERY
		// 1.a Product Category Filter For Women
		var listOfProductCategoryForWomen = [];

		// var listOfProductCategoryForWomen = [
		// 	{"label": "Necklaces & Earrings", "value": "Necklaces & Earrings"},
		// 	{"label": "Bags & Jewelleries", "value": "Bags & Jewelleries"},
		// 	{"label": "Furnitures", "value": "Furnitures"},
		// 	{"label": "Clothes And Perfumes", "value": "Clothes And Perfumes"},
		// 	{"label": "Rings", "value": "Rings"}, // Flowers & Rings
		// 	{"label": "Travel Bags & Other Bags", "value": "Travel Bags & Other Bags"},
		// 	{"label": "Other Accessories", "value": "Other Accessories"},
		// 	{"label": "Gifts For Him", "value": "Gifts For Him"}
		// ];

		console.log('got here 7');


		// console.log('availableProductCategoriesForWomen: ' + availableProductCategoriesForWomen);
		var isDisplayShoesAndMore = isItemsInList(availableProductCategoriesForWomen, ['SHOE', 'NECKLACE', 'EARRING']);
		// console.log('isDisplayShoesAndMore: ' + isDisplayShoesAndMore);
		var isDisplayHandbagsAndMore = isItemsInList(availableProductCategoriesForWomen, ['HANDBAG', 'BRACELET', 'WATCH', 'WATCHES']);
		// console.log('isDisplayHandbagsAndMore: ' + isDisplayHandbagsAndMore);
		var isDisplayFurnituresForWomen = isItemsInList(availableProductCategoriesForWomen, ['FURNITURE']);
		var isDisplayLuxuryTechForWomen = isItemsInList(availableProductCategoriesForWomen, ['LUXURY TECH']);
		// console.log('isDisplayFurnitures: ' + isDisplayFurnitures);
		var isDisplayWomensClothesAndPerfumes = isItemsInList(availableProductCategoriesForWomen, ['CLOTHING', 'PERFUME']);
		var isDisplayFlowersAndWomensRings = isItemsInList(availableProductCategoriesForWomen, ['FLOWER', 'RING']);
		var isDisplayTravelBagsAndOtherBags = isItemsInList(availableProductCategoriesForWomen, ['TRAVEL BAG', 'BAG']);
		var isDisplayOtherAccessoriesForWomen = isItemsInList(availableProductCategoriesForWomen, ['ACCESSORIES']);
		var isDisplayGiftsForHim = isItemsInList(availableProductCategoriesForMen, ['FLOWER', 'RING', 'WATCH', 'WATCHES']);

		// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
		// 	listOfProductCategoryForWomen.push({"label": "Recommended", "value": "Recommended"});
		// }

		if (isDisplayHandbagsAndMore){
			listOfProductCategoryForWomen.push({"label": "Bags & Jewelleries", "value": "Bags & Jewelleries"});
		}

		if (isDisplayShoesAndMore){
			listOfProductCategoryForWomen.push({"label": "Necklaces & Earrings", "value": "Necklaces & Earrings"}); // Shoes & Jewelleries
		}

		if (isDisplayFurnituresForWomen){
			listOfProductCategoryForWomen.push({"label": "Furnitures", "value": "Furnitures"});
		}

		if (isDisplayLuxuryTechForWomen){
			listOfProductCategoryForWomen.push({"label": "Electronics", "value": "Electronics"});
		}

		if (isDisplayWomensClothesAndPerfumes){
			listOfProductCategoryForWomen.push({"label": "Clothes", "value": "Clothes"}); // Clothes & Perfumes
		}

		if (isDisplayFlowersAndWomensRings){
			listOfProductCategoryForWomen.push({"label": "Rings", "value": "Rings"}); // Flowers & Rings
		}

		if (isDisplayTravelBagsAndOtherBags){
			listOfProductCategoryForWomen.push({"label": "Travel Bags & Other Bags", "value": "Travel Bags & Other Bags"});
		}

		if (isDisplayOtherAccessoriesForWomen){
			listOfProductCategoryForWomen.push({"label": "Other Accessories", "value": "Other Accessories"});
		}

		if (isDisplayGiftsForHim){
			listOfProductCategoryForWomen.push({"label": "Gifts For Him", "value": "Gifts For Him"});
		}

		$w('#dropdown3').options = listOfProductCategoryForWomen;
		$w('#dropdown3').selectedIndex = 0;

		// 1.b Product Category Filter For Men
		var listOfProductCategoryForMen = [];

		// current product value
		var currentProductCategoryValue= $w('#dropdown3').value;

		// hide 'hide or show amazon products'' button
		if (currentProductCategoryValue == 'Recommended'){
			// $w('#button2').hide();
		}

		console.log('got here 8');


		// var listOfProductCategoryForMen = [
		// 	{"label": "Shoes & Watches", "value": "Shoes & Watches"},
		// 	{"label": "Necklaces & Bracelets", "value": "Necklaces & Bracelets"},
		// 	{"label": "Furnitures", "value": "Furnitures"},
		// 	{"label": "Clothes", "value": "Clothes"},
		// 	{"label": "Rings", "value": "Rings"},
		// 	{"label": "Travel Bags & Other Bags", "value": "Travel Bags & Other Bags"},
		// 	{"label": "Other Accessories", "value": "Other Accessories"},
		// 	{"label": "Gifts For Her", "value": "Gifts For Her"}
		// ];

		var isDisplayMensShoesAndWatches = isItemsInList(availableProductCategoriesForMen, ['SHOE', 'WATCH', 'WATCHES']);
		var isDisplayMensNecklacesAndBRACELET = isItemsInList(availableProductCategoriesForMen, ['NECKLACE', 'BRACELET']);
		var isDisplayFurnituresForMen = isItemsInList(availableProductCategoriesForMen, ['FURNITURE']);
		var isDisplayLuxuryTechForMen = isItemsInList(availableProductCategoriesForMen, ['LUXURY TECH']);
		var isDisplayMensClothesAndPerfumes = isItemsInList(availableProductCategoriesForMen, ['CLOTHING', 'PERFUME']);
		var isDisplayFlowersAndMensRings = isItemsInList(availableProductCategoriesForMen, ['FLOWER', 'RING']);
		var isDisplayMensTravelBagsAndOtherBags = isItemsInList(availableProductCategoriesForMen, ['TRAVEL BAG', 'BAG']);
		var isDisplayOtherAccessoriesForMen = isItemsInList(availableProductCategoriesForMen, ['ACCESSORIES']);
		var isDisplayGiftsForHer = isItemsInList(availableProductCategoriesForWomen, ['FLOWER', 'RING', 'EARRING', 'NECKLACE', ]);

		if (isDisplayMensShoesAndWatches){
			listOfProductCategoryForMen.push({"label": "Shoes & Watches", "value": "Shoes & Watches"});
		}

		if (isDisplayMensNecklacesAndBRACELET){
			listOfProductCategoryForMen.push({"label": "Necklaces & Bracelets", "value": "Necklaces & Bracelets"});
		}

		if (isDisplayFurnituresForMen){
			listOfProductCategoryForMen.push({"label": "Furnitures", "value": "Furnitures"});
		}

		console.log('isDisplayLuxuryTechForMen: ' + isDisplayLuxuryTechForMen);

		if (isDisplayLuxuryTechForMen == true){
			listOfProductCategoryForMen.push({"label": "Electronics", "value": "Electronics"});
		}

		if (isDisplayMensClothesAndPerfumes){
			listOfProductCategoryForMen.push({"label": "Clothes", "value": "Clothes"}); // Clothes & Perfumes
		}

		if (isDisplayFlowersAndMensRings){
			listOfProductCategoryForMen.push({"label": "Rings", "value": "Rings"}); // Flowers & Rings
		}

		if (isDisplayMensTravelBagsAndOtherBags){
			listOfProductCategoryForMen.push({"label": "Travel Bags & Other Bags", "value": "Travel Bags & Other Bags"});
		}

		if (isDisplayOtherAccessoriesForMen){
			listOfProductCategoryForMen.push({"label": "Other Accessories", "value": "Other Accessories"});
		}

		if (isDisplayGiftsForHer){
			listOfProductCategoryForMen.push({"label": "Gifts For Her", "value": "Gifts For Her"});
		}

		console.log('got here 9');



		// switch product category based on gender selection..
		$w('#dropdown1').onChange((event) => {

			console.log('function recognized');
			console.log($w('#dropdown1').value);

			if ($w('#dropdown1').value == 'Women'){
				$w('#dropdown3').options = listOfProductCategoryForWomen;
				$w('#dropdown3').value = 'Bags & Jewelleries';

				var userInput = $w('#input1').value;

				if (wixWindow.formFactor === 'Mobile' || wixWindow.formFactor === "Tablet"){

					SetGalleries(userInput, true, true, false, false);

				}

				else if (wixWindow.formFactor === "Desktop"){

					SetGalleries(userInput);

				}

			}
			else if ($w('#dropdown1').value == 'Men'){
				$w('#dropdown3').options = listOfProductCategoryForMen;
				$w('#dropdown3').value = 'Shoes & Watches';

				var userInput = $w('#input1').value;

				if (wixWindow.formFactor === 'Mobile' || wixWindow.formFactor === "Tablet"){

					SetGalleries(userInput, true, true, false, false);

				}

				else if (wixWindow.formFactor === "Desktop"){

					SetGalleries(userInput);

				}
			}

		});



		// brand options
		console.log('got here 10');

		// sort options
		var sortOptions = [
			{"label": "Relevance", "value": "Relevance"},
			{"label": "Price Ascending", "value": "Price Ascending"},
			{"label": "Price Descending", "value": "Price Descending"},
			// {"label": "Popularity", "value": "Popularity"},
			{"label": "Recently Added", "value": "Recently Added"}
		];

		$w('#dropdown5').options = sortOptions;
		// $w('#dropdown3').label = sortOptions[0]['label'];
		$w('#dropdown5').selectedIndex = 0;
		// $w('#dropdown5').value = sortOptions[0]['label'];


		// hide or show amazon products button
		$w('#button2').onClick((event) => {

			console.log($w('#button2').label);

			if ($w('#button2').label == 'Hide Amazon Products'){
				$w('#button2').label = 'Show Amazon Products';
			}
			else if ($w('#button2').label == 'Show Amazon Products'){
				$w('#button2').label = 'Hide Amazon Products';
			}


			var userInput = $w('#input1').value;

			if (wixWindow.formFactor === 'Mobile' || wixWindow.formFactor === "Tablet"){

				SetGalleries(userInput, true, true, false, false);

			}

			else if (wixWindow.formFactor === "Desktop"){

				SetGalleries(userInput);

			}

			// var brandOrProductSearchInput = $w('#input1').value;

			// if (typeof(brandOrProductSearchInput.length) != 'undefined'){
			// 	SetGalleries(brandOrProductSearchInput);
			// 	$w('#gallery1').hide();
			// 	$w('#gallery1').show();
			// }
			// else{
			// 	SetGalleries();
			// 	$w('#gallery1').hide();
			// 	$w('#gallery1').show();
			// }

		});

		console.log('got here 10');



		// Gallery contents when gender is female and product category is 'recommended'
		// console.log(recommendedForWomen);
		// This is the default main gallery's content for mobile devices

		// console.log('dbQueryAllResponseItems: ' + dbQueryAllResponseItems);

		// When each main gallery recommended item is clicked, get the link, and open it in new tab...
		// $w('#recommendedForWomenGallery').onItemClicked((event) => {
		//
		// 		// var replacement = event.item;
		// 		// recommendedForWomen[0].link = 'https://row.jimmychoo.com/en_AE/women/shoes/saeda-100/unicorn-printed-satin-pumps-with-crystal-embellishment-SAEDA100BAY051552.html?cgid=women-shoes';
		//
		// 		// recommendedForWomen[0] = replacement;
		//
		// 		// $w('#gallery1').items = recommendedForWomen;
		//
		// 		// var indexOfEventItem = recommendedForWomen.indexOf[event.item.slug];
		//
		// 		// openTarget(event);
		//
		//
		//
		// });

		// if(wixWindow.formFactor === "Desktop"){

			//$w('#button3').onViewportEnter((event) => {
			//
			//		console.log("$w('#gallery1').currentItem: " + $w('#gallery1').currentItem);
			//
			//		var input = $w('#input1').value;
			//		SetGalleries(input, true);
			//
			//		$w('#gallery1').clickAction = 'link';
			//
			//});

			// $w('#gallery1').onViewportEnter((event) => {
			//
			// 		console.log("$w('#gallery1').currentItem: " + $w('#gallery1').currentItem);
			//
			// 		var input = $w('#input1').value;
			// 		SetGalleries(input, true);
			//
			// 		$w('#gallery1').clickAction = 'link';
			//
			// });

			// $w('#gallery1').onViewportLeave((event) => {
			//
			// 		// console.log("$w('#gallery1').currentItem: " + $w('#gallery1').currentItem);
			//
			// 		var input = $w('#input1').value;
			// 		SetGalleries(input, false);
			//
			// 		$w('#gallery1').clickAction = 'link';
			//
			// });



		// }
		// else if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){

		//	SetGalleries('', true);

		// }


		// $w('#gallery1').onItemClicked((event) => {
		//
		//
		// 	// console.log('Mouse On');
		// 	// console.log('Item Changed');
		// 	// console.log('View Port Entered');
		// 	console.log('Item Clicked');
		//
		// 	var elemEventFiredOn = event.target;
		// 	var items =  elemEventFiredOn['items'];
		// 	var options =  elemEventFiredOn['options'];
		//
		// 	// console.log('elemEventFiredOn: ' + elemEventFiredOn[0]);
		//
		// 	for (var i in items){
		//
		// 		console.log('i: ' + i);
		// 		console.log('items[i]: ' + items[i]);
		//
		// 		for (var ii in items[i]){
		// 			console.log('ii: ' + ii);
		// 			console.log('items[i][ii]: ' + items[i][ii]);
		// 		}
		//
		// 	}
		//
		// 	console.log('current item: ' + $w('#gallery1').currentItem);
		// 	console.log('current index: ' + $w('#gallery1').currentIndex);
		//
		// 	// console.log('');
		// 	//
		// 	// console.log('OPTIONS');
		// 	// for (var i in options){
		// 	//
		// 	// 	console.log('i: ' + i);
		// 	// 	console.log('options[i]: ' + options[i]);
		// 	//
		// 	// }
		//
		//
		// });

		console.log('got here 11');



		// set main gallery's each time productCategory filter's value changes
		$w('#dropdown3').onChange((event) => {

			console.log('Got in Dropdown 3');

			var input = $w('#input1').value;


			var userInput = $w('#input1').value;


			if (wixWindow.formFactor === 'Mobile' || wixWindow.formFactor === "Tablet"){

				SetGalleries(userInput, true, true, false, false);

			}

			else if (wixWindow.formFactor === "Desktop"){

				SetGalleries(userInput);

			}
			$w('#gallery1').hide();
			$w('#gallery1').show();

			// current product value
			var currentProductCategoryValue= $w('#dropdown3').value;

			// hide 'hide or show amazon products'' button
			if (currentProductCategoryValue == 'Recommended'){
				$w('#button2').hide()
			}
			else{
				$w('#button2').show()
			}

		});

		console.log('got here 12');

		$w('#dropdown5').onChange((event) => {

			// var sortValue = $w('#dropdown5').value;
			//
			// if (sortValue == 'Relevance'){
			//
			// 	SetGalleries();
			// }
			// else{
			//
			// 	$w('#gallery1').items = sortMainGallery();
			//
			// }

			var input = $w('#input1').value;

			var userInput = $w('#input1').value;

			if (wixWindow.formFactor === 'Mobile' || wixWindow.formFactor === "Tablet"){

				SetGalleries(userInput, true, true, false, false);

			}

			else if (wixWindow.formFactor === "Desktop"){

				SetGalleries(userInput);

			}
			$w('#gallery1').hide();
			$w('#gallery1').show();

		});

		console.log('got here 13');



		// var options = {
		//   "suppressAuth": true,
		//   "suppressHooks": true
		// };

		// filtering by brand or product name..
		$w('#input1').onInput((event) => {

			var userInput = $w('#input1').value;

			if (wixWindow.formFactor === 'Mobile' || wixWindow.formFactor === "Tablet"){

				SetGalleries(userInput, true, true, false, false);

			}

			else if (wixWindow.formFactor === "Desktop"){

				SetGalleries(userInput);

			}

		});

		// set main gallery for both desktop and mobile devices..
		// SetGalleries('', true);

		if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){

			var userInput = $w('#input1').value;

			// load Main Gallery
			SetGalleries(userInput, true, true, false, false)

			$w('#button5').onViewportEnter((event) => {

				var userInput = $w('#input1').value;
				SetGalleries(userInput, true, true, false, false);

			});
		}
		// This is the default main gallery's content for desktops devices
		else if(wixWindow.formFactor === "Desktop"){

			// Recommended Gallery's top identification button
			var isButton4InView = false;

			// Recommended Gallery's bottom identification button
			var isButton5InView = false;

			// Main Gallery's identificaton button
			var isButton3InView = false;

			// set recommendedForWomenGallery
			// SetGalleries('', true, true, true); // ? don't show links on load


			// tracking whether Main Gallery only is in view
			var button3InViewOnly = 0

			var isRecommendedGalleryRecentlyInView = false;


			SetGalleries(

						userInput,
						true,
						true,
						true,
						true

					);

			// if Recommended Gallery is in view
			$w('#button5').onViewportEnter((event) => {

				isButton5InView = true;
				isRecommendedGalleryRecentlyInView = true;

				console.log('');
				console.log('4: ' + isButton4InView + ' 5: ' + isButton5InView + ' 3: ' + isButton3InView);

				// both Recommended Gallery and Main Gallery Are in View, show their links
				if (isButton3InView == true && isButton4InView == false){

					var userInput = $w('#input1').value;

					SetGalleries(

						userInput,
						true,
						true,
						true,
						true

					);

				}

				// only Recommended Gallery is in view, show its links
				else if (isButton4InView == false && isButton3InView == false){

					var userInput = $w('#input1').value;

					SetGalleries(

						userInput,
						true,
						true,
						true,
						true

					);

				}

			});

			// if Recommended Gallery is in view
			$w('#button5').onViewportLeave((event) => {

				isButton5InView = false;

				console.log('');
				console.log('4: ' + isButton4InView + ' 5: ' + isButton5InView + ' 3: ' + isButton3InView);


				// Only the Main Gallery is in view, show its links
				if (isButton5InView == false && isButton4InView == false && isButton3InView == true){

					// increase button3InViewOnly tracker if Main Gallery is in view for the first time or after a scroll back into view..
					button3InViewOnly += 1

					// reset button3InViewOnly if Main Gallery is scrolled back into view
					if (button3InViewOnly == 2){
						button3InViewOnly -= 2
					}

					// console.log('button3InViewOnly: ' + button3InViewOnly);

					//
					if (button3InViewOnly == 1 && isRecommendedGalleryRecentlyInView == true){

						var userInput = $w('#input1').value;

						console.log('button3InViewOnly: ' + button3InViewOnly);


						SetGalleries(

							userInput,
							true,
							true,
							true,
							true

						);

						isRecommendedGalleryRecentlyInView = false;

					}

				}


			});

			// if Main Gallery is in view
			$w('#button3').onViewportEnter((event) => {

				isButton3InView = true;

			});

			$w('#button3').onViewportLeave((event) => {

				isButton3InView = false;
				isRecommendedGalleryRecentlyInView = false;

				console.log('4: ' + isButton4InView + ' 5: ' + isButton5InView + ' 3: ' + isButton3InView);


			});

			// if Recommended Gallery's top button is in View
			$w('#button4').onViewportEnter((event) => {

				isButton4InView = true;
				isRecommendedGalleryRecentlyInView = true;

				console.log('');
				console.log('4: ' + isButton4InView + ' 5: ' + isButton5InView + ' 3: ' + isButton3InView);


				// both Recommended and Main Gallery are (fully) in view, show their links
				if (isButton5InView == true && isButton3InView == true){

					var userInput = $w('#input1').value;

					SetGalleries(
						userInput,
						true,
						true,
						true,
						true
					);

				}

				// only Recommended Gallery is in view, show its links only  -> PAUSED
				else if (isButton5InView == true && isButton3InView == false){

					var userInput = $w('#input1').value;

					SetGalleries(

						userInput,
						true,
						true,
						true,
						true

					);

				}

				// only Recommended Gallery is in view, show it's links only -> PAUSED
				else if (isButton5InView == false && isButton3InView == false){

					var userInput = $w('#input1').value;

					SetGalleries(

						userInput,
						true,
						true,
						true,
						true

					);

				}

			});


			// if Recommended Gallery's top button is not in
			$w('#button4').onViewportLeave((event) => {

				isButton4InView = false;
				console.log('');
				console.log('4: ' + isButton4InView + ' 5: ' + isButton5InView + ' 3: ' + isButton3InView);


			});



			console.log('got here 14');


			// $w('#button5').onViewportEnter((event) => {
			//
			// 	var userInput = $w('#input1').value;
			// 	SetGalleries('', true);
//
			// 	console.log("$w('#gallery1').next(): " + $w('#gallery1').next.);
			//
			// });




			// $w('#gallery1').items = orderProducts(shoesAndMoreWomen, 'SHOE', 3);
			// mainGalleryCopy = $w('#gallery1').items;
			// $w('#gallery1').show();
		}



	}, timeOut);



})

// // function to check the number of whether or not an item is in list
function isItemsInList(
	containerlist,
	listOfItemsToSearchFor,
){
	var responseList = [];

	for (var indexOfItemToSearchFor in listOfItemsToSearchFor){

		// check whether or not the current item to search for is within the container list, if so return true and vice versa
		var response = containerlist.filter((itemWithinList) => {
			// console.log(itemWithinList, listOfItemsToSearchFor[indexOfItemToSearchFor]);
			return itemWithinList == listOfItemsToSearchFor[indexOfItemToSearchFor];
		}).length > 0;

		// console.log('response: ' + response);
		if (response == true){
			responseList.push(true)
		}
	}

	if (responseList.length > 0){
		return true;
	}
	else{
		return false
	}

}

// function openTarget(event){
//
// 	// $w('#button1').link = dbQueryAllResponseItems[Number(event.item.slug)].productlink;
// 				$w('#button1').target = '_blank';
// 				$w('#button1').enable();
// 				// $w('#html1').postMessage('click');
// 				// console.log('event.item.slug: ' + event.item.slug);
// 				// console.log('productlink: ' + dbQueryAllResponseItems[Number(event.item.slug)].productlink);
// 				console.log(event.item.slug);
// 				console.log($w('#button1').link);
// 				console.log($w('#button1').id);
// 				console.log($w('#button1').label);
//
// 				$w('#button1').onClick((event) => {
//
// 					$w('#button1').link = '';
//
// 				});
//
// }


// SORT DISPLAY -> MAIN GALLERY
function SetGalleries(
	userInput,
	isMainGallery = true,
	isShowLinksMainGallery = true,
	isRecommendedGalleryForDesktop = true,
	isShowLinksRecommendedGallery = true,

	){
		// console.log('Got in Set Galleries');

	// console.log('isShowLinksMainGallery: ' + isShowLinksMainGallery);

	var currentProductCategory = $w('#dropdown3').value;
	var currentSortValue = $w('#dropdown5').value;
	var hideAmazonButtonValue = $w('#button2').label;

	// console.log('dropdown 3 value: ' + currentProductCategory);

	// console.log('hideAmazonButtonValue: ' + hideAmazonButtonValue);

	var gender = $w('#dropdown1').value;

	// setting recommended gallery
	if (isRecommendedGalleryForDesktop == true){

			// var productsInFocusSortedByRelevanceMobile = [];
			// var productsInFocusSortedByRelevanceDesktop = [];

			var productsInFocusSortedByRelevanceDesktop = orderProducts(recommendedForWomen, 'None', 3, isShowLinksRecommendedGallery);

			console.log('GOT HERE 1');

			$w('#recommendedForWomenGallery').items = productsInFocusSortedByRelevanceDesktop;


	}
	if (isMainGallery == true){

		// console.log('Got in MainGallery');

		// setting main gallery
		if (gender == 'Women'){

			// product categories that pertain to women
			if (currentProductCategory == 'Recommended'){


				// console.log('Calculated Recommended For Mobile');

				// console.log('within recommended:');

				// var productsInFocusSortedByRelevanceMobile = orderProducts(handbagsAndMoreWomen, 'HANDBAG', 2);
				// var productsInFocusSortedByRelevanceDesktop = orderProducts(handbagsAndMoreWomen, 'HANDBAG', 3);

				var productsInFocusSortedByRelevanceMobile = [];
				var productsInFocusSortedByRelevanceDesktop = [];

				if (hideAmazonButtonValue == 'Show Amazon Products'){
					// console.log('here hideAmazonButtonValue1start');
					var productsInFocusSortedByRelevanceMobile = orderProducts(recommendedForWomenAmazonless, 'None', 3, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(recommendedForWomenAmazonless, 'None', 3, isShowLinksMainGallery);
					// console.log('here hideAmazonButtonValue1end');
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					// console.log('here hideAmazonButtonValue2start');
					var productsInFocusSortedByRelevanceMobile = orderProducts(recommendedForWomen, 'None', 3, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(recommendedForWomen, 'None', 3, isShowLinksMainGallery);
					// console.log('here hideAmazonButtonValue1end');
				}

				// console.log('recommended gallery length: ' + productsInFocusSortedByRelevanceMobile);

				// filtering by brand name or product name..
				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){

					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
					&& !userInput.includes('\\') && !userInput.includes('=')
					&& !userInput.includes('==')){

						var itemCounter = 0;
						var productsListInFocus = [];

						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
							productsListInFocus = productsInFocusSortedByRelevanceMobile;
						}
						else if (wixWindow.formFactor === "Desktop"){
							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
						}

						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));

						while (itemCounter < lengthOfProductListInFocus){


							var currentItem = productsListInFocus[0];

							// console.log('currentItem: ' + currentItem);
							// console.log('itemCounter: ' + itemCounter);


							var currentItemsTitle = currentItem.title;
							var currentItemsLink = currentItem.link;
							// console.log('currentItemsLink: ' + currentItemsLink)

							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);

							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
							// console.log('productsListInFocus length: ' + productsListInFocus.length);
							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);

							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								productsListInFocus.push(currentItem);
								productsListInFocus.splice(0, 1);

								console.log(currentItemsLink + ' includes ' + userInput);

							}

							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								console.log(currentItemsLink + ' does not includes ' + userInput);
								productsListInFocus.splice(0, 1);

							}

							itemCounter += 1;

						}

						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
						// }
						// else if (wixWindow.formFactor === "Desktop"){
						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
						// }

						console.log(productsListInFocus.length);


						}

				}


				// fixing display by sort value
				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){


					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
						console.log('Calculated Recommended For Mobile - Relevance');

					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceMobile.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];

							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile; //

					}


					mainGalleryCopy = $w('#gallery1').items;
				}
				else if(wixWindow.formFactor === "Desktop"){

					if (currentSortValue == 'Relevance'){
						// if (isShowLinksMainGallery == true){
						// 	$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop; //
						// }
						// else{
						// 	$w('#gallery1').items = handbagsAndMoreWomen; //
						// }

						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
				}





			}

			// product categories that pertain to women
			else if (currentProductCategory == 'Bags & Jewelleries'){

				// var productsInFocusSortedByRelevanceMobile = orderProducts(handbagsAndMoreWomen, 'HANDBAG', 2);
				// var productsInFocusSortedByRelevanceDesktop = orderProducts(handbagsAndMoreWomen, 'HANDBAG', 3);

				var productsInFocusSortedByRelevanceMobile = [];
				var productsInFocusSortedByRelevanceDesktop = [];

				if (hideAmazonButtonValue == 'Show Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(handbagsAndMoreWomenAmazonless, 'HANDBAG', 2, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(handbagsAndMoreWomenAmazonless, 'HANDBAG', 3, isShowLinksMainGallery);
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(handbagsAndMoreWomen, 'HANDBAG', 2, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(handbagsAndMoreWomen, 'HANDBAG', 3, isShowLinksMainGallery);
				}

				// filtering by brand name or product name..
				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){

					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
					&& !userInput.includes('\\') && !userInput.includes('=')
					&& !userInput.includes('==')){

						var itemCounter = 0;
						var productsListInFocus = [];

						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
							productsListInFocus = productsInFocusSortedByRelevanceMobile;
						}
						else if (wixWindow.formFactor === "Desktop"){
							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
						}

						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));

						while (itemCounter < lengthOfProductListInFocus){


							var currentItem = productsListInFocus[0];

							// console.log('currentItem: ' + currentItem);
							// console.log('itemCounter: ' + itemCounter);


							var currentItemsTitle = currentItem.title;
							var currentItemsLink = currentItem.link;
							// console.log('currentItemsLink: ' + currentItemsLink)

							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);

							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
							// console.log('productsListInFocus length: ' + productsListInFocus.length);
							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);

							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								productsListInFocus.push(currentItem);
								productsListInFocus.splice(0, 1);

								console.log(currentItemsLink + ' includes ' + userInput);

							}

							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								console.log(currentItemsLink + ' does not includes ' + userInput);
								productsListInFocus.splice(0, 1);

							}

							itemCounter += 1;

						}

						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
						// }
						// else if (wixWindow.formFactor === "Desktop"){
						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
						// }

						console.log(productsListInFocus.length);


						}

				}


				// fixing display by sort value
				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){


					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceMobile.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];

							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile; //
					}


					mainGalleryCopy = $w('#gallery1').items;
				}
				else if(wixWindow.formFactor === "Desktop"){

					if (currentSortValue == 'Relevance'){
						// if (isShowLinksMainGallery == true){
						// 	$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop; //
						// }
						// else{
						// 	$w('#gallery1').items = handbagsAndMoreWomen; //
						// }

						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
				}





			}
			else if (currentProductCategory == 'Necklaces & Earrings'){

				// var productsInFocusSortedByRelevanceMobile = orderProducts(handbagsAndMoreWomen, 'HANDBAG', 2);
				// var productsInFocusSortedByRelevanceDesktop = orderProducts(handbagsAndMoreWomen, 'HANDBAG', 3);

				var productsInFocusSortedByRelevanceMobile = [];
				var productsInFocusSortedByRelevanceDesktop = [];

				if (hideAmazonButtonValue == 'Show Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(shoesAndMoreWomenAmazonless, 'SHOE', 2, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(shoesAndMoreWomenAmazonless, 'SHOE', 3, isShowLinksMainGallery);
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(shoesAndMoreWomen, 'SHOE', 2, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(shoesAndMoreWomen, 'SHOE', 3, isShowLinksMainGallery);
				}

				// filtering by brand name or product name..
				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){

					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
					&& !userInput.includes('\\') && !userInput.includes('=')
					&& !userInput.includes('==')){

						var itemCounter = 0;
						var productsListInFocus = [];

						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
							productsListInFocus = productsInFocusSortedByRelevanceMobile;
						}
						else if (wixWindow.formFactor === "Desktop"){
							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
						}

						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));

						while (itemCounter < lengthOfProductListInFocus){


							var currentItem = productsListInFocus[0];

							// console.log('currentItem: ' + currentItem);
							// console.log('itemCounter: ' + itemCounter);


							var currentItemsTitle = currentItem.title;
							var currentItemsLink = currentItem.link;
							// console.log('currentItemsLink: ' + currentItemsLink)

							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);

							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
							// console.log('productsListInFocus length: ' + productsListInFocus.length);
							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);

							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								productsListInFocus.push(currentItem);
								productsListInFocus.splice(0, 1);

								console.log(currentItemsLink + ' includes ' + userInput);

							}

							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								console.log(currentItemsLink + ' does not includes ' + userInput);
								productsListInFocus.splice(0, 1);

							}

							itemCounter += 1;
						}

						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
						// }
						// else if (wixWindow.formFactor === "Desktop"){
						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
						// }

						console.log(productsListInFocus.length);


						}

				}


				// fixing display by sort value
				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){


					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceMobile.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];

							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile; //
					}


					mainGalleryCopy = $w('#gallery1').items;
				}
				else if(wixWindow.formFactor === "Desktop"){

					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
				}





			}
			else if (currentProductCategory == 'Furnitures'){

				// var productsInFocusSortedByRelevanceMobile = orderProducts(furnituresMenAndWomen, 'FURNITURE', 2);
				// var productsInFocusSortedByRelevanceDesktop = orderProducts(furnituresMenAndWomen, 'FURNITURE', 2);

				var productsInFocusSortedByRelevanceMobile = [];
				var productsInFocusSortedByRelevanceDesktop = [];

				if (hideAmazonButtonValue == 'Show Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(furnituresMenAndWomenAmazonless, 'FURNITURE', 2, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(furnituresMenAndWomenAmazonless, 'FURNITURE', 2, isShowLinksMainGallery);
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(furnituresMenAndWomen, 'FURNITURE', 2, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(furnituresMenAndWomen, 'FURNITURE', 2, isShowLinksMainGallery);
				}

				// filtering by brand name or product name..
				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){

					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
					&& !userInput.includes('\\') && !userInput.includes('=')
					&& !userInput.includes('==')){

						var itemCounter = 0;
						var productsListInFocus = [];

						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
							productsListInFocus = productsInFocusSortedByRelevanceMobile;
						}
						else if (wixWindow.formFactor === "Desktop"){
							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
						}

						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));

						while (itemCounter < lengthOfProductListInFocus){


							var currentItem = productsListInFocus[0];

							// console.log('currentItem: ' + currentItem);
							// console.log('itemCounter: ' + itemCounter);


							var currentItemsTitle = currentItem.title;
							var currentItemsLink = currentItem.link;
							// console.log('currentItemsLink: ' + currentItemsLink)

							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);

							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
							// console.log('productsListInFocus length: ' + productsListInFocus.length);
							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);

							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								productsListInFocus.push(currentItem);
								productsListInFocus.splice(0, 1);

								console.log(currentItemsLink + ' includes ' + userInput);

							}

							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								console.log(currentItemsLink + ' does not includes ' + userInput);
								productsListInFocus.splice(0, 1);

							}

							itemCounter += 1;
						}

						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
						// }
						// else if (wixWindow.formFactor === "Desktop"){
						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
						// }

						console.log(productsListInFocus.length);


						}

				}


				// fixing display by sort value
				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){


					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceMobile.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];

							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}


					mainGalleryCopy = $w('#gallery1').items;
				}
				else if(wixWindow.formFactor === "Desktop"){

					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
				}



			}
			else if (currentProductCategory == 'Electronics'){

				// var productsInFocusSortedByRelevanceMobile = orderProducts(furnituresMenAndWomen, 'FURNITURE', 2);
				// var productsInFocusSortedByRelevanceDesktop = orderProducts(furnituresMenAndWomen, 'FURNITURE', 2);

				var productsInFocusSortedByRelevanceMobile = [];
				var productsInFocusSortedByRelevanceDesktop = [];

				if (hideAmazonButtonValue == 'Show Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(luxuryTechWomenAmazonless, '', 0, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(luxuryTechWomenAmazonless, '', 0, isShowLinksMainGallery);
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(luxuryTechWomen, '', 0, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(luxuryTechWomen, '', 0, isShowLinksMainGallery);
				}

				// filtering by brand name or product name..
				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){

					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
					&& !userInput.includes('\\') && !userInput.includes('=')
					&& !userInput.includes('==')){

						var itemCounter = 0;
						var productsListInFocus = [];

						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
							productsListInFocus = productsInFocusSortedByRelevanceMobile;
						}
						else if (wixWindow.formFactor === "Desktop"){
							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
						}

						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));

						while (itemCounter < lengthOfProductListInFocus){


							var currentItem = productsListInFocus[0];

							// console.log('currentItem: ' + currentItem);
							// console.log('itemCounter: ' + itemCounter);


							var currentItemsTitle = currentItem.title;
							var currentItemsLink = currentItem.link;
							// console.log('currentItemsLink: ' + currentItemsLink)

							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);

							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
							// console.log('productsListInFocus length: ' + productsListInFocus.length);
							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);

							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								productsListInFocus.push(currentItem);
								productsListInFocus.splice(0, 1);

								console.log(currentItemsLink + ' includes ' + userInput);

							}

							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								console.log(currentItemsLink + ' does not includes ' + userInput);
								productsListInFocus.splice(0, 1);

							}

							itemCounter += 1;
						}

						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
						// }
						// else if (wixWindow.formFactor === "Desktop"){
						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
						// }

						console.log(productsListInFocus.length);


						}

				}


				// fixing display by sort value
				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){


					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceMobile.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];

							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}


					mainGalleryCopy = $w('#gallery1').items;
				}
				else if(wixWindow.formFactor === "Desktop"){

					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
				}



			}
			else if (currentProductCategory == 'Clothes'){

				// var productsInFocusSortedByRelevanceMobile = orderProducts(clothesAndPerfumesWomen, 'CLOTHING', 2, isShowLinksMainGallery);
				// var productsInFocusSortedByRelevanceDesktop = orderProducts(clothesAndPerfumesWomen, 'CLOTHING', 3, isShowLinksMainGallery);

				var productsInFocusSortedByRelevanceMobile = [];
				var productsInFocusSortedByRelevanceDesktop = [];

				if (hideAmazonButtonValue == 'Show Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(clothesAndPerfumesWomenAmazonless, 'CLOTHING', 2, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(clothesAndPerfumesWomenAmazonless, 'CLOTHING', 3, isShowLinksMainGallery);
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(clothesAndPerfumesWomen, 'CLOTHING', 2, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(clothesAndPerfumesWomen, 'CLOTHING', 3, isShowLinksMainGallery);
				}

				// filtering by brand name or product name..
				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){

					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
					&& !userInput.includes('\\') && !userInput.includes('=')
					&& !userInput.includes('==')){

						var itemCounter = 0;
						var productsListInFocus = [];

						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
							productsListInFocus = productsInFocusSortedByRelevanceMobile;
						}
						else if (wixWindow.formFactor === "Desktop"){
							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
						}

						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));

						while (itemCounter < lengthOfProductListInFocus){


							var currentItem = productsListInFocus[0];

							// console.log('currentItem: ' + currentItem);
							// console.log('itemCounter: ' + itemCounter);


							var currentItemsTitle = currentItem.title;
							var currentItemsLink = currentItem.link;
							// console.log('currentItemsLink: ' + currentItemsLink)

							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);

							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
							// console.log('productsListInFocus length: ' + productsListInFocus.length);
							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);

							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								productsListInFocus.push(currentItem);
								productsListInFocus.splice(0, 1);

								console.log(currentItemsLink + ' includes ' + userInput);

							}

							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								console.log(currentItemsLink + ' does not includes ' + userInput);
								productsListInFocus.splice(0, 1);

							}

							itemCounter += 1;
						}

						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
						// }
						// else if (wixWindow.formFactor === "Desktop"){
						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
						// }

						console.log(productsListInFocus.length);


						}

				}


				// fixing display by sort value
				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){


					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceMobile.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];

							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}


					mainGalleryCopy = $w('#gallery1').items;
				}
				else if(wixWindow.formFactor === "Desktop"){

					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
				}


			}
			else if (currentProductCategory == 'Rings'){

				// var productsInFocusSortedByRelevanceMobile = orderProducts(flowersAndRingsWomen, 'RING', 2, isShowLinksMainGallery);
				// var productsInFocusSortedByRelevanceDesktop = orderProducts(flowersAndRingsWomen, 'RING', 3, isShowLinksMainGallery);

				var productsInFocusSortedByRelevanceMobile = [];
				var productsInFocusSortedByRelevanceDesktop = [];

				if (hideAmazonButtonValue == 'Show Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(flowersAndRingsWomenAmazonless, 'RING', 2, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(flowersAndRingsWomenAmazonless, 'RING', 3, isShowLinksMainGallery);
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(flowersAndRingsWomen, 'RING', 2, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(flowersAndRingsWomen, 'RING', 3, isShowLinksMainGallery);
				}

				// filtering by brand name or product name..
				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){

					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
					&& !userInput.includes('\\') && !userInput.includes('=')
					&& !userInput.includes('==')){

						var itemCounter = 0;
						var productsListInFocus = [];

						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
							productsListInFocus = productsInFocusSortedByRelevanceMobile;
						}
						else if (wixWindow.formFactor === "Desktop"){
							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
						}

						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));

						while (itemCounter < lengthOfProductListInFocus){


							var currentItem = productsListInFocus[0];

							// console.log('currentItem: ' + currentItem);
							// console.log('itemCounter: ' + itemCounter);


							var currentItemsTitle = currentItem.title;
							var currentItemsLink = currentItem.link;
							// console.log('currentItemsLink: ' + currentItemsLink)

							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);

							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
							// console.log('productsListInFocus length: ' + productsListInFocus.length);
							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);

							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								productsListInFocus.push(currentItem);
								productsListInFocus.splice(0, 1);

								console.log(currentItemsLink + ' includes ' + userInput);

							}

							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								console.log(currentItemsLink + ' does not includes ' + userInput);
								productsListInFocus.splice(0, 1);

							}

							itemCounter += 1;
						}

						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
						// }
						// else if (wixWindow.formFactor === "Desktop"){
						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
						// }

						console.log(productsListInFocus.length);


						}

				}


				// fixing display by sort value
				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){


					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceMobile.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];

							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}


					mainGalleryCopy = $w('#gallery1').items;
				}
				else if(wixWindow.formFactor === "Desktop"){

					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
				}

			}
			else if (currentProductCategory == 'Travel Bags & Other Bags'){

				// var productsInFocusSortedByRelevanceMobile = orderProducts(travelBagsAndOtherBagsWomen, 'TRAVEL BAG', 2);
				// var productsInFocusSortedByRelevanceDesktop = orderProducts(travelBagsAndOtherBagsWomen, 'TRAVEL BAG', 3);

				var productsInFocusSortedByRelevanceMobile = [];
				var productsInFocusSortedByRelevanceDesktop = [];

				if (hideAmazonButtonValue == 'Show Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(travelBagsAndOtherBagsWomenAmazonless, 'TRAVEL BAG', 2, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(travelBagsAndOtherBagsWomenAmazonless, 'TRAVEL BAG', 3, isShowLinksMainGallery);
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(travelBagsAndOtherBagsWomen, 'TRAVEL BAG', 2, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(travelBagsAndOtherBagsWomen, 'TRAVEL BAG', 3, isShowLinksMainGallery);
				}

				// filtering by brand name or product name..
				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){

					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
					&& !userInput.includes('\\') && !userInput.includes('=')
					&& !userInput.includes('==')){

						var itemCounter = 0;
						var productsListInFocus = [];

						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
							productsListInFocus = productsInFocusSortedByRelevanceMobile;
						}
						else if (wixWindow.formFactor === "Desktop"){
							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
						}

						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));

						while (itemCounter < lengthOfProductListInFocus){


							var currentItem = productsListInFocus[0];

							// console.log('currentItem: ' + currentItem);
							// console.log('itemCounter: ' + itemCounter);


							var currentItemsTitle = currentItem.title;
							var currentItemsLink = currentItem.link;
							// console.log('currentItemsLink: ' + currentItemsLink)

							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);

							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
							// console.log('productsListInFocus length: ' + productsListInFocus.length);
							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);

							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								productsListInFocus.push(currentItem);
								productsListInFocus.splice(0, 1);

								console.log(currentItemsLink + ' includes ' + userInput);

							}

							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								console.log(currentItemsLink + ' does not includes ' + userInput);
								productsListInFocus.splice(0, 1);

							}

							itemCounter += 1;
						}

						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
						// }
						// else if (wixWindow.formFactor === "Desktop"){
						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
						// }

						console.log(productsListInFocus.length);


						}

				}


				// fixing display by sort value
				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){


					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceMobile.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];

							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}


					mainGalleryCopy = $w('#gallery1').items;
				}
				else if(wixWindow.formFactor === "Desktop"){

					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
				}

			}
			else if (currentProductCategory == 'Other Accessories'){

				// var productsInFocusSortedByRelevanceMobile = orderProducts(otherAccessoriesWomen, 'ACCESSORIES', 2);
				// var productsInFocusSortedByRelevanceDesktop = orderProducts(otherAccessoriesWomen, 'ACCESSORIES', 3);

				var productsInFocusSortedByRelevanceMobile = [];
				var productsInFocusSortedByRelevanceDesktop = [];

				if (hideAmazonButtonValue == 'Show Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(otherAccessoriesWomenAmazonless, 'ACCESSORIES', 2, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(otherAccessoriesWomenAmazonless, 'ACCESSORIES', 3, isShowLinksMainGallery);
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(otherAccessoriesWomen, 'ACCESSORIES', 2, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(otherAccessoriesWomen, 'ACCESSORIES', 3, isShowLinksMainGallery);
				}

				// filtering by brand name or product name..
				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){

					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
					&& !userInput.includes('\\') && !userInput.includes('=')
					&& !userInput.includes('==')){

						var itemCounter = 0;
						var productsListInFocus = [];

						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
							productsListInFocus = productsInFocusSortedByRelevanceMobile;
						}
						else if (wixWindow.formFactor === "Desktop"){
							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
						}

						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));

						while (itemCounter < lengthOfProductListInFocus){


							var currentItem = productsListInFocus[0];

							// console.log('currentItem: ' + currentItem);
							// console.log('itemCounter: ' + itemCounter);


							var currentItemsTitle = currentItem.title;
							var currentItemsLink = currentItem.link;
							// console.log('currentItemsLink: ' + currentItemsLink)

							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);

							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
							// console.log('productsListInFocus length: ' + productsListInFocus.length);
							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);

							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								productsListInFocus.push(currentItem);
								productsListInFocus.splice(0, 1);

								console.log(currentItemsLink + ' includes ' + userInput);

							}

							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								console.log(currentItemsLink + ' does not includes ' + userInput);
								productsListInFocus.splice(0, 1);

							}

							itemCounter += 1;
						}

						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
						// }
						// else if (wixWindow.formFactor === "Desktop"){
						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
						// }

						console.log(productsListInFocus.length);


						}

				}


				// fixing display by sort value
				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){


					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceMobile.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];

							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}


					mainGalleryCopy = $w('#gallery1').items;
				}
				else if(wixWindow.formFactor === "Desktop"){

					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}

				}



			}
			else if (currentProductCategory == 'Gifts For Him'){

				// var productsInFocusSortedByRelevanceMobile = orderProducts(giftsForHim, 'WATCHES', 2);
				// var productsInFocusSortedByRelevanceDesktop = orderProducts(giftsForHim, 'WATCHES', 3);

				var productsInFocusSortedByRelevanceMobile = [];
				var productsInFocusSortedByRelevanceDesktop = [];

				if (hideAmazonButtonValue == 'Show Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(giftsForHimAmazonless, 'WATCHES', 2, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(giftsForHimAmazonless, 'WATCHES', 3, isShowLinksMainGallery);
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					console.log('in gifts for him amazon');
					var productsInFocusSortedByRelevanceMobile = orderProducts(giftsForHim, 'WATCHES', 2, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(giftsForHim, 'WATCHES', 3, isShowLinksMainGallery);
				}

				// filtering by brand name or product name..
				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){

					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
					&& !userInput.includes('\\') && !userInput.includes('=')
					&& !userInput.includes('==')){

						var itemCounter = 0;
						var productsListInFocus = [];

						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
							productsListInFocus = productsInFocusSortedByRelevanceMobile;
						}
						else if (wixWindow.formFactor === "Desktop"){
							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
						}

						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));

						while (itemCounter < lengthOfProductListInFocus){


							var currentItem = productsListInFocus[0];

							// console.log('currentItem: ' + currentItem);
							// console.log('itemCounter: ' + itemCounter);


							var currentItemsTitle = currentItem.title;
							var currentItemsLink = currentItem.link;
							// console.log('currentItemsLink: ' + currentItemsLink)

							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);

							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
							// console.log('productsListInFocus length: ' + productsListInFocus.length);
							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);

							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								productsListInFocus.push(currentItem);
								productsListInFocus.splice(0, 1);

								console.log(currentItemsLink + ' includes ' + userInput);

							}

							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								console.log(currentItemsLink + ' does not includes ' + userInput);
								productsListInFocus.splice(0, 1);

							}

							itemCounter += 1;
						}

						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
						// }
						// else if (wixWindow.formFactor === "Desktop"){
						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
						// }

						console.log(productsListInFocus.length);


						}

				}


				// fixing display by sort value
				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){


					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceMobile.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];

							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}


					mainGalleryCopy = $w('#gallery1').items;
				}
				else if(wixWindow.formFactor === "Desktop"){

					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
				}


			}
		}

		else if (gender == 'Men'){

			if (currentProductCategory == 'Shoes & Watches'){

				// var productsInFocusSortedByRelevanceMobile = orderProducts(shoesAndWatchesMen, 'SHOE', 1);
				// var productsInFocusSortedByRelevanceDesktop = orderProducts(shoesAndWatchesMen, 'SHOE', 1);

				var productsInFocusSortedByRelevanceMobile = [];
				var productsInFocusSortedByRelevanceDesktop = [];

				if (hideAmazonButtonValue == 'Show Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(shoesAndWatchesMenAmazonless, 'SHOE', 1, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(shoesAndWatchesMenAmazonless, 'SHOE', 1, isShowLinksMainGallery);
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(shoesAndWatchesMen, 'SHOE', 1, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(shoesAndWatchesMen, 'SHOE', 1, isShowLinksMainGallery);
				}

				// filtering by brand name or product name..
				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){

					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
					&& !userInput.includes('\\') && !userInput.includes('=')
					&& !userInput.includes('==')){

						var itemCounter = 0;
						var productsListInFocus = [];

						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
							productsListInFocus = productsInFocusSortedByRelevanceMobile;
						}
						else if (wixWindow.formFactor === "Desktop"){
							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
						}

						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));

						while (itemCounter < lengthOfProductListInFocus){


							var currentItem = productsListInFocus[0];

							// console.log('currentItem: ' + currentItem);
							// console.log('itemCounter: ' + itemCounter);


							var currentItemsTitle = currentItem.title;
							var currentItemsLink = currentItem.link;
							// console.log('currentItemsLink: ' + currentItemsLink)

							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);

							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
							// console.log('productsListInFocus length: ' + productsListInFocus.length);
							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);

							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								productsListInFocus.push(currentItem);
								productsListInFocus.splice(0, 1);

								console.log(currentItemsLink + ' includes ' + userInput);

							}

							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								console.log(currentItemsLink + ' does not includes ' + userInput);
								productsListInFocus.splice(0, 1);

							}

							itemCounter += 1;
						}

						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
						// }
						// else if (wixWindow.formFactor === "Desktop"){
						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
						// }

						console.log(productsListInFocus.length);


						}

				}


				// fixing display by sort value
				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){


					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceMobile.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];

							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}


					mainGalleryCopy = $w('#gallery1').items;
				}
				else if(wixWindow.formFactor === "Desktop"){

					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
				}

			}
			else if (currentProductCategory == 'Necklaces & Bracelets'){


				// var productsInFocusSortedByRelevanceMobile = orderProducts(necklacesAndBraceletsMen, 'NECKLACE', 2);
				// var productsInFocusSortedByRelevanceDesktop = orderProducts(necklacesAndBraceletsMen, 'NECKLACE', 3);

				var productsInFocusSortedByRelevanceMobile = [];
				var productsInFocusSortedByRelevanceDesktop = [];

				if (hideAmazonButtonValue == 'Show Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(necklacesAndBraceletsMenAmazonless, 'NECKLACE', 2, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(necklacesAndBraceletsMenAmazonless, 'NECKLACE', 3, isShowLinksMainGallery);
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(necklacesAndBraceletsMen, 'NECKLACE', 2, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(necklacesAndBraceletsMen, 'NECKLACE', 3, isShowLinksMainGallery);
				}

				// filtering by brand name or product name..
				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){

					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
					&& !userInput.includes('\\') && !userInput.includes('=')
					&& !userInput.includes('==')){

						var itemCounter = 0;
						var productsListInFocus = [];

						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
							productsListInFocus = productsInFocusSortedByRelevanceMobile;
						}
						else if (wixWindow.formFactor === "Desktop"){
							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
						}

						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));

						while (itemCounter < lengthOfProductListInFocus){


							var currentItem = productsListInFocus[0];

							// console.log('currentItem: ' + currentItem);
							// console.log('itemCounter: ' + itemCounter);


							var currentItemsTitle = currentItem.title;
							var currentItemsLink = currentItem.link;
							// console.log('currentItemsLink: ' + currentItemsLink)

							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);

							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
							// console.log('productsListInFocus length: ' + productsListInFocus.length);
							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);

							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								productsListInFocus.push(currentItem);
								productsListInFocus.splice(0, 1);

								console.log(currentItemsLink + ' includes ' + userInput);

							}

							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								console.log(currentItemsLink + ' does not includes ' + userInput);
								productsListInFocus.splice(0, 1);

							}

							itemCounter += 1;
						}

						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
						// }
						// else if (wixWindow.formFactor === "Desktop"){
						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
						// }

						console.log(productsListInFocus.length);


						}

				}


				// fixing display by sort value
				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){


					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceMobile.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];

							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}


					mainGalleryCopy = $w('#gallery1').items;
				}
				else if(wixWindow.formFactor === "Desktop"){

					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
				}


			}
			else if (currentProductCategory == 'Furnitures'){

				// var productsInFocusSortedByRelevanceMobile = orderProducts(furnituresMenAndWomen, 'FURNITURE', 2);
				// var productsInFocusSortedByRelevanceDesktop = orderProducts(furnituresMenAndWomen, 'FURNITURE', 3);

				var productsInFocusSortedByRelevanceMobile = [];
				var productsInFocusSortedByRelevanceDesktop = [];

				if (hideAmazonButtonValue == 'Show Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(furnituresMenAndWomenAmazonless, 'FURNITURE', 2, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(furnituresMenAndWomenAmazonless, 'FURNITURE', 3, isShowLinksMainGallery);
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(furnituresMenAndWomen, 'FURNITURE', 2, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(furnituresMenAndWomen, 'FURNITURE', 3, isShowLinksMainGallery);
				}

				// filtering by brand name or product name..
				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){

					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
					&& !userInput.includes('\\') && !userInput.includes('=')
					&& !userInput.includes('==')){

						var itemCounter = 0;
						var productsListInFocus = [];

						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
							productsListInFocus = productsInFocusSortedByRelevanceMobile;
						}
						else if (wixWindow.formFactor === "Desktop"){
							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
						}

						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));

						while (itemCounter < lengthOfProductListInFocus){


							var currentItem = productsListInFocus[0];

							// console.log('currentItem: ' + currentItem);
							// console.log('itemCounter: ' + itemCounter);


							var currentItemsTitle = currentItem.title;
							var currentItemsLink = currentItem.link;
							// console.log('currentItemsLink: ' + currentItemsLink)

							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);

							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
							// console.log('productsListInFocus length: ' + productsListInFocus.length);
							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);

							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								productsListInFocus.push(currentItem);
								productsListInFocus.splice(0, 1);

								console.log(currentItemsLink + ' includes ' + userInput);

							}

							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								console.log(currentItemsLink + ' does not includes ' + userInput);
								productsListInFocus.splice(0, 1);

							}

							itemCounter += 1;
						}

						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
						// }
						// else if (wixWindow.formFactor === "Desktop"){
						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
						// }

						console.log(productsListInFocus.length);


						}

				}


				// fixing display by sort value
				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){


					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceMobile.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];

							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}


					mainGalleryCopy = $w('#gallery1').items;
				}
				else if(wixWindow.formFactor === "Desktop"){

					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
				}
			}
			else if (currentProductCategory == 'Electronics'){

				// var productsInFocusSortedByRelevanceMobile = orderProducts(furnituresMenAndWomen, 'FURNITURE', 2);
				// var productsInFocusSortedByRelevanceDesktop = orderProducts(furnituresMenAndWomen, 'FURNITURE', 3);

				var productsInFocusSortedByRelevanceMobile = [];
				var productsInFocusSortedByRelevanceDesktop = [];

				if (hideAmazonButtonValue == 'Show Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(luxuryTechMenAmazonless, '', 0, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(luxuryTechMenAmazonless, '', 0, isShowLinksMainGallery);
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(luxuryTechMen, '', 0, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(luxuryTechMen, '', 0, isShowLinksMainGallery);
				}

				// filtering by brand name or product name..
				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){

					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
					&& !userInput.includes('\\') && !userInput.includes('=')
					&& !userInput.includes('==')){

						var itemCounter = 0;
						var productsListInFocus = [];

						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
							productsListInFocus = productsInFocusSortedByRelevanceMobile;
						}
						else if (wixWindow.formFactor === "Desktop"){
							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
						}

						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));

						while (itemCounter < lengthOfProductListInFocus){


							var currentItem = productsListInFocus[0];

							// console.log('currentItem: ' + currentItem);
							// console.log('itemCounter: ' + itemCounter);


							var currentItemsTitle = currentItem.title;
							var currentItemsLink = currentItem.link;
							// console.log('currentItemsLink: ' + currentItemsLink)

							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);

							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
							// console.log('productsListInFocus length: ' + productsListInFocus.length);
							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);

							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								productsListInFocus.push(currentItem);
								productsListInFocus.splice(0, 1);

								console.log(currentItemsLink + ' includes ' + userInput);

							}

							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								console.log(currentItemsLink + ' does not includes ' + userInput);
								productsListInFocus.splice(0, 1);

							}

							itemCounter += 1;
						}

						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
						// }
						// else if (wixWindow.formFactor === "Desktop"){
						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
						// }

						console.log(productsListInFocus.length);


						}

				}


				// fixing display by sort value
				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){


					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceMobile.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];

							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}


					mainGalleryCopy = $w('#gallery1').items;
				}
				else if(wixWindow.formFactor === "Desktop"){

					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
				}
			}
			else if (currentProductCategory == 'Clothes'){

				// var productsInFocusSortedByRelevanceMobile = orderProducts(clothesAndPerfumesMen, 'CLOTHING', 2);
				// var productsInFocusSortedByRelevanceDesktop = orderProducts(clothesAndPerfumesMen, 'CLOTHING', 3);

				var productsInFocusSortedByRelevanceMobile = [];
				var productsInFocusSortedByRelevanceDesktop = [];

				if (hideAmazonButtonValue == 'Show Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(clothesAndPerfumesMenAmazonless, 'CLOTHING', 2, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(clothesAndPerfumesMenAmazonless, 'CLOTHING', 3, isShowLinksMainGallery);
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(clothesAndPerfumesMen, 'CLOTHING', 2, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(clothesAndPerfumesMen, 'CLOTHING', 3, isShowLinksMainGallery);
				}

				// filtering by brand name or product name..
				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){

					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
					&& !userInput.includes('\\') && !userInput.includes('=')
					&& !userInput.includes('==')){

						var itemCounter = 0;
						var productsListInFocus = [];

						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
							productsListInFocus = productsInFocusSortedByRelevanceMobile;
						}
						else if (wixWindow.formFactor === "Desktop"){
							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
						}

						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));

						while (itemCounter < lengthOfProductListInFocus){


							var currentItem = productsListInFocus[0];

							// console.log('currentItem: ' + currentItem);
							// console.log('itemCounter: ' + itemCounter);


							var currentItemsTitle = currentItem.title;
							var currentItemsLink = currentItem.link;
							// console.log('currentItemsLink: ' + currentItemsLink)

							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);

							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
							// console.log('productsListInFocus length: ' + productsListInFocus.length);
							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);

							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								productsListInFocus.push(currentItem);
								productsListInFocus.splice(0, 1);

								console.log(currentItemsLink + ' includes ' + userInput);

							}

							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								console.log(currentItemsLink + ' does not includes ' + userInput);
								productsListInFocus.splice(0, 1);

							}

							itemCounter += 1;
						}

						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
						// }
						// else if (wixWindow.formFactor === "Desktop"){
						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
						// }

						console.log(productsListInFocus.length);


						}

				}


				// fixing display by sort value
				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){


					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceMobile.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];

							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}


					mainGalleryCopy = $w('#gallery1').items;
				}
				else if(wixWindow.formFactor === "Desktop"){

					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
				}
			}
			else if (currentProductCategory == 'Rings'){

				// var productsInFocusSortedByRelevanceMobile = orderProducts(flowersAndRingsMen, 'RING', 2);
				// var productsInFocusSortedByRelevanceDesktop = orderProducts(flowersAndRingsMen, 'RING', 3);

				var productsInFocusSortedByRelevanceMobile = [];
				var productsInFocusSortedByRelevanceDesktop = [];

				if (hideAmazonButtonValue == 'Show Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(flowersAndRingsMenAmazonless, 'RING', 2, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(flowersAndRingsMenAmazonless, 'RING', 3, isShowLinksMainGallery);
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(flowersAndRingsMen, 'RING', 2, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(flowersAndRingsMen, 'RING', 3, isShowLinksMainGallery);
				}

				// filtering by brand name or product name..
				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){

					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
					&& !userInput.includes('\\') && !userInput.includes('=')
					&& !userInput.includes('==')){

						var itemCounter = 0;
						var productsListInFocus = [];

						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
							productsListInFocus = productsInFocusSortedByRelevanceMobile;
						}
						else if (wixWindow.formFactor === "Desktop"){
							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
						}

						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));

						while (itemCounter < lengthOfProductListInFocus){


							var currentItem = productsListInFocus[0];

							// console.log('currentItem: ' + currentItem);
							// console.log('itemCounter: ' + itemCounter);


							var currentItemsTitle = currentItem.title;
							var currentItemsLink = currentItem.link;
							// console.log('currentItemsLink: ' + currentItemsLink)

							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);

							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
							// console.log('productsListInFocus length: ' + productsListInFocus.length);
							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);

							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								productsListInFocus.push(currentItem);
								productsListInFocus.splice(0, 1);

								console.log(currentItemsLink + ' includes ' + userInput);

							}

							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								console.log(currentItemsLink + ' does not includes ' + userInput);
								productsListInFocus.splice(0, 1);

							}

							itemCounter += 1;
						}

						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
						// }
						// else if (wixWindow.formFactor === "Desktop"){
						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
						// }

						console.log(productsListInFocus.length);


						}

				}


				// fixing display by sort value
				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){


					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceMobile.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];

							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}


					mainGalleryCopy = $w('#gallery1').items;
				}
				else if(wixWindow.formFactor === "Desktop"){

					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
				}
			}
			else if (currentProductCategory == 'Travel Bags & Other Bags'){

				// var productsInFocusSortedByRelevanceMobile = orderProducts(travelBagsAndOtherBagsMen, 'TRAVEL BAG', 2);
				// var productsInFocusSortedByRelevanceDesktop = orderProducts(travelBagsAndOtherBagsMen, 'TRAVEL BAG', 3);

				var productsInFocusSortedByRelevanceMobile = [];
				var productsInFocusSortedByRelevanceDesktop = [];

				if (hideAmazonButtonValue == 'Show Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(travelBagsAndOtherBagsMenAmazonless, 'TRAVEL BAG', 2, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(travelBagsAndOtherBagsMenAmazonless, 'TRAVEL BAG', 3, isShowLinksMainGallery);
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(travelBagsAndOtherBagsMen, 'TRAVEL BAG', 2, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(travelBagsAndOtherBagsMen, 'TRAVEL BAG', 3, isShowLinksMainGallery);
				}

				// filtering by brand name or product name..
				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){

					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
					&& !userInput.includes('\\') && !userInput.includes('=')
					&& !userInput.includes('==')){

						var itemCounter = 0;
						var productsListInFocus = [];

						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
							productsListInFocus = productsInFocusSortedByRelevanceMobile;
						}
						else if (wixWindow.formFactor === "Desktop"){
							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
						}

						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));

						while (itemCounter < lengthOfProductListInFocus){


							var currentItem = productsListInFocus[0];

							// console.log('currentItem: ' + currentItem);
							// console.log('itemCounter: ' + itemCounter);


							var currentItemsTitle = currentItem.title;
							var currentItemsLink = currentItem.link;
							// console.log('currentItemsLink: ' + currentItemsLink)

							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);

							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
							// console.log('productsListInFocus length: ' + productsListInFocus.length);
							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);

							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								productsListInFocus.push(currentItem);
								productsListInFocus.splice(0, 1);

								console.log(currentItemsLink + ' includes ' + userInput);

							}

							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								console.log(currentItemsLink + ' does not includes ' + userInput);
								productsListInFocus.splice(0, 1);

							}

							itemCounter += 1;
						}

						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
						// }
						// else if (wixWindow.formFactor === "Desktop"){
						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
						// }

						console.log(productsListInFocus.length);


						}

				}


				// fixing display by sort value
				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){


					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceMobile.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];

							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}


					mainGalleryCopy = $w('#gallery1').items;
				}
				else if(wixWindow.formFactor === "Desktop"){

					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
				}

			}
			else if (currentProductCategory == 'Other Accessories'){

				// var productsInFocusSortedByRelevanceMobile = orderProducts(otherAccessoriesMen, 'ACCESSORIES', 2);
				// var productsInFocusSortedByRelevanceDesktop = orderProducts(otherAccessoriesMen, 'ACCESSORIES', 3);

				var productsInFocusSortedByRelevanceMobile = [];
				var productsInFocusSortedByRelevanceDesktop = [];

				if (hideAmazonButtonValue == 'Show Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(otherAccessoriesMenAmazonless, 'ACCESSORIES', 2, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(otherAccessoriesMenAmazonless, 'ACCESSORIES', 3, isShowLinksMainGallery);
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(otherAccessoriesMen, 'ACCESSORIES', 2, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(otherAccessoriesMen, 'ACCESSORIES', 3, isShowLinksMainGallery);
				}


				// filtering by brand name or product name..
				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){

					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
					&& !userInput.includes('\\') && !userInput.includes('=')
					&& !userInput.includes('==')){

						var itemCounter = 0;
						var productsListInFocus = [];

						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
							productsListInFocus = productsInFocusSortedByRelevanceMobile;
						}
						else if (wixWindow.formFactor === "Desktop"){
							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
						}

						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));

						while (itemCounter < lengthOfProductListInFocus){


							var currentItem = productsListInFocus[0];

							// console.log('currentItem: ' + currentItem);
							// console.log('itemCounter: ' + itemCounter);


							var currentItemsTitle = currentItem.title;
							var currentItemsLink = currentItem.link;
							// console.log('currentItemsLink: ' + currentItemsLink)

							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);

							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
							// console.log('productsListInFocus length: ' + productsListInFocus.length);
							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);

							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								productsListInFocus.push(currentItem);
								productsListInFocus.splice(0, 1);

								console.log(currentItemsLink + ' includes ' + userInput);

							}

							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								console.log(currentItemsLink + ' does not includes ' + userInput);
								productsListInFocus.splice(0, 1);

							}

							itemCounter += 1;
						}

						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
						// }
						// else if (wixWindow.formFactor === "Desktop"){
						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
						// }

						console.log(productsListInFocus.length);


						}

				}


				// fixing display by sort value
				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){


					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceMobile.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];

							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}


					mainGalleryCopy = $w('#gallery1').items;
				}
				else if(wixWindow.formFactor === "Desktop"){

					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
				}
			}
			else if (currentProductCategory == 'Gifts For Her'){

				// var productsInFocusSortedByRelevanceMobile = orderProducts(giftsForHer, 'NECKLACE', 1);
				// var productsInFocusSortedByRelevanceDesktop = orderProducts(giftsForHer, 'NECKLACE', 1);

				var productsInFocusSortedByRelevanceMobile = [];
				var productsInFocusSortedByRelevanceDesktop = [];

				if (hideAmazonButtonValue == 'Show Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(giftsForHerAmazonless, 'NECKLACE', 1, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(giftsForHerAmazonless, 'NECKLACE', 1, isShowLinksMainGallery);
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(giftsForHer, 'NECKLACE', 1, isShowLinksMainGallery);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(giftsForHer, 'NECKLACE', 1, isShowLinksMainGallery);
				}

				// filtering by brand name or product name..
				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){

					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
					&& !userInput.includes('\\') && !userInput.includes('=')
					&& !userInput.includes('==')){

						var itemCounter = 0;
						var productsListInFocus = [];

						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
							productsListInFocus = productsInFocusSortedByRelevanceMobile;
						}
						else if (wixWindow.formFactor === "Desktop"){
							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
						}

						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));

						while (itemCounter < lengthOfProductListInFocus){


							var currentItem = productsListInFocus[0];

							// console.log('currentItem: ' + currentItem);
							// console.log('itemCounter: ' + itemCounter);


							var currentItemsTitle = currentItem.title;
							var currentItemsLink = currentItem.link;
							// console.log('currentItemsLink: ' + currentItemsLink)

							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);

							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
							// console.log('productsListInFocus length: ' + productsListInFocus.length);
							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);

							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								productsListInFocus.push(currentItem);
								productsListInFocus.splice(0, 1);

								console.log(currentItemsLink + ' includes ' + userInput);

							}

							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){

								console.log(currentItemsLink + ' does not includes ' + userInput);
								productsListInFocus.splice(0, 1);

							}

							itemCounter += 1;
						}

						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
						// }
						// else if (wixWindow.formFactor === "Desktop"){
						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
						// }

						console.log(productsListInFocus.length);


						}

				}


				// fixing display by sort value
				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){


					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceMobile.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];

							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
					}


					mainGalleryCopy = $w('#gallery1').items;
				}
				else if(wixWindow.formFactor === "Desktop"){

					if (currentSortValue == 'Relevance'){
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Ascending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Price Descending'){
						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
					}
					else if (currentSortValue == 'Recently Added'){

						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {

							console.log('here: Recently Added');

							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];


							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
						});

						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop ;
					}
				}
			}


		}

	}

}

/// PRE - FVRR
// ordering product categories options' content(s)
// Most product categories options have up to 2 subcategories
function orderProducts(
	listOfCategoryOptionsProducts,
	mainCategoryName,
	positionOfSubcategoryFromMainCategory = 4,
	isShowLinksMainGallery = false,
	subcategoryOneName = 'None', // for future 'improve'
	subcategoryTwoName = 'None', // for future 'improve'
	currentItemIndexString = 'None'
){

	var orderedContent = [];

	// var initialValueofPositionOfSubcategoryFrommainCategoryVariable = positionOfSubcategoryFromMainCategory;
	var nonMainCategoryProductInsertIndex = positionOfSubcategoryFromMainCategory;

	// console.log('in order Products');
	// console.log('listOfCategoryOptionsProducts' + listOfCategoryOptionsProducts, listOfCategoryOptionsProducts[0]);

	// include the mainCategory in the orderedContent list first..
	for (var productIndex in listOfCategoryOptionsProducts){



		var originalCurrentProduct = listOfCategoryOptionsProducts[Number(productIndex)];
		var currentProduct = JSON.parse(JSON.stringify(originalCurrentProduct));
		var currentProductsSlug = currentProduct.slug;

		// console.log('in order Products, slug detected main category');

		if (currentProduct.link == mainCategoryName){

			if (isShowLinksMainGallery == true){
				var  currentProductEncodedLink = dbQueryAllResponseItems[Number(currentProductsSlug)].productlink;
				currentProduct.link = currentProductEncodedLink;

				// console.log('');
				// console.log('orderProducts - Added Product name:' + currentProduct.title);
				// console.log('orderProducts - Added Product link:' + currentProduct.link);
				// console.log('');
			}
			else if (isShowLinksMainGallery == false){
					currentProduct.link = 'https://www.gotquestions.org/personal-Savior.html?=READ-JOHN-3-16&ROMANS-10-9&10-SAY-THESE-WORDS?=LORD-JESUS-I-INVITE-YOU-INTO-MY-LIFE/BE-THE-LORD-OF-MY-LIFE/I-ACCEPT-YOU-AS-MY-LORD-AND-PERSONAL-SAVIOR/I-BELIEVE-THAT-YOU-DIED-ON-THE-CROSS-AND-ROSE-UP-FROM-THE-DEAD/LEAD-ME-AND-DIRECT-MY-PATH-IN-YOUR-PRECIOUS-NAME/AMEN?=IF-YOU-SAID-THESE-WORDS-WELCOME-TO-ETERNAL-LIFE/HALLELUYAH/REMAIN-CONSCIOUS-AND-MINDFUL-OF-THE-ETERNAL-LIFE-AND-THE-RIGHTEOUSNESS-OF-GOD-THAT-YOU-JUST-RECIEVED/WALK-IN-IT-AND-REMAIN-BLESSED?=LEARN&WALK-IN-HIS-COMMANDMENTS-AND-POWER/AMEN'
				}
			// else{
			// 	// console.log('');
			// 	// console.log('orderProducts - Added Product name:' + currentProduct.title);
			// 	// console.log('orderProducts - Added Product link:' + currentProduct.link);
			// 	// console.log('');
			// 	// console.log('else -> currentProduct.link: ' + currentProduct.link);
			// }

			// console.log('orderProducts: Pushed Product - ' + currentProduct.title, currentProduct.link);

			orderedContent.push(currentProduct);
		}
	}

	// console.log('');

	// include every other product whose category is not the main category..
	for (var productIndex in listOfCategoryOptionsProducts){

		var originalCurrentProduct = listOfCategoryOptionsProducts[Number(productIndex)];
		var currentProduct = JSON.parse(JSON.stringify(originalCurrentProduct));
		var currentProductsSlug = currentProduct.slug;

		// if the value that indicates where non main category products should be positioned
		// has not changed, insert the current non main category product at the 'positionOfSubcategoryFromMainCategory'
		// else place it just after the 'positionOfSubcategoryFromMainCategory'. This helps ensure that non main category products are
		// positioned evenly..
		// if (nonMainCategoryProductInsertIndex == initialValueofPositionOfSubcategoryFrommainCategoryVariable){

			// console.log('in order Products, slug detected subcategory');

			if (currentProduct.link != mainCategoryName){

				if (isShowLinksMainGallery == true){
					// console.log('?error1');
					// console.log('slug: ' + currentProductsSlug);
					var  currentProductEncodedLink = dbQueryAllResponseItems[Number(currentProductsSlug)].productlink;
					// console.log('?error2');
					currentProduct.link = currentProductEncodedLink;
				}
				else if (isShowLinksMainGallery == false){
					currentProduct.link = 'https://www.gotquestions.org/personal-Savior.html?=READ-JOHN-3-16&ROMANS-10-9&10-SAY-THESE-WORDS?=LORD-JESUS-I-INVITE-YOU-INTO-MY-LIFE/BE-THE-LORD-OF-MY-LIFE/I-ACCEPT-YOU-AS-MY-LORD-AND-PERSONAL-SAVIOR/I-BELIEVE-THAT-YOU-DIED-ON-THE-CROSS-AND-ROSE-UP-FROM-THE-DEAD/LEAD-ME-AND-DIRECT-MY-PATH-IN-YOUR-PRECIOUS-NAME/AMEN?=IF-YOU-SAID-THESE-WORDS-WELCOME-TO-ETERNAL-LIFE/HALLELUYAH/REMAIN-CONSCIOUS-AND-MINDFUL-OF-THE-ETERNAL-LIFE-AND-THE-RIGHTEOUSNESS-OF-GOD-THAT-YOU-JUST-RECIEVED/WALK-IN-IT-AND-REMAIN-BLESSED?=LEARN&WALK-IN-HIS-COMMANDMENTS-AND-POWER/AMEN'
				}

				// console.log('?error3');
				orderedContent.splice(nonMainCategoryProductInsertIndex, 0, currentProduct);
				// console.log('?error4');
				nonMainCategoryProductInsertIndex += positionOfSubcategoryFromMainCategory + 1;

				// console.log('orderProducts: Pushed Product - ' + currentProduct.title, + ' , ' + currentProduct.link);
			}
		// }
		// else if (nonMainCategoryProductInsertIndex == initialValueofPositionOfSubcategoryFrommainCategoryVariable * 2){
		//
		// 	if (currentProduct.link != mainCategoryName){
		// 		orderedContent.splice(nonMainCategoryProductInsertIndex - 1, 0, currentProduct);
		// 		nonMainCategoryProductInsertIndex += positionOfSubcategoryFromMainCategory;
		// 	}
		// }
		// else{
		//
		// 	if (currentProduct.link != mainCategoryName){
		// 		orderedContent.splice(nonMainCategoryProductInsertIndex, 0, currentProduct);
		// 		nonMainCategoryProductInsertIndex += positionOfSubcategoryFromMainCategory;
		// 	}
		// }

	}

	console.log('final orderedContent link: ' + orderedContent[0].link);

	return orderedContent;

}

// extract float from a price
function stripP(priceString){

	var listPriceNumbers = [];
	var priceFloat = 0;

	for (var i in priceString){
		var isCharNumber = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'].filter((numberOrDot) => numberOrDot == priceString[i]).length > 0;

		if (isCharNumber){
			listPriceNumbers.push(priceString[i]);
		}

	}

	return priceFloat = Number(listPriceNumbers.join(""));

}