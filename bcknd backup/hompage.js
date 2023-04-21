// Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction

import wixData from 'wix-data';
import wixLocation from 'wix-location';
import {fetch} from 'wix-fetch';
import wixWindow from 'wix-window';
import {currencies} from 'wix-pay';

// user's country
var usersCountryCode = '';

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
var flowersAndRingsWomen = []; // FLOWERS & RINGS
var flowersAndRingsWomenAmazonless = [];
var travelBagsAndOtherBagsWomen = []; // TRAVEL BAGS & OTHER BAGS
var travelBagsAndOtherBagsWomenAmazonless = [];
var otherAccessoriesWomen = []; // OTHER ACCESSORIES
var otherAccessoriesWomenAmazonless = [];
var giftsForHim = []; // GIFTS FOR HIM (WATCHES, PERFUMES, FLOWERS)
var giftsForHimAmazonless = [];

// MEN
var shoesAndWatchesMen = []; // SHOES AND WATCHES
var shoesAndWatchesMenAmazonless = [];
var necklacesAndBraceletsMen = []; // NECKLACES AND Bracelets
var necklacesAndBraceletsMenAmazonless = [];
var clothesAndPerfumesMen = []; // CLOTHES AND PERFUMES
var clothesAndPerfumesMenAmazonless = [];
var flowersAndRingsMen = []; // FLOWERS & RINGS
var flowersAndRingsMenAmazonless = [];
var travelBagsAndOtherBagsMen = []; // TRAVEL BAGS & OTHER BAGS
var travelBagsAndOtherBagsMenAmazonless = [];
var otherAccessoriesMen = []; // OTHER ACCESSORIES
var otherAccessoriesMenAmazonless = [];
var giftForHer = []; // GIFTS FOR HER (WATCHES, PERFUMES, FLOWERS)
var giftForHerAmazonless = [];

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

			console.log(ipLoc.countryCode);

			/// defining collection in focus by user country
			if (ipLoc.countryCode == 'SG') {
				dbCollectionToFocusOn = 'singaporeProducts';
				usersCountryCode = 'SG';
			}
			else if (ipLoc.countryCode == 'AE'){
				dbCollectionToFocusOn = 'uaeProducts';
				usersCountryCode = 'AE';
				// timeOut = 2500;
			}
			else if (ipLoc.countryCode == 'US'){
				dbCollectionToFocusOn = 'usaProducts';
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

		// console.log(dbCollectionToFocusOn);

		// obtaining products as per current country
		return wixData.query(dbCollectionToFocusOn).limit(999).find(options)
		.then((dbQueryAllResponse) => {

			dbQueryAllResponseItems	= dbQueryAllResponse.items;

			return dbQueryAllResponse.items

		}).catch((error) => {

			return error(error);

		})



		// console.log(typeof(dbQueryAllResponseItems[0].title));

		// return dbQueryAllResponseItems;
				// else{

				// 	console.error('There are no products for this origin');
				// }

	});

	// return dbQueryAllResponseItems.length;

	// console.log('typeof(dbQueryAllResponseItems): ' + dbQueryAllResponseItems[0].title);

	//$w.onReady(function () {
	//
	//	var gallery1ItemsReformatted = [];
	//
	//	dbQueryAllResponseItems.forEach((item) => {
	//		gallery1ItemsReformatted.push(
	//			{
	//				"type": "image",
	//	  			"title": item.title,
	//  	  			"src": item.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	//	  			'description': item.price,
	//	  			'link': item.productLink,
	//	  			'slug': item.productLink
	//			}
	//		);
	//	})
	//
	//	console.log(gallery1ItemsReformatted);
	//
	//	$w('#gallery1').items = gallery1ItemsReformatted;
	//	$w('#gallery1').show;
	//
	//});

	// return dbQueryAllResponseItems;

	// setTimeout(()=>{},5000);

}

