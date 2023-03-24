// Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction

import wixData from 'wix-data';
import wixLocation from 'wix-location';
import {fetch} from 'wix-fetch';
import wixWindow from 'wix-window';
import {currencies} from 'wix-pay';

// user's country
let usersCountryCode = '';

// list of all currencies
// let allCurrenciesDict = {}
//
// currencies.getAllCurrencies()
//   .then((listOfAllCurrencies) => {
//
// 	  for (let currencyIndex in listOfAllCurrencies){
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

let dbQueryAllResponseItems = [];
/// VARIABLES TO DEFINE FEATURED PRODUCTS

// MEN AND WOMEN
let furnituresMenAndWomen = []; // Furnitures

// Main gallery's copy
let mainGalleryCopy = [];

// WOMEN
let recommendedForWomen = [];
let shoesAndMoreWomen = []; // SHOES, & MORE (NECKLACE, EARRING)
let handbagsAndMoreWomen = []; // HANDBAGS & MORE (BRACELET , WATCH)
let clothesAndPerfumesWomen = []; // CLOTHES AND PERFUMES
let flowersAndRingsWomen = []; // FLOWERS & RINGS
let travelBagsAndOtherBagsWomen = []; // TRAVEL BAGS & OTHER BAGS
let otherAccessoriesWomen = []; // OTHER ACCESSORIES
let giftsForHim = []; // GIFTS FOR HIM (WATCHES, PERFUMES, FLOWERS)

// MEN
let shoesAndWatchesMen = []; // SHOES AND WATCHES
let necklacesAndBracletsMen = []; // NECKLACES AND BRACELETS
let clothesAndPerfumesMen = []; // CLOTHES AND PERFUMES
let flowersAndRingsMen = []; // FLOWERS & RINGS
let travelBagsAndOtherBagsMen = []; // TRAVEL BAGS & OTHER BAGS
let otherAccessoriesMen = []; // OTHER ACCESSORIES
let giftForHer = []; // GIFTS FOR HER (WATCHES, PERFUMES, FLOWERS)

// OTHERS
let featuredWatches = [];
let featuredHandbags = [];
let featuredShoes = [];
let featuredBelts = [];
let featuredBracelets = [];
let featuredFurnitures = [];
let featuredClothings = [];
let featuredEarrings = [];
let featuredPerfumes = [];
let featuredNecklaces = [];
let featuredFlowers = [];
let featuredTravelBags = [];
let featuredRings = [];
let featuredBags = [];
let featuredAccessories = [];

let timeOut = 2500;

async function resolveGalleryItems(){

	let ipLoc = {};

	let dbCollectionToFocusOn = '';

	let eIPURL='https://extreme-ip-lookup.com/json/?key=uLYcH3A5LvgGZm9CKjxM';



	let options = {
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



			return dbCollectionToFocusOn;
		}
		else{

			console.error('Error encountered while parsing origin');
		}

	})
	.then((dbCollectionToFocusOn) => {

		console.log(dbCollectionToFocusOn);

		// obtaining products as per current country
		let dbQueryAll = wixData.query(dbCollectionToFocusOn).limit(1000).find(options);

		return dbQueryAll.then((dbQueryAllResponse) => {

			dbQueryAllResponseItems	= dbQueryAllResponse.items;

			return dbQueryAllResponse.items

		});

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
	//	let gallery1ItemsReformatted = [];
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

	if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
		$w('#section5').hide();
		$w('#recommendedForWomenGallery').hide();
		$w('#gallery1').scrollTo()

	}

	// $w('#line1').hide();

	resolveGalleryItems();


	setTimeout(() => {

		console.log('dbQueryAllResponseItems.length: ' + dbQueryAllResponseItems.length);

		// let gallery1ItemsReformatted = [];
		let gallery1AlreadyIncludedCategoryTrackerList = [];
		let gallery1AlreadyIncludedAsPerTheirRelativeGenderTrackerList = [];
		let ladiesShoesAndBagsIncludedTracker = [];

		// counting the number of products per gender --> for use in recommendedForWomen..
		// let dbQueryAllResponseItemsTotalProductsCount = dbQueryAllResponseItems.length;
		// let dbQueryAllResponseItemsMensProductCount = dbQueryAllResponseItems.filter(item => item.gender == 'MEN').length;
		// let dbQueryAllResponseItemsWomensProductCount = dbQueryAllResponseItemsTotalProductsCount - dbQueryAllResponseItemsMensProductCount;

		// making a perfect count of product per category per gender
		let totalProductsPerCategoryPerGender = {'WOMEN': {}, 'MEN': {}};

		// tracking available categories for each gender
		let availableProductsCategoryForEachGender = {
			'WOMEN': [], 'MEN': []
		}

		let count = 0;


		dbQueryAllResponseItems.forEach((item) => {

			// console.log('here');
			let productCat = item.productCategory;
			let productGender = item.gender;

			// check whether or not the current product's category has been added to availableProductsCategoryForEachGender,
			// if it hasn't been added, add it to the appropriate gender..
			let isCurrentProductCategoryInAvailableProductsCategoryForEachGender = false;

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
			// let currentCategoryWithinCurrentGender = totalProductsPerCategoryPerGender[productGender][productCat];
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


		let womensFeatureableProducts = totalProductsPerCategoryPerGender.WOMEN;
		let mensFeatureableProducts = totalProductsPerCategoryPerGender.MEN;

		// list of shoes and bags that are available for women
		let womensFeaturableShoesList = womensFeatureableProducts['SHOE'];
		let womensFeaturableBagsList = womensFeatureableProducts['HANDBAG'];

		let womensFeaturableShoesListCopy = JSON.parse(JSON.stringify(womensFeatureableProducts['SHOE']));// womensFeatureableProducts['SHOE'];
		let womensFeaturableBagsListCopy = JSON.parse(JSON.stringify(womensFeatureableProducts['HANDBAG'])); // womensFeatureableProducts['HANDBAG'];

		// console.log('type check');
		// for (let x in womensFeaturableShoesList){
		// 	console.log(JSON.stringify(womensFeaturableShoesList[x].productLink == womensFeaturableShoesListCopy[x].productLink));
		// }
		// console.log(womensFeaturableBagsList == womensFeaturableBagsListCopy);

		console.log('');
		console.log('womensFeatureableProducts: ' + womensFeatureableProducts);
		console.log('mensFeatureableProducts: ' + mensFeatureableProducts);

		/// product categories that's currently available per gender selection
		let availableProductCategoriesForMen = availableProductsCategoryForEachGender['MEN'];
		let availableProductCategoriesForWomen = availableProductsCategoryForEachGender['WOMEN'];

		console.log('');
		console.log("Available Categories Men: [" + availableProductCategoriesForMen + ']');
		console.log("Available Categories Women: [" + availableProductCategoriesForWomen + ']');


		// let gallery1MensProductsCount = gallery1AlreadyIncludedAsPerTheirRelativeGenderTrackerList.filter(gender => gender == 'MEN').length;
		// let gallery1WomensProductsCount = gallery1AlreadyIncludedAsPerTheirRelativeGenderTrackerList.filter(gender => gender == 'WOMEN').length;

		/// setting recommendedForWomen's limit based on the number of items in dbQueryAllResponseItems
		let recommendedForWomenContentTargetCount = 10;

		if (dbQueryAllResponseItems.length < 10){

			recommendedForWomenContentTargetCount = dbQueryAllResponseItems.length;

		}


		let currentProductItemsIndexWithinListOfAllProducts = 1;



		/// obtain recommendedForWomensGallery's content while ensuring 10 women's products have been added..
		// if (dbQueryAllResponseItems.length >= recommendedForWomenContentTargetCount){

			// while (recommendedForWomen.length < recommendedForWomenContentTargetCount) {

			while (currentProductItemsIndexWithinListOfAllProducts < dbQueryAllResponseItems.length) {

				for (let gender in totalProductsPerCategoryPerGender){

						for (let productCategory in totalProductsPerCategoryPerGender[gender]){

							// ' + productCategory);

							if (totalProductsPerCategoryPerGender[gender][productCategory].length != 0){

								/// current product within current product category
								let currentProduct = totalProductsPerCategoryPerGender[gender][productCategory][0];

								// console.log('currentProduct: ' + currentProduct.title);

								if (currentProduct.siteName != ''){

									// defining item's title
									let currentProductTitle = currentProduct.title;

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
									// 	let doNothing = {};
									// }


										let indexOfCurrentProduct = dbQueryAllResponseItems.indexOf(currentProduct);

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
											}
											else if (productCategory == 'ACCESSORIES'){
												otherAccessoriesWomen.push({
													"type": "image",
	  												"title": currentProductTitle,
	 		  										"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  												'description': currentProduct.price,
	  												'link': currentProduct.productCategory,
	  												'slug': String(indexOfCurrentProduct)
												})
											}
										}

										// populating all product categories for men
										if (currentProduct.gender == 'MEN'){

											// let isDisplayMensShoesAndWatches = isItemsInList(availableProductCategoriesForMen, ['SHOE', 'WATCH', 'WATCHES']);
											// let isDisplayMensNecklacesAndBracelet = isItemsInList(availableProductCategoriesForMen, ['NECKLACE', 'BRACELET']);
											// let isDisplayFurnituresForMen = isItemsInList(availableProductCategoriesForMen, ['FURNITURE']);
											// let isDisplayMensClothesAndPerfumes = isItemsInList(availableProductCategoriesForMen, ['CLOTHING', 'PERFUME']);
											// let isDisplayFlowersAndMensRings = isItemsInList(availableProductCategoriesForMen, ['FLOWER', 'RING']);
											// let isDisplayMensTravelBagsAndOtherBags = isItemsInList(availableProductCategoriesForMen, ['TRAVEL BAG', 'BAG']);
											// let isDisplayOtherAccessoriesForMen = isItemsInList(availableProductCategoriesForMen, ['ACCESSORIES']);
											// let isDisplayGiftsForHer = isItemsInList(availableProductCategoriesForWomen, ['FLOWER', 'RING', 'NECKLACE', ]);


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
											}
											else if (productCategory == 'NECKLACE' || productCategory == 'BRACELET'){
												necklacesAndBracletsMen.push({
													"type": "image",
	  												"title": currentProductTitle,
	 		  										"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  												'description': currentProduct.price,
	  												'link': currentProduct.productCategory,
	  												'slug': String(indexOfCurrentProduct)
												});
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
												})
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
											}
											else if (productCategory == 'TRAVEL BAG' || productCategory == 'BAG'){
												travelBagsAndOtherBagsMen.push({
													"type": "image",
	  												"title": currentProductTitle,
	 		  										"src": currentProduct.imageSrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
	  												'description': currentProduct.price,
	  												'link': currentProduct.productCategory,
	  												'slug': String(indexOfCurrentProduct)
												})
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
		let ladiesShoesIncludedCount = ladiesShoesAndBagsIncludedTracker.filter((shoeOrBagIncluded) => shoeOrBagIncluded == 'SHOE').length;
		let ladiesBagsIncludedCount = ladiesShoesAndBagsIncludedTracker.filter((shoeOrBagIncluded) => shoeOrBagIncluded == 'HANDBAG').length;

		for (let index in recommendedForWomen){
				console.log(recommendedForWomen[index]);
				console.log('typeof(index): ' + typeof(index));
		}
		// console.log('');
		// console.log(womensFeatureableProducts['BRACELET']['0']);





		if (ladiesShoesIncludedCount < 3 ||
				ladiesBagsIncludedCount < 3){

			console.log('');
			console.log('ladiesBagsIncludedCount: ' + ladiesBagsIncludedCount);
			console.log('ladiesShoesIncludedCount: ' + ladiesShoesIncludedCount);


			let typeWomensFeaturableShoesListCopy = typeof(womensFeaturableShoesListCopy);
			let typeWomensFeaturableBagsListCopy = typeof(womensFeaturableBagsListCopy);

			let maxNumberOfShoesThatShouldBeAddedTorecommendedForWomen = 0;
			let maxNumberOfBagsThatShouldBeAddedTorecommendedForWomen = 0;

			console.log('womensFeaturableShoesListCopy: ' + womensFeaturableShoesListCopy);
			console.log('ladiesShoesIncludedCount: ' + ladiesShoesIncludedCount);


			// if shoe products exists in the shoe category with up to one product
			if (typeWomensFeaturableShoesListCopy == 'object'){

				if (womensFeaturableShoesListCopy.length >= 1){

					maxNumberOfShoesThatShouldBeAddedTorecommendedForWomen = 3 - ladiesShoesIncludedCount;

					console.log('');
					console.log('maxNumberOfShoesThatShouldBeAddedTorecommendedForWomen: ' + maxNumberOfShoesThatShouldBeAddedTorecommendedForWomen);

				}

				// loop to remove non handbag or shoe item from featuredGallery and replace with shoes instead
				for (let indexOne = 0 ; indexOne < womensFeaturableShoesListCopy.length; indexOne ++){

					// remove a featured general gallery item that's not a handbag or shoe..
					for (let indexTwo in recommendedForWomen){

						if (recommendedForWomen[indexTwo].link != 'SHOE' && recommendedForWomen[indexTwo].link != 'HANDBAG'){

							recommendedForWomen.splice(Number(indexTwo), 1);

							break;

						}
					}

					// add shoe product to featured general item
					let currentShoeProduct = womensFeaturableShoesListCopy[indexOne];
					let indexOfCurrentProduct = dbQueryAllResponseItems.indexOf(currentShoeProduct);

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
			if (typeWomensFeaturableBagsListCopy == 'object'){

				if (womensFeaturableBagsListCopy.length >= 1){

					maxNumberOfBagsThatShouldBeAddedTorecommendedForWomen = 3 - ladiesBagsIncludedCount;

					console.log('');
					console.log('maxNumberOfBagsThatShouldBeAddedTorecommendedForWomen: ' + maxNumberOfBagsThatShouldBeAddedTorecommendedForWomen);

				}


				// i.e loop to remove non handbag or shoe item from featuredGallery and replace with handbag instead
				for (let indexOne = 0 ; indexOne < womensFeaturableBagsListCopy.length; indexOne ++){

					console.log('');
					console.log('womensFeaturableBagsListCopy.length: ' + womensFeaturableBagsListCopy.length);


					// remove a featured general gallery  that's not a bag or shoe..
					for (let indexTwo in recommendedForWomen){

						if (recommendedForWomen[indexTwo].link != 'SHOE' && recommendedForWomen[indexTwo].link != 'HANDBAG'){

							recommendedForWomen.splice(Number(indexTwo), 1);

							break;

						}
					}

					// add bag product to featured general item
					let currentBagProduct = womensFeaturableBagsListCopy[indexOne];
					let indexOfCurrentProduct = dbQueryAllResponseItems.indexOf(currentBagProduct);
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

		console.log($w('#customButton'));
		$w('#customButton').show();

		/// CONFIGURING CONTENTS FOR RECOMMENDED GALLERY
		if(wixWindow.formFactor === "Desktop"){
			$w('#recommendedForWomenGallery').items = recommendedForWomen;
			$w('#recommendedForWomenGallery').show();
		}


		// CONFIGURING THE FILTERS AND CONTENTS OF THE MAIN GALLERY
		// 1.a Product Category Filter For Women
		let listOfProductCategoryForWomen = [];

		// let listOfProductCategoryForWomen = [
		// 	{"label": "Shoes & More", "value": "Shoes & More"},
		// 	{"label": "Handbags & More", "value": "Handbags & More"},
		// 	{"label": "Furnitures", "value": "Furnitures"},
		// 	{"label": "Clothes And Perfumes", "value": "Clothes And Perfumes"},
		// 	{"label": "Flowers & Rings", "value": "Flowers & Rings"},
		// 	{"label": "Travel Bags & Other Bags", "value": "Travel Bags & Other Bags"},
		// 	{"label": "Other Accessories", "value": "Other Accessories"},
		// 	{"label": "Gifts For Him", "value": "Gifts For Him"}
		// ];

		console.log('availableProductCategoriesForWomen: ' + availableProductCategoriesForWomen);
		let isDisplayShoesAndMore = isItemsInList(availableProductCategoriesForWomen, ['SHOE', 'NECKLACE', 'EARRING']);
		// console.log('isDisplayShoesAndMore: ' + isDisplayShoesAndMore);
		let isDisplayHandbagsAndMore = isItemsInList(availableProductCategoriesForWomen, ['HANDBAG', 'BRACELET', 'WATCH', 'WATCHES']);
		// console.log('isDisplayHandbagsAndMore: ' + isDisplayHandbagsAndMore);
		let isDisplayFurnituresForWomen = isItemsInList(availableProductCategoriesForWomen, ['FURNITURE']);
		// console.log('isDisplayFurnitures: ' + isDisplayFurnitures);
		let isDisplayWomensClothesAndPerfumes = isItemsInList(availableProductCategoriesForWomen, ['CLOTHING', 'PERFUME']);
		let isDisplayFlowersAndWomensRings = isItemsInList(availableProductCategoriesForWomen, ['FLOWER', 'RING']);
		let isDisplayTravelBagsAndOtherBags = isItemsInList(availableProductCategoriesForWomen, ['TRAVEL BAG', 'BAG']);
		let isDisplayOtherAccessoriesForWomen = isItemsInList(availableProductCategoriesForWomen, ['ACCESSORIES']);
		let isDisplayGiftsForHim = isItemsInList(availableProductCategoriesForMen, ['FLOWER', 'RING', 'WATCH', 'WATCHES']);

		if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
			listOfProductCategoryForWomen.push({"label": "Recommended", "value": "Recommended"});
		}

		if (isDisplayShoesAndMore){
			listOfProductCategoryForWomen.push({"label": "Shoes & More", "value": "Shoes & More"});
		}

		if (isDisplayHandbagsAndMore){
			listOfProductCategoryForWomen.push({"label": "Handbags & More", "value": "Handbags & More"});
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
		let listOfProductCategoryForMen = [];


		// let listOfProductCategoryForMen = [
		// 	{"label": "Shoes & Watches", "value": "Shoes & Watches"},
		// 	{"label": "Necklaces & Bracelets", "value": "Necklaces & Bracelets"},
		// 	{"label": "Furnitures", "value": "Furnitures"},
		// 	{"label": "Clothes & Perfumes", "value": "Clothes & Perfumes"},
		// 	{"label": "Flowers & Rings", "value": "Flowers & Rings"},
		// 	{"label": "Travel Bags & Other Bags", "value": "Travel Bags & Other Bags"},
		// 	{"label": "Other Accessories", "value": "Other Accessories"},
		// 	{"label": "Gifts For Her", "value": "Gifts For Her"}
		// ];

		let isDisplayMensShoesAndWatches = isItemsInList(availableProductCategoriesForMen, ['SHOE', 'WATCH', 'WATCHES']);
		let isDisplayMensNecklacesAndBracelet = isItemsInList(availableProductCategoriesForMen, ['NECKLACE', 'BRACELET']);
		let isDisplayFurnituresForMen = isItemsInList(availableProductCategoriesForMen, ['FURNITURE']);
		let isDisplayMensClothesAndPerfumes = isItemsInList(availableProductCategoriesForMen, ['CLOTHING', 'PERFUME']);
		let isDisplayFlowersAndMensRings = isItemsInList(availableProductCategoriesForMen, ['FLOWER', 'RING']);
		let isDisplayMensTravelBagsAndOtherBags = isItemsInList(availableProductCategoriesForMen, ['TRAVEL BAG', 'BAG']);
		let isDisplayOtherAccessoriesForMen = isItemsInList(availableProductCategoriesForMen, ['ACCESSORIES']);
		let isDisplayGiftsForHer = isItemsInList(availableProductCategoriesForWomen, ['FLOWER', 'RING', 'EARRING', 'NECKLACE', ]);

		if (isDisplayMensShoesAndWatches){
			listOfProductCategoryForMen.push({"label": "Shoes & Watches", "value": "Shoes & Watches"});
		}

		if (isDisplayMensNecklacesAndBracelet){
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
				$w('#dropdown3').value = 'Shoes & More';
				setMainGalleryBasedOnProductCategory();
			}
			else if ($w('#dropdown1').value == 'Men'){
				$w('#dropdown3').options = listOfProductCategoryForMen;
				$w('#dropdown3').value = 'Shoes & Watches';
				setMainGalleryBasedOnProductCategory();
			}

		});



		// brand options

		// sort options
		let sortOptions = [
			{"label": "Relevance", "value": "Relevance"},
			{"label": "Price Ascending", "value": "Price Ascending"},
			{"label": "Price Descending", "value": "Price Descending"},
			{"label": "Popularity", "value": "Popularity"},
			{"label": "Most Recent", "value": "Most Recent"}
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
		})



		// Gallery contents when gender is female and product category is 'recommended'
		// console.log(recommendedForWomen);
		// This is the default main gallery's content for mobile devices

		if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
			$w('#gallery1').items = recommendedForWomen;
			$w('#gallery1').show();
		}

		// This is the default main gallery's content for desktops devices
		if(wixWindow.formFactor === "Desktop"){
			$w('#gallery1').items = orderProducts(shoesAndMoreWomen, 'SHOE', 3);
			$w('#gallery1').show();
		}

		// console.log('dbQueryAllResponseItems: ' + dbQueryAllResponseItems);

		// When each main gallery recommended item is clicked, get the link, and open it in new tab...
		$w('#recommendedForWomenGallery').onItemClicked((event) => {

				// let replacement = event.item;
				// recommendedForWomen[0].link = 'https://row.jimmychoo.com/en_AE/women/shoes/saeda-100/unicorn-printed-satin-pumps-with-crystal-embellishment-SAEDA100BAY051552.html?cgid=women-shoes';

				// recommendedForWomen[0] = replacement;

				// $w('#gallery1').items = recommendedForWomen;

				// let indexOfEventItem = recommendedForWomen.indexOf[event.item.slug];

				openTarget(event);



		});

		$w('#gallery1').onItemClicked((event) => {

				// let replacement = event.item;
				// recommendedForWomen[0].link = 'https://row.jimmychoo.com/en_AE/women/shoes/saeda-100/unicorn-printed-satin-pumps-with-crystal-embellishment-SAEDA100BAY051552.html?cgid=women-shoes';

				// recommendedForWomen[0] = replacement;

				// $w('#gallery1').items = recommendedForWomen;

				// let indexOfEventItem = recommendedForWomen.indexOf[event.item.slug];
				openTarget(event);



		});

		// set main gallery's each time productCategory filter's value changes
		$w('#dropdown3').onChange((event) => {

			setMainGalleryBasedOnProductCategory();

		});





	}, timeOut);



})

// // function to check the number of whether or not an item is in list
function isItemsInList(
	containerlist,
	listOfItemsToSearchFor,
){
	let responseList = [];

	for (let indexOfItemToSearchFor in listOfItemsToSearchFor){

		// check whether or not the current item to search for is within the container list, if so return true and vice versa
		let response = containerlist.filter((itemWithinList) => {
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

function openTarget(event){

	// $w('#button1').link = dbQueryAllResponseItems[Number(event.item.slug)].productLink;
				$w('#button1').target = '_blank';
				$w('#button1').enable();
				// $w('#html1').postMessage('click');
				// console.log('event.item.slug: ' + event.item.slug);
				// console.log('productLink: ' + dbQueryAllResponseItems[Number(event.item.slug)].productLink);
				console.log(event.item.slug);
				console.log($w('#button1').link);
				console.log($w('#button1').id);
				console.log($w('#button1').label);

				$w('#button1').onClick((event) => {

					$w('#button1').link = '';

				});

}

function setMainGalleryBasedOnProductCategory(){

	let currentProductCategory = $w('#dropdown3').value;
	let gender = $w('#dropdown1').value;


	if (gender == 'Women'){

		// product categories that pertain to women
		if (currentProductCategory == 'Shoes & More'){

			if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
				$w('#gallery1').items = orderProducts(shoesAndMoreWomen, 'SHOE', 2);
				mainGalleryCopy = $w('#gallery1').items;
			}
			if(wixWindow.formFactor === "Desktop"){
				$w('#gallery1').items = orderProducts(shoesAndMoreWomen, 'SHOE', 3);
				mainGalleryCopy = $w('#gallery1').items;
			}

		}
		else if (currentProductCategory == 'Handbags & More'){

			if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
				$w('#gallery1').items = orderProducts(handbagsAndMoreWomen, 'HANDBAG', 2);
				mainGalleryCopy = $w('#gallery1').items;
			}
			if(wixWindow.formFactor === "Desktop"){
				$w('#gallery1').items = orderProducts(handbagsAndMoreWomen, 'HANDBAG', 3);
				mainGalleryCopy = $w('#gallery1').items;
			}

		}
		else if (currentProductCategory == 'Furnitures'){

			if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
				$w('#gallery1').items = orderProducts(furnituresMenAndWomen, 'FURNITURE', 2);
				mainGalleryCopy = $w('#gallery1').items;
			}
			if(wixWindow.formFactor === "Desktop"){
				$w('#gallery1').items = orderProducts(furnituresMenAndWomen, 'FURNITURE', 3);
				mainGalleryCopy = $w('#gallery1').items;
			}

		}
		else if (currentProductCategory == 'Clothes & Perfumes'){

			if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
				$w('#gallery1').items = orderProducts(clothesAndPerfumesWomen, 'CLOTHING', 2);
				mainGalleryCopy = $w('#gallery1').items;
			}
			if(wixWindow.formFactor === "Desktop"){
				$w('#gallery1').items = orderProducts(clothesAndPerfumesWomen, 'CLOTHING', 3);
				mainGalleryCopy = $w('#gallery1').items;
			}

		}
		else if (currentProductCategory == 'Flowers & Rings'){

			if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
				$w('#gallery1').items = orderProducts(flowersAndRingsWomen, 'RING', 2);
				mainGalleryCopy = $w('#gallery1').items;
			}
			if(wixWindow.formFactor === "Desktop"){
				$w('#gallery1').items = orderProducts(flowersAndRingsWomen, 'RING', 3);
				mainGalleryCopy = $w('#gallery1').items;
			}

		}
		else if (currentProductCategory == 'Travel Bags & Other Bags'){

			if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
				$w('#gallery1').items = orderProducts(travelBagsAndOtherBagsWomen, 'TRAVEL BAG', 2);
				mainGalleryCopy = $w('#gallery1').items;
			}
			if(wixWindow.formFactor === "Desktop"){
				$w('#gallery1').items = orderProducts(travelBagsAndOtherBagsWomen, 'TRAVEL BAG', 3);
				mainGalleryCopy = $w('#gallery1').items;
			}

		}
		else if (currentProductCategory == 'Other Accessories'){

			if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
				$w('#gallery1').items = orderProducts(otherAccessoriesWomen, 'ACCESSORIES', 2);
				mainGalleryCopy = $w('#gallery1').items;
			}
			if(wixWindow.formFactor === "Desktop"){
				$w('#gallery1').items = orderProducts(otherAccessoriesWomen, 'ACCESSORIES', 3);
				mainGalleryCopy = $w('#gallery1').items;
			}

		}else if (currentProductCategory == 'Gifts For Him'){

			if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
				$w('#gallery1').items = orderProducts(giftsForHim, 'WATCHES', 2);
				mainGalleryCopy = $w('#gallery1').items;
			}
			if(wixWindow.formFactor === "Desktop"){
				$w('#gallery1').items = orderProducts(giftsForHim, 'WATCHES', 3);
				mainGalleryCopy = $w('#gallery1').items;
			}
		}
	}

	else if (gender == 'Men'){

		if (currentProductCategory == 'Shoes & Watches'){

		if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
			$w('#gallery1').items = orderProducts(shoesAndWatchesMen, 'SHOE', 1);
			mainGalleryCopy = $w('#gallery1').items;
		}
		if(wixWindow.formFactor === "Desktop"){
			$w('#gallery1').items = orderProducts(shoesAndWatchesMen, 'SHOE', 1);
			mainGalleryCopy = $w('#gallery1').items;
		}
		}
		else if (currentProductCategory == 'Necklaces & Bracelets'){

			if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
				$w('#gallery1').items = orderProducts(necklacesAndBracletsMen, 'NECKLACE', 2);
				mainGalleryCopy = $w('#gallery1').items;
			}
			if(wixWindow.formFactor === "Desktop"){
				$w('#gallery1').items = orderProducts(necklacesAndBracletsMen, 'NECKLACE', 3);
				mainGalleryCopy = $w('#gallery1').items;
			}
		}
		else if (currentProductCategory == 'Furnitures'){

			if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
				$w('#gallery1').items = orderProducts(furnituresMenAndWomen, 'FURNITURE', 2);
				mainGalleryCopy = $w('#gallery1').items;
			}
			if(wixWindow.formFactor === "Desktop"){
				$w('#gallery1').items = orderProducts(furnituresMenAndWomen, 'FURNITURE', 3);
				mainGalleryCopy = $w('#gallery1').items;
			}
		}
		else if (currentProductCategory == 'Clothes & Perfumes'){

			if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
				$w('#gallery1').items = orderProducts(clothesAndPerfumesMen, 'CLOTHING', 2);
				mainGalleryCopy = $w('#gallery1').items;
			}
			if(wixWindow.formFactor === "Desktop"){
				$w('#gallery1').items = orderProducts(clothesAndPerfumesMen, 'CLOTHING', 3);
				mainGalleryCopy = $w('#gallery1').items;
			}
		}
		else if (currentProductCategory == 'Flowers & Rings'){

			if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
				$w('#gallery1').items = orderProducts(flowersAndRingsMen, 'RING', 2);
				mainGalleryCopy = $w('#gallery1').items;
			}
			if(wixWindow.formFactor === "Desktop"){
				$w('#gallery1').items = orderProducts(flowersAndRingsMen, 'RING', 3);
				mainGalleryCopy = $w('#gallery1').items;
			}
		}
		else if (currentProductCategory == 'Travel Bags & Other Bags'){

			if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
				$w('#gallery1').items = orderProducts(travelBagsAndOtherBagsMen, 'TRAVEL BAG', 2);
				mainGalleryCopy = $w('#gallery1').items;
			}
			if(wixWindow.formFactor === "Desktop"){
				$w('#gallery1').items = orderProducts(travelBagsAndOtherBagsMen, 'TRAVEL BAG', 3);
				mainGalleryCopy = $w('#gallery1').items;
			}
		}
		else if (currentProductCategory == 'Other Accessories'){

			if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
				$w('#gallery1').items = orderProducts(otherAccessoriesMen, 'ACCESSORIES', 2);
				mainGalleryCopy = $w('#gallery1').items;
			}
			if(wixWindow.formFactor === "Desktop"){
				$w('#gallery1').items = orderProducts(otherAccessoriesMen, 'ACCESSORIES', 3);
				mainGalleryCopy = $w('#gallery1').items;
			}
		}
		else if (currentProductCategory == 'Gifts For Her'){

			if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
				$w('#gallery1').items = orderProducts(giftForHer, 'NECKLACE', 1);
				mainGalleryCopy = $w('#gallery1').items;
			}
			if(wixWindow.formFactor === "Desktop"){
				$w('#gallery1').items = orderProducts(giftForHer, 'NECKLACE', 1);
				mainGalleryCopy = $w('#gallery1').items;
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
	subcategoryOneName = 'None', // for future 'improve'
	subcategoryTwoName = 'None', // for future 'improve'
){

	let orderedContent = [];

	let initialValueofPositionOfSubcategoryFrommainCategoryVariable = positionOfSubcategoryFromMainCategory;
	let nonMainCategoryProductInsertIndex = positionOfSubcategoryFromMainCategory;

	// include the mainCategory in the orderedContent list first..
	for (let productIndex in listOfCategoryOptionsProducts){

		let currentProduct = listOfCategoryOptionsProducts[productIndex];

		if (currentProduct.link == mainCategoryName){
			orderedContent.push(currentProduct)
		}
	}

	// include every other product whose category is not the main category..
	for (let productIndex in listOfCategoryOptionsProducts){

		let currentProduct = listOfCategoryOptionsProducts[productIndex];

		// if the value that indicates where non main category products should be positioned
		// has not changed, insert the current non main category product at the 'positionOfSubcategoryFromMainCategory'
		// else place it just after the 'positionOfSubcategoryFromMainCategory'. This helps ensure that non main category products are
		// positioned evenly..
		// if (nonMainCategoryProductInsertIndex == initialValueofPositionOfSubcategoryFrommainCategoryVariable){

			if (currentProduct.link != mainCategoryName){
				orderedContent.splice(nonMainCategoryProductInsertIndex, 0, currentProduct);
				nonMainCategoryProductInsertIndex += positionOfSubcategoryFromMainCategory + 1;
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

	return orderedContent;

}


function sortMainGallery(){

	let currentSortValue = $w('#dropdown5').value;

	if (currentSortValue == 'Relevance'){

		$w('#gallery1').items = mainGalleryCopy;

	}

}