$w.onReady(function () {

    // about us button
	$w('#text19').onClick((event) => {
		wixLocation.to('https://www.askandcarts.com/about-us');
	});

	// terms and conditions button
	$w('#text32').onClick((event) => {
		wixLocation.to('https://www.askandcarts.com/terms-and-conditions-and-privacy-policy#privacy-policy');
	});

	// store policy button
	$w('#text33').onClick((event) => {
		wixLocation.to('https://www.askandcarts.com/terms-and-conditions-and-privacy-policy#privacy-policy');
	});

	if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
		$w('#section5').hide();
		$w('#recommendedForWomenGallery').hide();
		$w('#gallery1').scrollTo();

	}

	// $w('#line1').hide();

	resolveGalleryItems();


	setTimeout(() => {

	    // redirect to not available
		if (usersCountryCode != 'AE' && usersCountryCode != 'US' && usersCountryCode != 'SG'){
			wixLocation.to('https://askandcarts.com/not-available');
			close();
		}


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

		// if (dbQueryAllResponseItems.length == 0){
		// 	wixLocation.to('https://flowbeing.wixsite.com/my-site-1');
		// }

		dbQueryAllResponseItems.forEach((item) => {

			// console.log('here');
			var productCat = item.productCategory;
			var productGender = item.gender;

			// check whether or not the current product's category has been added to availableProductsCategoryForEachGender,
			// if it hasn't been added, add it to the appropriate gender..
			var isCurrentProductCategoryInAvailableProductsCategoryForEachGender = false;

			if (productGender == 'WOMEN'){
				isCurrentProductCategoryInAvailableProductsCategoryForEachGender =
				availableProductsCategoryForEachGender['WOMEN'].filter((productCategory) => productCategory == productCat).length > 0;

				if (isCurrentProductCategoryInAvailableProductsCategoryForEachGender == false){
					availableProductsCategoryForEachGender['WOMEN'].push(productCat);
				}

			}
			else if(productGender == 'MEN'){
				isCurrentProductCategoryInAvailableProductsCategoryForEachGender =
				availableProductsCategoryForEachGender['MEN'].filter((productCategory) => productCategory == productCat).length > 0;

				if (isCurrentProductCategoryInAvailableProductsCategoryForEachGender == false){
					availableProductsCategoryForEachGender['MEN'].push(productCat);
				}

			}


			// console.log(totalProductsPerCategoryPerGender.WOMEN.productCategory == undefined);
			// var currentCategoryWithinCurrentGender = totalProductsPerCategoryPerGender[productGender][productCat];
			// console.log('typeof: ' + typeof(currentCategoryWithinCurrentGender));
			// console.log('typeof(0): ' + typeof(0));

			// console.log('productGender: ' + productGender + ', ' + 'productCat: ' + productCat);
			// console.log('typeof([0]): ' + typeof([0]));

			if (item.gender == 'WOMEN' && gallery1AlreadyIncludedAsPerTheirRelativeGenderTrackerList){
				if (typeof(totalProductsPerCategoryPerGender[productGender][productCat]) != 'object') {
					// console.log('gender: women, productCategory: ' + productCat + ', undefined: ' + typeof(totalProductsPerCategoryPerGender[productGender][productCat]));
					totalProductsPerCategoryPerGender.WOMEN[item.productCategory] = [item];

				}
				else if (typeof(totalProductsPerCategoryPerGender[productGender][productCat]) == 'object'){
					// console.log('gender: women, productCategory: ' + productCat + ', defined: ' + typeof(totalProductsPerCategoryPerGender[productGender][productCat]));
					totalProductsPerCategoryPerGender.WOMEN[item.productCategory].push(item);
				}
				count += 1;
				// console.log('count: ' + count);

			}
			else if (item.gender == 'MEN'){
				if (typeof(totalProductsPerCategoryPerGender[productGender][productCat]) != 'object') {
					// console.log('gender: men, productCategory: ' + productCat + ', undefined: ' + typeof(totalProductsPerCategoryPerGender[productGender][productCat]));
					totalProductsPerCategoryPerGender.MEN[item.productCategory] = [item];
				}
				else if (typeof(totalProductsPerCategoryPerGender[productGender][productCat]) == 'object'){
					// console.log('gender: women, productCategory: ' + productCat + ', defined: ' + typeof(totalProductsPerCategoryPerGender[productGender][productCat]));
					totalProductsPerCategoryPerGender.MEN[item.productCategory].push(item);
				}

				// count += 1;
				// console.log('count: ' + count);
			}


		});


		var womensFeatureableProducts = totalProductsPerCategoryPerGender.WOMEN;
		var mensFeatureableProducts = totalProductsPerCategoryPerGender.MEN;

		// list of shoes and bags that are available for women
		var womensFeaturableShoesList = womensFeatureableProducts['SHOE'];
		var womensFeaturableBagsList = womensFeatureableProducts['HANDBAG'];

		var womensFeaturableShoesListCopy = JSON.parse(JSON.stringify(womensFeatureableProducts['SHOE']));// womensFeatureableProducts['SHOE'];
		var womensFeaturableBagsListCopy = JSON.parse(JSON.stringify(womensFeatureableProducts['HANDBAG'])); // womensFeatureableProducts['HANDBAG'];

		// console.log('type check');
		// for (var x in womensFeaturableShoesList){
		// 	console.log(JSON.stringify(womensFeaturableShoesList[x].productLink == womensFeaturableShoesListCopy[x].productLink));
		// }
		// console.log(womensFeaturableBagsList == womensFeaturableBagsListCopy);

		console.log('');
		// console.log('womensFeatureableProducts: ' + womensFeatureableProducts);
		// console.log('mensFeatureableProducts: ' + mensFeatureableProducts);

		/// product categories that's currently available per gender selection
		var availableProductCategoriesForMen = availableProductsCategoryForEachGender['MEN'];
		var availableProductCategoriesForWomen = availableProductsCategoryForEachGender['WOMEN'];

		console.log('');
		console.log("Available Categories Men: [" + availableProductCategoriesForMen + ']');
		console.log("Available Categories Women: [" + availableProductCategoriesForWomen + ']');


		// var gallery1MensProductsCount = gallery1AlreadyIncludedAsPerTheirRelativeGenderTrackerList.filter(gender => gender == 'MEN').length;
		// var gallery1WomensProductsCount = gallery1AlreadyIncludedAsPerTheirRelativeGenderTrackerList.filter(gender => gender == 'WOMEN').length;

		/// setting recommendedForWomen's limit based on the number of items in dbQueryAllResponseItems
		var recommendedForWomenContentTargetCount = 10;

		if (dbQueryAllResponseItems.length < 10){

			recommendedForWomenContentTargetCount = dbQueryAllResponseItems.length;

		}


		var currentProductItemsIndexWithinListOfAllProducts = 1;



		/// obtain recommendedForWomensGallery's content while ensuring 10 women's products have been added..
		// if (dbQueryAllResponseItems.length >= recommendedForWomenContentTargetCount){

			// while (recommendedForWomen.length < recommendedForWomenContentTargetCount) {

			while (currentProductItemsIndexWithinListOfAllProducts < dbQueryAllResponseItems.length) {

				for (var gender in totalProductsPerCategoryPerGender){

						for (var productCategory in totalProductsPerCategoryPerGender[gender]){

							// ' + productCategory);

							if (totalProductsPerCategoryPerGender[gender][productCategory].length != 0){

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


										var indexOfCurrentProduct = dbQueryAllResponseItems.indexOf(currentProduct);

										// populating each available women's category with their relevant products
										if (currentProduct.gender == 'WOMEN'){


											if (productCategory == 'SHOE' || productCategory == 'NECKLACE' || productCategory == 'EARRING'){

												shoesAndMoreWomen.push({

													"type": "image",
	  												"title": currentProductTitle,
	 		  										"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  												'description': currentProduct.price,
	  												'link': currentProduct.productCategory,
	  												'slug': String(indexOfCurrentProduct)
												});

												if (productCategory == 'NECKLACE' && giftForHer.length < 20){
													giftForHer.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productCategory,
	  													'slug': String(indexOfCurrentProduct)
													});
												}

												// populating amazonless
												if (!currentProduct.imageSrc.includes('amazon')){

													shoesAndMoreWomenAmazonless.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productCategory,
	  													'slug': String(indexOfCurrentProduct)
													});

													if (productCategory == 'NECKLACE' && giftForHer.length < 20 && !currentProduct.imageSrc.includes('amazon')){
													giftForHerAmazonless.push({

															"type": "image",
	  														"title": currentProductTitle,
	 		  												"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  														'description': currentProduct.price,
	  														'link': currentProduct.productCategory,
	  														'slug': String(indexOfCurrentProduct)
														});
													}

												}

											}
											else if (productCategory == 'HANDBAG' || productCategory == 'BRACELET' || productCategory == 'WATCH' || productCategory == 'WATCHES'){
												handbagsAndMoreWomen.push({

													"type": "image",
	  												"title": currentProductTitle,
	 		  										"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  												'description': currentProduct.price,
	  												'link': currentProduct.productCategory,
	  												'slug': String(indexOfCurrentProduct)
												});

												if (productCategory == 'BRACELET' && giftForHer.length < 20){
													giftForHer.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productCategory,
	  													'slug': String(indexOfCurrentProduct)
													});
												}

												// populating amazonless
												if (!currentProduct.imageSrc.includes('amazon')){

													handbagsAndMoreWomenAmazonless.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productCategory,
	  													'slug': String(indexOfCurrentProduct)
													});

													if (productCategory == 'BRACELET' && giftForHer.length < 20 && !currentProduct.imageSrc.includes('amazon')){

													giftForHerAmazonless.push({

															"type": "image",
	  														"title": currentProductTitle,
	 		  												"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  														'description': currentProduct.price,
	  														'link': currentProduct.productCategory,
	  														'slug': String(indexOfCurrentProduct)
														});
													}

												}

											}
											else if (productCategory == 'FURNITURE'){
												furnituresMenAndWomen.push({

													"type": "image",
	  												"title": currentProductTitle,
	 		  										"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  												'description': currentProduct.price,
	  												'link': currentProduct.productCategory,
	  												'slug': String(indexOfCurrentProduct)
												})

												// populating Amazonless
												if (!currentProduct.imageSrc.includes('amazon')){

													furnituresMenAndWomenAmazonless.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productCategory,
	  													'slug': String(indexOfCurrentProduct)
													});

												}

											}
											else if (productCategory == 'CLOTHING' || productCategory == 'PERFUME'){
												clothesAndPerfumesWomen.push({

													"type": "image",
	  												"title": currentProductTitle,
	 		  										"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  												'description': currentProduct.price,
	  												'link': currentProduct.productCategory,
	  												'slug': String(indexOfCurrentProduct)
												})

												// populating Amazonless
												if (!currentProduct.imageSrc.includes('amazon')){

													clothesAndPerfumesWomenAmazonless.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productCategory,
	  													'slug': String(indexOfCurrentProduct)
													});

												}

											}
											else if (productCategory == 'FLOWER' || productCategory == 'RING'){
												flowersAndRingsWomen.push({

													"type": "image",
	  												"title": currentProductTitle,
	 		  										"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  												'description': currentProduct.price,
	  												'link': currentProduct.productCategory,
	  												'slug': String(indexOfCurrentProduct)
												});

												if (giftForHer.length < 20){
													giftForHer.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productCategory,
	  													'slug': String(indexOfCurrentProduct)
													});
												}

												// populating amazonless
												if (!currentProduct.imageSrc.includes('amazon')){

													flowersAndRingsWomenAmazonless.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productCategory,
	  													'slug': String(indexOfCurrentProduct)
													});

													if (productCategory == 'RING' && giftForHer.length < 20 && !currentProduct.imageSrc.includes('amazon')){
													giftForHerAmazonless.push({

															"type": "image",
	  														"title": currentProductTitle,
	 		  												"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  														'description': currentProduct.price,
	  														'link': currentProduct.productCategory,
	  														'slug': String(indexOfCurrentProduct)
														});
													}

												}
											}
											else if (productCategory == 'TRAVEL BAG' || productCategory == 'BAG'){
												travelBagsAndOtherBagsWomen.push({

													"type": "image",
	  												"title": currentProductTitle,
	 		  										"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  												'description': currentProduct.price,
	  												'link': currentProduct.productCategory,
	  												'slug': String(indexOfCurrentProduct)
												})

												// populating Amazonless
												if (!currentProduct.imageSrc.includes('amazon')){

													travelBagsAndOtherBagsWomenAmazonless.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productCategory,
	  													'slug': String(indexOfCurrentProduct)
													});

												}
											}
											else if (productCategory == 'ACCESSORIES'){

												otherAccessoriesWomen.push({

													"type": "image",
	  												"title": currentProductTitle,
	 		  										"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  												'description': currentProduct.price,
	  												'link': currentProduct.productCategory,
	  												'slug': String(indexOfCurrentProduct)
												});

												// populating Amazonless
												if (!currentProduct.imageSrc.includes('amazon')){

													otherAccessoriesWomenAmazonless.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productCategory,
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
	 		  										"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  												'description': currentProduct.price,
	  												'link': currentProduct.productCategory,
	  												'slug': String(indexOfCurrentProduct)
												});

												if (productCategory == 'WATCH' || productCategory == 'WATCHES' && giftsForHim.length < 20){
													giftsForHim.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productCategory,
	  													'slug': String(indexOfCurrentProduct)
													});
												}

												// populating amazonless
												if (!currentProduct.imageSrc.includes('amazon')){

													shoesAndWatchesMenAmazonless.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productCategory,
	  													'slug': String(indexOfCurrentProduct)
													});

													if ((productCategory == 'WATCH' || productCategory == 'WATCHES') && giftsForHim.length < 20 && !currentProduct.imageSrc.includes('amazon')){

														giftsForHimAmazonless.push({

																"type": "image",
	  															"title": currentProductTitle,
	 		  													"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  															'description': currentProduct.price,
	  															'link': currentProduct.productCategory,
	  															'slug': String(indexOfCurrentProduct)
															});
														}

												}

											}
											else if (productCategory == 'NECKLACE' || productCategory == 'BRACELET'){

												necklacesAndBraceletsMen.push({

													"type": "image",
	  												"title": currentProductTitle,
	 		  										"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  												'description': currentProduct.price,
	  												'link': currentProduct.productCategory,
	  												'slug': String(indexOfCurrentProduct)
												});

												if (!currentProduct.imageSrc.includes('amazon')){

													necklacesAndBraceletsMenAmazonless.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productCategory,
	  													'slug': String(indexOfCurrentProduct)
													});

												}


											}
											else if (productCategory == 'FURNITURE'){

												if (isItemsInList(furnituresMenAndWomen, [
													{

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productCategory,
	  													'slug': String(indexOfCurrentProduct)
													}]) == false){

													furnituresMenAndWomen.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productCategory,
	  													'slug': String(indexOfCurrentProduct)
													});

												};

												if (!currentProduct.imageSrc.includes('amazon')){

													if (isItemsInList(furnituresMenAndWomen, [
													{

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productCategory,
	  													'slug': String(indexOfCurrentProduct)
													}]) == false){

														furnituresMenAndWomenAmazonless.push({

															"type": "image",
	  														"title": currentProductTitle,
	 		  												"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  														'description': currentProduct.price,
	  														'link': currentProduct.productCategory,
	  														'slug': String(indexOfCurrentProduct)
														});

													}

												}

											}
											else if (productCategory == 'CLOTHING' || productCategory == 'PERFUME'){

												clothesAndPerfumesMen.push({

													"type": "image",
	  												"title": currentProductTitle,
	 		  										"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  												'description': currentProduct.price,
	  												'link': currentProduct.productCategory,
	  												'slug': String(indexOfCurrentProduct)
												});


												if (!currentProduct.imageSrc.includes('amazon')){

													clothesAndPerfumesMenAmazonless.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productCategory,
	  													'slug': String(indexOfCurrentProduct)
													});

												}

											}
											else if (productCategory == 'FLOWER' || productCategory == 'RING'){

												flowersAndRingsMen.push({

													"type": "image",
	  												"title": currentProductTitle,
	 		  										"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  												'description': currentProduct.price,
	  												'link': currentProduct.productCategory,
	  												'slug': String(indexOfCurrentProduct)
												});

												if (giftsForHim.length < 20){
													giftsForHim.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productCategory,
	  													'slug': String(indexOfCurrentProduct)
													});
												}

												if (!currentProduct.imageSrc.includes('amazon')){

													flowersAndRingsMenAmazonless.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productCategory,
	  													'slug': String(indexOfCurrentProduct)
													});

													if (giftsForHim.length < 20){
														giftsForHimAmazonless.push({

															"type": "image",
	  														"title": currentProductTitle,
	 		  												"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  														'description': currentProduct.price,
	  														'link': currentProduct.productCategory,
	  														'slug': String(indexOfCurrentProduct)
														});
													}

												}

											}
											else if (productCategory == 'TRAVEL BAG' || productCategory == 'BAG'){

												travelBagsAndOtherBagsMen.push({

													"type": "image",
	  												"title": currentProductTitle,
	 		  										"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  												'description': currentProduct.price,
	  												'link': currentProduct.productCategory,
	  												'slug': String(indexOfCurrentProduct)
												});

												// populating amazonless
												if (!currentProduct.imageSrc.includes('amazon')){

													travelBagsAndOtherBagsMenAmazonless.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productCategory,
	  													'slug': String(indexOfCurrentProduct)
													});

												}

											}
											else if (productCategory == 'ACCESSORIES'){

												otherAccessoriesMen.push({

													"type": "image",
	  												"title": currentProductTitle,
	 		  										"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  												'description': currentProduct.price,
	  												'link': currentProduct.productCategory,
	  												'slug': String(indexOfCurrentProduct)
												})

												// populating amazonless
												if (!currentProduct.imageSrc.includes('amazon')){

													otherAccessoriesMenAmazonless.push({

														"type": "image",
	  													"title": currentProductTitle,
	 		  											"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  													'description': currentProduct.price,
	  													'link': currentProduct.productCategory,
	  													'slug': String(indexOfCurrentProduct)
													});

												}

											}

										}


										// populating recommendedForWomen's list i.e list of products that are meant for women
										if (currentProduct.gender == 'WOMEN' && currentProduct.productCategory != 'CLOTHING' && recommendedForWomen.length < 10){

											recommendedForWomen.push(

												{

													"type": "image",
	  												"title": currentProductTitle,
	 		  										"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  												'description': currentProduct.price,
	  												'link': currentProduct.productCategory,
	  												'slug': String(indexOfCurrentProduct)
												});


											/// track bags and / or shoes has been added to recommendedForWomenGallery..
											if ((currentProduct.gender == 'WOMEN' && currentProduct.productCategory == 'HANDBAG') ||
											(currentProduct.gender == 'WOMEN' && currentProduct.productCategory == 'SHOE')){
												ladiesShoesAndBagsIncludedTracker.push(currentProduct.productCategory);

												if (currentProduct.productCategory == 'SHOE'){
													// womensFeaturableShoesList.pop(currentProduct);
													// console.log('');
													// console.log('removed from copy: ' + womensFeaturableShoesListCopy[0].title + ', ' + womensFeaturableShoesListCopy[0].gender);
													womensFeaturableShoesListCopy.splice(0, 1);
													// console.log('womensFeaturableShoesList after item removal: ' + womensFeaturableShoesList.length);
												}
												else if (currentProduct.productCategory == 'HANDBAG'){
													// womensFeaturableBagsList.pop(currentProduct);
													// console.log('');
													// console.log('removed from copy: ' + womensFeaturableBagsListCopy[0].title + ', ' + womensFeaturableBagsListCopy[0].gender);
													womensFeaturableBagsListCopy.splice(0, 1);
													// console.log('womensFeaturableBagsList after item removal: ' + womensFeaturableBagsList.length);
												}
											}



										}

										// removing current product from totalProductsPerCategoryPerGender dict to prevent it from being added and
										// displayed more than once on recommendedForWomen's gallery..
										// totalProductsPerCategoryPerGender[gender][productCategory].pop(0);
										// console.log('removed from main: ' + currentProduct.title + ', ' + currentProduct.gender);
										// console.log('');
										totalProductsPerCategoryPerGender[gender][productCategory].splice(0, 1); // remove the item to prevent it from being added again later

										// gallery1AlreadyIncludedAsPerTheirRelativeGenderTrackerList.push(gender);




									// console.log(currentProductItemsIndexWithinListOfAllProducts);

									// console.log(currentProduct.imageSrc);

										// if ((gender == 'WOMEN' && gallery1WomensProductsCount == 8) || (gender == 'MEN' && gallery1MensProductsCount == 2)){
										// 	break;
										// }



								}

								currentProductItemsIndexWithinListOfAllProducts += 1;
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
					var indexOfCurrentProduct = dbQueryAllResponseItems.findIndex((product) => product.productLink == currentShoeProduct.productLink); // dbQueryAllResponseItems.indexOf(currentShoeProduct);
					// console.log('');
					// console.log('slug extra shoe: ' + indexOfCurrentProduct);
					// console.log('currentShoeProduct extra shoe: ' + currentShoeProduct.title, currentShoeProduct.productLink);
					// console.log('');

					recommendedForWomen.push(

										{
											"type": "image",
	  										"title": currentShoeProduct.title,
	 		  								"src": currentShoeProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  										'description': currentShoeProduct.price,
	  										'link': currentShoeProduct.productCategory,
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
					var indexOfCurrentProduct = dbQueryAllResponseItems.findIndex((product) => product.productLink == currentBagProduct.productLink); // dbQueryAllResponseItems.indexOf(currentBagProduct);
					// console.log('');
					// console.log('slug extra bag: ' + indexOfCurrentProduct);
					// console.log('currentBagProduct extra shoe: ' + currentBagProduct.title + ' , ' + currentBagProduct.productLink);
					// console.log('');
					recommendedForWomen.push(

										{
											"type": "image",
	  										"title": currentBagProduct.title,
	 		  								"src": currentBagProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  										'description': currentBagProduct.price,
	  										'link': currentBagProduct.productCategory,
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
		// 	{"label": "Shoes & Jewelleries", "value": "Shoes & Jewelleries"},
		// 	{"label": "Bags & Jewelleries", "value": "Bags & Jewelleries"},
		// 	{"label": "Furnitures", "value": "Furnitures"},
		// 	{"label": "Clothes And Perfumes", "value": "Clothes And Perfumes"},
		// 	{"label": "Flowers & Rings", "value": "Flowers & Rings"},
		// 	{"label": "Travel Bags & Other Bags", "value": "Travel Bags & Other Bags"},
		// 	{"label": "Other Accessories", "value": "Other Accessories"},
		// 	{"label": "Gifts For Him", "value": "Gifts For Him"}
		// ];

		// console.log('availableProductCategoriesForWomen: ' + availableProductCategoriesForWomen);
		var isDisplayShoesAndMore = isItemsInList(availableProductCategoriesForWomen, ['SHOE', 'NECKLACE', 'EARRING']);
		// console.log('isDisplayShoesAndMore: ' + isDisplayShoesAndMore);
		var isDisplayHandbagsAndMore = isItemsInList(availableProductCategoriesForWomen, ['HANDBAG', 'BRACELET', 'WATCH', 'WATCHES']);
		// console.log('isDisplayHandbagsAndMore: ' + isDisplayHandbagsAndMore);
		var isDisplayFurnituresForWomen = isItemsInList(availableProductCategoriesForWomen, ['FURNITURE']);
		// console.log('isDisplayFurnitures: ' + isDisplayFurnitures);
		var isDisplayWomensClothesAndPerfumes = isItemsInList(availableProductCategoriesForWomen, ['CLOTHING', 'PERFUME']);
		var isDisplayFlowersAndWomensRings = isItemsInList(availableProductCategoriesForWomen, ['FLOWER', 'RING']);
		var isDisplayTravelBagsAndOtherBags = isItemsInList(availableProductCategoriesForWomen, ['TRAVEL BAG', 'BAG']);
		var isDisplayOtherAccessoriesForWomen = isItemsInList(availableProductCategoriesForWomen, ['ACCESSORIES']);
		var isDisplayGiftsForHim = isItemsInList(availableProductCategoriesForMen, ['FLOWER', 'RING', 'WATCH', 'WATCHES']);

		if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
			listOfProductCategoryForWomen.push({"label": "Recommended", "value": "Recommended"});
		}

		if (isDisplayShoesAndMore){
			listOfProductCategoryForWomen.push({"label": "Shoes & Jewelleries", "value": "Shoes & Jewelleries"});
		}

		if (isDisplayHandbagsAndMore){
			listOfProductCategoryForWomen.push({"label": "Bags & Jewelleries", "value": "Bags & Jewelleries"});
		}

		if (isDisplayFurnituresForWomen){
			listOfProductCategoryForWomen.push({"label": "Furnitures", "value": "Furnitures"});
		}

		if (isDisplayWomensClothesAndPerfumes){
			listOfProductCategoryForWomen.push({"label": "Clothes & Perfumes", "value": "Clothes & Perfumes"});
		}

		if (isDisplayFlowersAndWomensRings){
			listOfProductCategoryForWomen.push({"label": "Flowers & Rings", "value": "Flowers & Rings"});
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


		// var listOfProductCategoryForMen = [
		// 	{"label": "Shoes & Watches", "value": "Shoes & Watches"},
		// 	{"label": "Necklaces & Bracelets", "value": "Necklaces & Bracelets"},
		// 	{"label": "Furnitures", "value": "Furnitures"},
		// 	{"label": "Clothes & Perfumes", "value": "Clothes & Perfumes"},
		// 	{"label": "Flowers & Rings", "value": "Flowers & Rings"},
		// 	{"label": "Travel Bags & Other Bags", "value": "Travel Bags & Other Bags"},
		// 	{"label": "Other Accessories", "value": "Other Accessories"},
		// 	{"label": "Gifts For Her", "value": "Gifts For Her"}
		// ];

		var isDisplayMensShoesAndWatches = isItemsInList(availableProductCategoriesForMen, ['SHOE', 'WATCH', 'WATCHES']);
		var isDisplayMensNecklacesAndBRACELET = isItemsInList(availableProductCategoriesForMen, ['NECKLACE', 'BRACELET']);
		var isDisplayFurnituresForMen = isItemsInList(availableProductCategoriesForMen, ['FURNITURE']);
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

		if (isDisplayMensClothesAndPerfumes){
			listOfProductCategoryForMen.push({"label": "Clothes & Perfumes", "value": "Clothes & Perfumes"});
		}

		if (isDisplayFlowersAndMensRings){
			listOfProductCategoryForMen.push({"label": "Flowers & Rings", "value": "Flowers & Rings"});
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



		// switch product category based on gender selection..
		$w('#dropdown1').onChange((event) => {

			console.log('function recognized');
			console.log($w('#dropdown1').value);

			if ($w('#dropdown1').value == 'Women'){
				$w('#dropdown3').options = listOfProductCategoryForWomen;
				$w('#dropdown3').value = 'Shoes & Jewelleries';

				var input = $w('#input1').value;
				setMainGalleryBasedOnProductCategory(input);

			}
			else if ($w('#dropdown1').value == 'Men'){
				$w('#dropdown3').options = listOfProductCategoryForMen;
				$w('#dropdown3').value = 'Shoes & Watches';

				var input = $w('#input1').value;
				setMainGalleryBasedOnProductCategory(input);
			}

		});



		// brand options

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

			var input = $w('#input1').value;
			setMainGalleryBasedOnProductCategory(input, true);

			// var brandOrProductSearchInput = $w('#input1').value;

			// if (typeof(brandOrProductSearchInput.length) != 'undefined'){
			// 	setMainGalleryBasedOnProductCategory(brandOrProductSearchInput);
			// 	$w('#gallery1').hide();
			// 	$w('#gallery1').show();
			// }
			// else{
			// 	setMainGalleryBasedOnProductCategory();
			// 	$w('#gallery1').hide();
			// 	$w('#gallery1').show();
			// }

		});



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
			//		setMainGalleryBasedOnProductCategory(input, true);
			//
			//		$w('#gallery1').clickAction = 'link';
			//
			//});

			// $w('#gallery1').onViewportEnter((event) => {
			//
			// 		console.log("$w('#gallery1').currentItem: " + $w('#gallery1').currentItem);
			//
			// 		var input = $w('#input1').value;
			// 		setMainGalleryBasedOnProductCategory(input, true);
			//
			// 		$w('#gallery1').clickAction = 'link';
			//
			// });

			// $w('#gallery1').onViewportLeave((event) => {
			//
			// 		// console.log("$w('#gallery1').currentItem: " + $w('#gallery1').currentItem);
			//
			// 		var input = $w('#input1').value;
			// 		setMainGalleryBasedOnProductCategory(input, false);
			//
			// 		$w('#gallery1').clickAction = 'link';
			//
			// });



		// }
		// else if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){

		//	setMainGalleryBasedOnProductCategory('', true);

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



		// set main gallery's each time productCategory filter's value changes
		$w('#dropdown3').onChange((event) => {

			var input = $w('#input1').value;

			setMainGalleryBasedOnProductCategory(input);
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

		$w('#dropdown5').onChange((event) => {

			// var sortValue = $w('#dropdown5').value;
			//
			// if (sortValue == 'Relevance'){
			//
			// 	setMainGalleryBasedOnProductCategory();
			// }
			// else{
			//
			// 	$w('#gallery1').items = sortMainGallery();
			//
			// }

			var input = $w('#input1').value;

			setMainGalleryBasedOnProductCategory(input);
			$w('#gallery1').hide();
			$w('#gallery1').show();

		});



		// var options = {
		//   "suppressAuth": true,
		//   "suppressHooks": true
		// };

		// filtering by brand or product name..
		$w('#input1').onInput((event) => {

			var userInput = $w('#input1').value;

			setMainGalleryBasedOnProductCategory(userInput);

		});

		// set main gallery for both desktop and mobile devices..
		// setMainGalleryBasedOnProductCategory('', true);

		if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){

			$w('#button5').onViewportEnter((event) => {

				var userInput = $w('#input1').value;
				setMainGalleryBasedOnProductCategory(userInput, true);

			});
		}
		// This is the default main gallery's content for desktops devices
		else if(wixWindow.formFactor === "Desktop"){

			// set recommendedForWomenGallery
			setMainGalleryBasedOnProductCategory('', true, true);

			$w('#button5').onViewportLeave((event) => {

				// var userInput = $w('#input1').value;
				setMainGalleryBasedOnProductCategory('', false, true);

			});


			$w('#button3').onViewportEnter((event) => {

				var userInput = $w('#input1').value;
				setMainGalleryBasedOnProductCategory(userInput, true);

			});

			$w('#button4').onViewportEnter((event) => {

				var userInput = $w('#input1').value;
				setMainGalleryBasedOnProductCategory('', false);

			});


			// $w('#button5').onViewportEnter((event) => {
			//
			// 	var userInput = $w('#input1').value;
			// 	setMainGalleryBasedOnProductCategory('', true);
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
// 	// $w('#button1').link = dbQueryAllResponseItems[Number(event.item.slug)].productLink;
// 				$w('#button1').target = '_blank';
// 				$w('#button1').enable();
// 				// $w('#html1').postMessage('click');
// 				// console.log('event.item.slug: ' + event.item.slug);
// 				// console.log('productLink: ' + dbQueryAllResponseItems[Number(event.item.slug)].productLink);
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
function setMainGalleryBasedOnProductCategory(
	userInput,
	isShowLinks = true,
	isRecommendedGalleryForDesktop = false,
	){

	// console.log('isShowLinks: ' + isShowLinks);

	var currentProductCategory = $w('#dropdown3').value;
	var currentSortValue = $w('#dropdown5').value;
	var hideAmazonButtonValue = $w('#button2').label;

	// console.log('dropdown 3 value: ' + currentProductCategory);

	// console.log('hideAmazonButtonValue: ' + hideAmazonButtonValue);

	var gender = $w('#dropdown1').value;

	// setting recommended gallery
	if (isRecommendedGalleryForDesktop == true){

			// var productsInFocusSortedByRelevanceMobile = [];
			var productsInFocusSortedByRelevanceDesktop = [];

			var productsInFocusSortedByRelevanceDesktop = orderProducts(recommendedForWomen, 'None', 3, isShowLinks);

			console.log('GOT HERE 1');

			$w('#recommendedForWomenGallery').items = productsInFocusSortedByRelevanceDesktop;


	}
	else if (isRecommendedGalleryForDesktop == false){

		// setting main gallery
		if (gender == 'Women'){

			// product categories that pertain to women
			if (currentProductCategory == 'Recommended'){

				// console.log('within recommended:');

				// var productsInFocusSortedByRelevanceMobile = orderProducts(handbagsAndMoreWomen, 'HANDBAG', 2);
				// var productsInFocusSortedByRelevanceDesktop = orderProducts(handbagsAndMoreWomen, 'HANDBAG', 3);

				var productsInFocusSortedByRelevanceMobile = [];
				var productsInFocusSortedByRelevanceDesktop = [];

				if (hideAmazonButtonValue == 'Show Amazon Products'){
					// console.log('here hideAmazonButtonValue1start');
					var productsInFocusSortedByRelevanceMobile = orderProducts(recommendedForWomenAmazonless, 'None', 3, isShowLinks);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(recommendedForWomenAmazonless, 'None', 3, isShowLinks);
					// console.log('here hideAmazonButtonValue1end');
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					// console.log('here hideAmazonButtonValue2start');
					var productsInFocusSortedByRelevanceMobile = orderProducts(recommendedForWomen, 'None', 3, isShowLinks);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(recommendedForWomen, 'None', 3, isShowLinks);
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
						// if (isShowLinks == true){
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
					var productsInFocusSortedByRelevanceMobile = orderProducts(handbagsAndMoreWomenAmazonless, 'HANDBAG', 2, isShowLinks);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(handbagsAndMoreWomenAmazonless, 'HANDBAG', 3, isShowLinks);
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(handbagsAndMoreWomen, 'HANDBAG', 2, isShowLinks);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(handbagsAndMoreWomen, 'HANDBAG', 3, isShowLinks);
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
						// if (isShowLinks == true){
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
			else if (currentProductCategory == 'Shoes & Jewelleries'){

				// var productsInFocusSortedByRelevanceMobile = orderProducts(handbagsAndMoreWomen, 'HANDBAG', 2);
				// var productsInFocusSortedByRelevanceDesktop = orderProducts(handbagsAndMoreWomen, 'HANDBAG', 3);

				var productsInFocusSortedByRelevanceMobile = [];
				var productsInFocusSortedByRelevanceDesktop = [];

				if (hideAmazonButtonValue == 'Show Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(shoesAndMoreWomenAmazonless, 'SHOE', 2, isShowLinks);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(shoesAndMoreWomenAmazonless, 'SHOE', 3, isShowLinks);
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(shoesAndMoreWomen, 'SHOE', 2, isShowLinks);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(shoesAndMoreWomen, 'SHOE', 3, isShowLinks);
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
					var productsInFocusSortedByRelevanceMobile = orderProducts(furnituresMenAndWomenAmazonless, 'FURNITURE', 2, isShowLinks);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(furnituresMenAndWomenAmazonless, 'FURNITURE', 2, isShowLinks);
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(furnituresMenAndWomen, 'FURNITURE', 2, isShowLinks);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(furnituresMenAndWomen, 'FURNITURE', 2, isShowLinks);
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
			else if (currentProductCategory == 'Clothes & Perfumes'){

				// var productsInFocusSortedByRelevanceMobile = orderProducts(clothesAndPerfumesWomen, 'CLOTHING', 2, isShowLinks);
				// var productsInFocusSortedByRelevanceDesktop = orderProducts(clothesAndPerfumesWomen, 'CLOTHING', 3, isShowLinks);

				var productsInFocusSortedByRelevanceMobile = [];
				var productsInFocusSortedByRelevanceDesktop = [];

				if (hideAmazonButtonValue == 'Show Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(clothesAndPerfumesWomenAmazonless, 'CLOTHING', 2, isShowLinks);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(clothesAndPerfumesWomenAmazonless, 'CLOTHING', 3, isShowLinks);
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(clothesAndPerfumesWomen, 'CLOTHING', 2, isShowLinks);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(clothesAndPerfumesWomen, 'CLOTHING', 3, isShowLinks);
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
			else if (currentProductCategory == 'Flowers & Rings'){

				// var productsInFocusSortedByRelevanceMobile = orderProducts(flowersAndRingsWomen, 'RING', 2, isShowLinks);
				// var productsInFocusSortedByRelevanceDesktop = orderProducts(flowersAndRingsWomen, 'RING', 3, isShowLinks);

				var productsInFocusSortedByRelevanceMobile = [];
				var productsInFocusSortedByRelevanceDesktop = [];

				if (hideAmazonButtonValue == 'Show Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(flowersAndRingsWomenAmazonless, 'RING', 2, isShowLinks);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(flowersAndRingsWomenAmazonless, 'RING', 3, isShowLinks);
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(flowersAndRingsWomen, 'RING', 2, isShowLinks);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(flowersAndRingsWomen, 'RING', 3, isShowLinks);
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
					var productsInFocusSortedByRelevanceMobile = orderProducts(travelBagsAndOtherBagsWomenAmazonless, 'TRAVEL BAG', 2, isShowLinks);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(travelBagsAndOtherBagsWomenAmazonless, 'TRAVEL BAG', 3, isShowLinks);
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(travelBagsAndOtherBagsWomen, 'TRAVEL BAG', 2, isShowLinks);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(travelBagsAndOtherBagsWomen, 'TRAVEL BAG', 3, isShowLinks);
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
					var productsInFocusSortedByRelevanceMobile = orderProducts(otherAccessoriesWomenAmazonless, 'ACCESSORIES', 2, isShowLinks);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(otherAccessoriesWomenAmazonless, 'ACCESSORIES', 3, isShowLinks);
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(otherAccessoriesWomen, 'ACCESSORIES', 2, isShowLinks);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(otherAccessoriesWomen, 'ACCESSORIES', 3, isShowLinks);
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
					var productsInFocusSortedByRelevanceMobile = orderProducts(giftsForHimAmazonless, 'WATCHES', 2, isShowLinks);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(giftsForHimAmazonless, 'WATCHES', 3, isShowLinks);
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					console.log('in gifts for him amazon');
					var productsInFocusSortedByRelevanceMobile = orderProducts(giftsForHim, 'WATCHES', 2, isShowLinks);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(giftsForHim, 'WATCHES', 3, isShowLinks);
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
					var productsInFocusSortedByRelevanceMobile = orderProducts(shoesAndWatchesMenAmazonless, 'SHOE', 1, isShowLinks);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(shoesAndWatchesMenAmazonless, 'SHOE', 1, isShowLinks);
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(shoesAndWatchesMen, 'SHOE', 1, isShowLinks);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(shoesAndWatchesMen, 'SHOE', 1, isShowLinks);
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
					var productsInFocusSortedByRelevanceMobile = orderProducts(necklacesAndBraceletsMenAmazonless, 'NECKLACE', 2, isShowLinks);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(necklacesAndBraceletsMenAmazonless, 'NECKLACE', 3, isShowLinks);
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(necklacesAndBraceletsMen, 'NECKLACE', 2, isShowLinks);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(necklacesAndBraceletsMen, 'NECKLACE', 3, isShowLinks);
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
					var productsInFocusSortedByRelevanceMobile = orderProducts(furnituresMenAndWomenAmazonless, 'FURNITURE', 2, isShowLinks);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(furnituresMenAndWomenAmazonless, 'FURNITURE', 3, isShowLinks);
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(furnituresMenAndWomen, 'FURNITURE', 2, isShowLinks);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(furnituresMenAndWomen, 'FURNITURE', 3, isShowLinks);
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
			else if (currentProductCategory == 'Clothes & Perfumes'){

				// var productsInFocusSortedByRelevanceMobile = orderProducts(clothesAndPerfumesMen, 'CLOTHING', 2);
				// var productsInFocusSortedByRelevanceDesktop = orderProducts(clothesAndPerfumesMen, 'CLOTHING', 3);

				var productsInFocusSortedByRelevanceMobile = [];
				var productsInFocusSortedByRelevanceDesktop = [];

				if (hideAmazonButtonValue == 'Show Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(clothesAndPerfumesMenAmazonless, 'CLOTHING', 2, isShowLinks);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(clothesAndPerfumesMenAmazonless, 'CLOTHING', 3, isShowLinks);
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(clothesAndPerfumesMen, 'CLOTHING', 2, isShowLinks);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(clothesAndPerfumesMen, 'CLOTHING', 3, isShowLinks);
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
			else if (currentProductCategory == 'Flowers & Rings'){

				// var productsInFocusSortedByRelevanceMobile = orderProducts(flowersAndRingsMen, 'RING', 2);
				// var productsInFocusSortedByRelevanceDesktop = orderProducts(flowersAndRingsMen, 'RING', 3);

				var productsInFocusSortedByRelevanceMobile = [];
				var productsInFocusSortedByRelevanceDesktop = [];

				if (hideAmazonButtonValue == 'Show Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(flowersAndRingsMenAmazonless, 'RING', 2, isShowLinks);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(flowersAndRingsMenAmazonless, 'RING', 3, isShowLinks);
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(flowersAndRingsMen, 'RING', 2, isShowLinks);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(flowersAndRingsMen, 'RING', 3, isShowLinks);
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
					var productsInFocusSortedByRelevanceMobile = orderProducts(travelBagsAndOtherBagsMenAmazonless, 'TRAVEL BAG', 2, isShowLinks);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(travelBagsAndOtherBagsMenAmazonless, 'TRAVEL BAG', 3, isShowLinks);
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(travelBagsAndOtherBagsMen, 'TRAVEL BAG', 2, isShowLinks);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(travelBagsAndOtherBagsMen, 'TRAVEL BAG', 3, isShowLinks);
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
					var productsInFocusSortedByRelevanceMobile = orderProducts(otherAccessoriesMenAmazonless, 'ACCESSORIES', 2, isShowLinks);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(otherAccessoriesMenAmazonless, 'ACCESSORIES', 3, isShowLinks);
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(otherAccessoriesMen, 'ACCESSORIES', 2, isShowLinks);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(otherAccessoriesMen, 'ACCESSORIES', 3, isShowLinks);
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

				// var productsInFocusSortedByRelevanceMobile = orderProducts(giftForHer, 'NECKLACE', 1);
				// var productsInFocusSortedByRelevanceDesktop = orderProducts(giftForHer, 'NECKLACE', 1);

				var productsInFocusSortedByRelevanceMobile = [];
				var productsInFocusSortedByRelevanceDesktop = [];

				if (hideAmazonButtonValue == 'Show Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(giftForHerAmazonless, 'NECKLACE', 1, isShowLinks);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(giftForHerAmazonless, 'NECKLACE', 1, isShowLinks);
				}
				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
					var productsInFocusSortedByRelevanceMobile = orderProducts(giftForHer, 'NECKLACE', 1, isShowLinks);
					var productsInFocusSortedByRelevanceDesktop = orderProducts(giftForHer, 'NECKLACE', 1, isShowLinks);
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

// ordering product categories options' content(s)
// Most product categories options have up to 2 subcategories
function orderProducts(
	listOfCategoryOptionsProducts,
	mainCategoryName,
	positionOfSubcategoryFromMainCategory = 4,
	isShowLinks = false,
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

			if (isShowLinks == true){
				var  currentProductEncodedLink = dbQueryAllResponseItems[Number(currentProductsSlug)].productLink;
				currentProduct.link = decodeCodifiedUrl(currentProductEncodedLink);

				// console.log('');
				// console.log('orderProducts - Added Product name:' + currentProduct.title);
				// console.log('orderProducts - Added Product link:' + currentProduct.link);
				// console.log('');
			}
			else if (isShowLinks == false){
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

				if (isShowLinks == true){
					// console.log('?error1');
					// console.log('slug: ' + currentProductsSlug);
					var  currentProductEncodedLink = dbQueryAllResponseItems[Number(currentProductsSlug)].productLink;
					// console.log('?error2');
					currentProduct.link = decodeCodifiedUrl(currentProductEncodedLink);
				}
				else if (isShowLinks == false){
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

	var urlLength = (codifiedUrl.length - 20) / 5;
	var lengthPreSII = Math.floor(((urlLength * 2) + 15) * .25);
	var lengthPreMid = Math.floor(((urlLength * 2) + 10) * .50);
	var lengthPreSI = Math.floor(((urlLength * 2) + 5)* .75);

	// convert codifiedUrl string to array
	// var counter = 0;
	// console.log('codifiedUrl: ' + codifiedUrl.length);

	// 0 to first block;


	var shiftCounter = 0;
	var codifiedUrlListIndexCounter = 0;
	var unfinishedBusiness = false;

	var codifiedUrlList = [];
	var codifiedUrlListUnpack = {};

	var codifiedUrlListLastBlock = (urlLength * 2);

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

	// var countNoOfDevaredItems = 0;
	var codifiedUrlListlength = JSON.parse(JSON.stringify(codifiedUrlList.length));
	var currentIndex = 0;

	while (currentIndex < codifiedUrlListlength){

		var currentItem = codifiedUrlList[0];
		// console.log('current item: ' + currentItem);
		var countNumberOfTimesHere = 1;

		// console.log('String.fromCharCode(currentItem.charCodeAt(0) - 128)' + String.fromCharCode(currentItem.charCodeAt(0) - 128));

		if (currentItem.length == 1){
			// console.log('currentItem.length == 1: ' + currentItem.length);
			// console.log('number of times here: ' + countNumberOfTimesHere);
			var c = String.fromCharCode(currentItem.charCodeAt(0) - 128);
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

	var returnValue = 'https://' + codifiedUrlList.join('');

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

	// var shiftCounter = currentShiftCounterValue;
	// var codifiedUrlList = codifiedUrlListRecentValue;


	// obataining the length of the las item in codifiedUrlList if applicable..
	var isLastCodifiedUrlListItemsLengthAfterUnblockEqualToOne = false;
	var isLastCodifiedUrlListItemsLengthAfterUnblockGreaterThanOne = false;

	// if the current printing point is not the start of the codified url and codifiedUrlList has been populated to an unblocking,
	// check if the last unblocked item's (string) length is equal to 1.. useful after each unblock
	if (currentShiftCounterValue != 0 && codifiedUrlListRecentValue.length > 0){

		// codifiedUrlListIndexCounter = codifiedUrlListIndexCounter - 1;




		// console.log('codifiedUrlListRecentValue length: ' + codifiedUrlListRecentValue.length);
		// console.log('codifiedUrlListIndexCounter: ' + codifiedUrlListIndexCounter);
		// console.log('Item at codifiedUrlListIndexCounter: ' + codifiedUrlListRecentValue[codifiedUrlListIndexCounter - 1]);
		// console.log('currentShiftCounterValue: ' + currentShiftCounterValue);
		// console.log('Item at currentShiftCounterValue: ' + codifiedUrl[currentShiftCounterValue]);


		var lengthOfLastItem = codifiedUrlListRecentValue[codifiedUrlListIndexCounter - 1].length;

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

			var tai = codifiedUrl[currentShiftCounterValue] + codifiedUrl[currentShiftCounterValue + 1] + codifiedUrl[currentShiftCounterValue + 2] + codifiedUrl[currentShiftCounterValue + 3];
			var c = codifiedUrl[currentShiftCounterValue + 4];

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

			var c = codifiedUrl[currentShiftCounterValue];
			var tai = codifiedUrl[currentShiftCounterValue + 1] + codifiedUrl[currentShiftCounterValue + 2] + codifiedUrl[currentShiftCounterValue + 3] + codifiedUrl[currentShiftCounterValue + 4];

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

			// var currentShiftCounterValueTwo = currentShiftCounterValue;

			// var indexToStartFrom = codifiedUrlListIndexCounter;
			var doNum = 0;

			while (doNum < 5){

				// console.log('codifiedUrlListRecentValue: ' + codifiedUrlListRecentValue);
				// console.log('codifiedUrlListRecentValueLength: ' + codifiedUrlListRecentValue.length);
				var lengthOfItemBeforeBlock = codifiedUrlListRecentValue[codifiedUrlListIndexCounter - 1].length;

				var block = codifiedUrl[currentShiftCounterValue];
				var next = '';

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

			// var currentShiftCounterValueTwo = currentShiftCounterValue;

			var indexToStartFrom = codifiedUrlListIndexCounter;

			// console.log('codifiedUrlListRecentValue: ' + codifiedUrlListRecentValue);
			// console.log('codifiedUrlListRecentValueLength: ' + codifiedUrlListRecentValue.length);
			// var lengthOfItemBeforeBlock = codifiedUrlListRecentValue[codifiedUrlListIndexCounter - 1].length;

			var doNum = 0;

			while (doNum < 5){

				// console.log('codifiedUrlListRecentValue: ' + codifiedUrlListRecentValue);
				// console.log('codifiedUrlListRecentValueLength: ' + codifiedUrlListRecentValue.length);
				var lengthOfItemBeforeBlock = codifiedUrlListRecentValue[codifiedUrlListIndexCounter - 1].length;

				var block = codifiedUrl[currentShiftCounterValue];
				var next = '';

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