// Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction

import wixData from 'wix-data';
import wixLocation from 'wix-location';
import wixFetch from 'wix-fetch';
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

var totalProductsPerCategoryPerGenderCopy = '';

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
var handbagsAndMoreWomen = []; // Bags (BRACELET , WATCH)
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

var timeOut = 4500;

async function resolveGalleryItems() {

    var ipLoc = {};

    var dbCollectionToFocusOn = '';

    var userIPFetchUrl = 'https://extreme-ip-lookup.com/json/?key=uLYcH3A5LvgGZm9CKjxM'; // ' 'https://extreme-ip-lookup.com/json/?key=uLYcH3A5LvgGZm9CKjxM';

    var options = {
        "suppressAuth": true,
        "suppressHooks": true,
    };

    // fetching each featured category's products as per visitor's country..
    console.log('pre-fetch');

    // var httpResponse = await wixFetch.fetch(userIPFetchUrl, {
    //     method: 'get',
    // 	// "headers": {
    // 	//   "Content-Type": "application/x-www-form-urlencoded"
    // 	// },
    // });

    // console.log('httpResponse.ok: ' + httpResponse.ok);
    // console.log('location fetch result: ' + httpResponse.json);

    if (true) {

        // var json = await httpResponse.json();
        //
        // ipLoc = json;

        if (true) {

            // console.log('post-fetch 3');
            //
            // // user's country
            // usersCountry = ipLoc.country;
            //
            // console.log('json: ');
            // console.log('userCountryCode: ' + ipLoc.countryCode);
            //
            //
            // /// defining collection in focus by user country
            // if (ipLoc.countryCode == 'SG') {
            // 	dbCollectionToFocusOn = 'Singaporeproducts';
            // 	usersCountryCode = 'SG';
            // }
            // else if (ipLoc.countryCode == 'AE'){
            // 	dbCollectionToFocusOn = 'Uaeproducts';
            // 	usersCountryCode = 'AE';
            // 	// timeOut = 2500;
            // }
            // else if (ipLoc.countryCode == 'GB'){
            // 	dbCollectionToFocusOn = 'Ukproducts';
            // 	usersCountryCode = 'GB';
            // }
            // else if (ipLoc.continent == 'North America'){
            //
            // 	dbCollectionToFocusOn = 'Usaproducts';
            // 	usersCountryCode = 'US';
            // }
            // else if (ipLoc.continent == 'Europe'){
            // 	dbCollectionToFocusOn = 'Euproducts';
            // 	usersCountryCode = 'EU';
            // }
            // else{
            // 	dbCollectionToFocusOn = 'Usaproducts';
            // 	usersCountryCode = 'US';
            // }

            console.log('Usaproducts');

            // obtaining products as per current country
            dbQueryAllResponseItems = await retrieveDatabaseItems(
                'Usaproducts', // dbCollectionToFocusOn
                options
            );

            // -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

            console.log('STARTING DATA FIXINGS');

            // STARTING DATA FIXINGS..
            var properDbQueryAllResponseItems = [];

            for (let itemIndexString in dbQueryAllResponseItems) {

                var currentDBItem = dbQueryAllResponseItems[Number(itemIndexString)];
                var currentDBItemGenderType = typeof (currentDBItem.gender);
                var currentDBItemProductCategoryType = typeof (currentDBItem.productcategory);

                var currentDBItemTitle = currentDBItem.title;
                var currentDBItemPrice = currentDBItem.price;
                var currentDBItemImageSrc = currentDBItem.imagesrc;

                // console.log('currentDBItemGenderType: ' + currentDBItem.gender + ", " + currentDBItemGenderType);
                // console.log('currentDBItemProductCategoryType: ' + currentDBItem.productcategory + ", " + currentDBItem.gender + ', ' + currentDBItemProductCategoryType);

                if (
                    currentDBItemGenderType != 'object' && currentDBItemProductCategoryType != 'object'
                ) {
                    // console.log('currentDBItemGenderType: ' + currentDBItemGenderType);
                    // console.log('currentDBItemProductCategoryType: ' + currentDBItemProductCategoryType);

                    // console.log('currentDBItemProductCategoryType: ' + currentDBItem.productcategory + ", " + currentDBItem.gender + ', ' + currentDBItemProductCategoryType);

                    // checking whether the current product has very similar variations in the database..
                    var numberOfTimesCurrentDBItemExistsInDB = dbQueryAllResponseItems.filter(
                        (product) => {

                            var ninetyFourPercentCurrentDBItemTitleIndex = Math.round(0.94 * currentDBItemTitle.length);
                            var ninetyFourPercentCurrentDBItemTitle = currentDBItemTitle.substring(0, ninetyFourPercentCurrentDBItemTitleIndex);

                            var currentDBItemGender = currentDBItem.gender;

                            var ninetyFourPercentCurrentDBItemImageSrcIndex = Math.round(0.90 * currentDBItemImageSrc.length);
                            var ninetyFourPercentCurrentDBItemImageSrc = currentDBItemImageSrc.substring(0, ninetyFourPercentCurrentDBItemImageSrcIndex);

                            // --

                            var ninetyFourPercentAProductFromDBsTitleIndex = Math.round(0.94 * (product.title).length);
                            var ninetyFourPercentAProductFromDBsTitle = product.title.substring(0, ninetyFourPercentAProductFromDBsTitleIndex)

                            var aProductFromDBsGender = product.gender;

                            var ninetyFourPercentAProductFromDBsImageSrcIndex = Math.round(0.90 * (product.imagesrc).length);
                            var ninetyFourPercentAProductFromDBsImageSrc = product.imagesrc.substring(0, ninetyFourPercentAProductFromDBsImageSrcIndex);

                            var ninetyFourPercentAProductFromDBsPrice = product.price;

                            // console.log(
                            // 	ninetyFourPercentAProductFromDBsTitle + ' == ' +  ninetyFourPercentCurrentDBItemTitle + '\n' +
                            // 		aProductFromDBsGender + ' == ' + currentDBItemGender + '\n' +
                            // 		ninetyFourPercentAProductFromDBsImageSrc + ' == ' + ninetyFourPercentCurrentDBItemImageSrc + '\n' +
                            // 		ninetyFourPercentAProductFromDBsPrice + ' == ' + currentDBItemPrice
                            // );

                            // comparing every product within DB with current product
                            return ninetyFourPercentAProductFromDBsTitle == ninetyFourPercentCurrentDBItemTitle &&
                                aProductFromDBsGender == currentDBItemGender &&
                                ninetyFourPercentAProductFromDBsImageSrc == ninetyFourPercentCurrentDBItemImageSrc &&
                                ninetyFourPercentAProductFromDBsPrice == currentDBItemPrice;

                        }
                    ).length;

                    console.log('numberOfTimesCurrentDBItemExistsInDB: ' + numberOfTimesCurrentDBItemExistsInDB);

                    // checking whether the an current item that has very similar variations in the database has been added to 'properDbQueryAllResponseItems' list
                    var isCurrentDBItemAlreadyAddedToProperDbQueryAllResponseItems = false;

                    if (numberOfTimesCurrentDBItemExistsInDB > 1) {

                        isCurrentDBItemAlreadyAddedToProperDbQueryAllResponseItems = properDbQueryAllResponseItems.filter((addedProducts) => {

                            var ninetyFourPercentCurrentDBItemTitleIndex = Math.round(0.94 * currentDBItemTitle.length);
                            var ninetyFourPercentCurrentDBItemTitle = currentDBItemTitle.substring(0, ninetyFourPercentCurrentDBItemTitleIndex);

                            var currentDBItemGender = currentDBItem.gender;

                            var ninetyFourPercentCurrentDBItemImageSrcIndex = Math.round(0.90 * currentDBItemImageSrc.length);
                            var ninetyFourPercentCurrentDBItemImageSrc = currentDBItemImageSrc.substring(0, ninetyFourPercentCurrentDBItemImageSrcIndex);

                            // --

                            var ninetyFourPercentAddedProductsTitleIndex = Math.round(0.94 * (addedProducts.title).length);
                            var ninetyFourPercentAddedProductsTitle = addedProducts.title.substring(0, ninetyFourPercentAddedProductsTitleIndex)

                            var addedProductsGender = addedProducts.gender;

                            var ninetyFourPercentAddedProductsImageSrcIndex = Math.round(0.90 * (addedProducts.imagesrc).length);
                            var ninetyFourPercentAddedProductsImageSrc = addedProducts.imagesrc.substring(0, ninetyFourPercentAddedProductsImageSrcIndex);

                            var ninetyFourPercentAddedProductsPrice = addedProducts.price;

                            // comparing every product within DB with current product
                            return ninetyFourPercentAddedProductsTitle == ninetyFourPercentCurrentDBItemTitle &&
                                addedProductsGender == currentDBItemGender &&
                                ninetyFourPercentAddedProductsImageSrc == ninetyFourPercentCurrentDBItemImageSrc &&
                                ninetyFourPercentAddedProductsPrice == currentDBItemPrice;

                        }).length > 0;
                    }

                    if (numberOfTimesCurrentDBItemExistsInDB == 1) {

                        properDbQueryAllResponseItems.push(currentDBItem);

                    } else if (numberOfTimesCurrentDBItemExistsInDB > 1 && isCurrentDBItemAlreadyAddedToProperDbQueryAllResponseItems == false) {

                        properDbQueryAllResponseItems.push(currentDBItem);

                    }

                }
            }

            // shuffled (proper) list of available products - To ensure that visitors do not keep seeing the same products over and over again

            properDbQueryAllResponseItems = properDbQueryAllResponseItems.sort(function () {
                return Math.random() - 0.4;
            })

            properDbQueryAllResponseItems = properDbQueryAllResponseItems.sort(function () {
                return Math.random() - 0.4;
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
            var totalProductsPerCategoryPerGender = { 'WOMEN': {}, 'MEN': {} };

            // tracking available categories for each gender
            var availableProductsCategoryForEachGender = {
                'WOMEN': [],
                'MEN': []
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

                if (productGender.includes('WOMEN') || productGender.includes('FEMALE')) {
                    isCurrentProductCategoryInAvailableProductsCategoryForEachGender =
                        availableProductsCategoryForEachGender['WOMEN'].filter((productCategory) => productCategory == productCat).length > 0;

                    if (isCurrentProductCategoryInAvailableProductsCategoryForEachGender == false) {
                        availableProductsCategoryForEachGender['WOMEN'].push(productCat);
                        totalProductsPerCategoryPerGender['WOMEN'][productCat] = [];
                    }

                    totalProductsPerCategoryPerGender.WOMEN[productCat].push(item);

                    console.log('countEntryWOMEN: ' + countEntry);

                } else if (productGender.includes('MEN') || (productGender.includes('MALE') && !productGender.includes('FEMALE'))) {
                    isCurrentProductCategoryInAvailableProductsCategoryForEachGender =
                        availableProductsCategoryForEachGender['MEN'].filter((productCategory) => productCategory == productCat).length > 0;

                    if (isCurrentProductCategoryInAvailableProductsCategoryForEachGender == false) {
                        console.log('pushed category for men: ' + productCat)
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

            totalProductsPerCategoryPerGenderCopy = JSON.parse(JSON.stringify(totalProductsPerCategoryPerGender));

            var womensFeatureableProducts = totalProductsPerCategoryPerGender.WOMEN;
            var mensFeatureableProducts = totalProductsPerCategoryPerGender.MEN;

            // list of shoes and bags that are available for women
            var womensFeaturableShoesList = womensFeatureableProducts['SHOE'];
            var womensFeaturableBagsList = womensFeatureableProducts['HANDBAG'];

            console.log('got here 1');

            var womensFeaturableShoesListCopy = [];
            var womensFeaturableBagsListCopy = [];

            if (typeof (womensFeaturableShoesList) == 'object') {

                womensFeaturableShoesListCopy = JSON.parse(JSON.stringify(womensFeaturableShoesList)); // womensFeatureableProducts['SHOE'];

            }

            if (typeof (womensFeaturableBagsList) == 'object') {

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

            if (dbQueryAllResponseItems.length < 10) {

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

                for (var gender in totalProductsPerCategoryPerGender) {

                    // console.log('got here x2');

                    for (var productCategory in totalProductsPerCategoryPerGender[gender]) {

                        // console.log('got here x3');

                        // ' + productCategory);

                        if (totalProductsPerCategoryPerGender[gender][productCategory].length != 0) {

                            // console.log('got here 4a');

                            /// current product within current product category
                            var currentProduct = totalProductsPerCategoryPerGender[gender][productCategory][0];

                            // console.log('currentProduct: ' + currentProduct.title);

                            if (currentProduct.siteName != '') {

                                // defining item's title
                                var currentProductTitle = currentProduct.title;

                                if (currentProductTitle.length > 30) {
                                    currentProductTitle = currentProduct.title.substring(0, 59) + '..';
                                } else {
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
                                if (currentProduct.gender == 'WOMEN') {

                                    if (productCategory == 'SHOE' || productCategory == 'NECKLACE' || productCategory == 'EARRING') { // productCategory == 'SANDALS'

                                        shoesAndMoreWomen.push({

                                            "type": "image",
                                            "title": currentProductTitle,
                                            "src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
                                            'description': currentProduct.price,
                                            'link': currentProduct.productcategory,
                                            'slug': String(indexOfCurrentProduct)

                                        });

                                        if (productCategory == 'NECKLACE' && giftsForHer.length < 20) {
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
                                        if (!currentProduct.imagesrc.includes('amazon')) {

                                            shoesAndMoreWomenAmazonless.push({

                                                "type": "image",
                                                "title": currentProductTitle,
                                                "src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
                                                'description': currentProduct.price,
                                                'link': currentProduct.productcategory,
                                                'slug': String(indexOfCurrentProduct)
                                            });

                                            if (productCategory == 'NECKLACE' && giftsForHerAmazonless.length < 20 && !currentProduct.imagesrc.includes('amazon')) {
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

                                    } else if (productCategory == 'HANDBAG' || productCategory == 'BRACELET' || productCategory == 'WATCH' || productCategory == 'WATCHES') {
                                        handbagsAndMoreWomen.push({

                                            "type": "image",
                                            "title": currentProductTitle,
                                            "src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
                                            'description': currentProduct.price,
                                            'link': currentProduct.productcategory,
                                            'slug': String(indexOfCurrentProduct)
                                        });

                                        if (productCategory == 'BRACELET' && giftsForHer.length < 20) {
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
                                        if (!currentProduct.imagesrc.includes('amazon')) {

                                            handbagsAndMoreWomenAmazonless.push({

                                                "type": "image",
                                                "title": currentProductTitle,
                                                "src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
                                                'description': currentProduct.price,
                                                'link': currentProduct.productcategory,
                                                'slug': String(indexOfCurrentProduct)
                                            });

                                            if (productCategory == 'BRACELET' && giftsForHerAmazonless.length < 20 && !currentProduct.imagesrc.includes('amazon')) {

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

                                    } else if (productCategory == 'FURNITURE') {
                                        furnituresMenAndWomen.push({

                                            "type": "image",
                                            "title": currentProductTitle,
                                            "src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
                                            'description': currentProduct.price,
                                            'link': currentProduct.productcategory,
                                            'slug': String(indexOfCurrentProduct)
                                        })

                                        // populating Amazonless
                                        if (!currentProduct.imagesrc.includes('amazon')) {

                                            furnituresMenAndWomenAmazonless.push({

                                                "type": "image",
                                                "title": currentProductTitle,
                                                "src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
                                                'description': currentProduct.price,
                                                'link': currentProduct.productcategory,
                                                'slug': String(indexOfCurrentProduct)
                                            });

                                        }

                                    } else if (productCategory == 'CLOTHING' || productCategory == 'PERFUME') {
                                        clothesAndPerfumesWomen.push({

                                            "type": "image",
                                            "title": currentProductTitle,
                                            "src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
                                            'description': currentProduct.price,
                                            'link': currentProduct.productcategory,
                                            'slug': String(indexOfCurrentProduct)
                                        })

                                        // populating Amazonless
                                        if (!currentProduct.imagesrc.includes('amazon')) {

                                            clothesAndPerfumesWomenAmazonless.push({

                                                "type": "image",
                                                "title": currentProductTitle,
                                                "src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
                                                'description': currentProduct.price,
                                                'link': currentProduct.productcategory,
                                                'slug': String(indexOfCurrentProduct)
                                            });

                                        }

                                    } else if (productCategory == 'FLOWER' || productCategory == 'RING') {
                                        flowersAndRingsWomen.push({

                                            "type": "image",
                                            "title": currentProductTitle,
                                            "src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
                                            'description': currentProduct.price,
                                            'link': currentProduct.productcategory,
                                            'slug': String(indexOfCurrentProduct)
                                        });

                                        if (giftsForHer.length < 20) {
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
                                        if (!currentProduct.imagesrc.includes('amazon')) {

                                            flowersAndRingsWomenAmazonless.push({

                                                "type": "image",
                                                "title": currentProductTitle,
                                                "src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
                                                'description': currentProduct.price,
                                                'link': currentProduct.productcategory,
                                                'slug': String(indexOfCurrentProduct)
                                            });

                                            if (productCategory == 'RING' && giftsForHerAmazonless.length < 20 && !currentProduct.imagesrc.includes('amazon')) {
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
                                    } else if (productCategory == 'TRAVEL BAG' || productCategory == 'BAG') {
                                        travelBagsAndOtherBagsWomen.push({

                                            "type": "image",
                                            "title": currentProductTitle,
                                            "src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
                                            'description': currentProduct.price,
                                            'link': currentProduct.productcategory,
                                            'slug': String(indexOfCurrentProduct)
                                        })

                                        // populating Amazonless
                                        if (!currentProduct.imagesrc.includes('amazon')) {

                                            travelBagsAndOtherBagsWomenAmazonless.push({

                                                "type": "image",
                                                "title": currentProductTitle,
                                                "src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
                                                'description': currentProduct.price,
                                                'link': currentProduct.productcategory,
                                                'slug': String(indexOfCurrentProduct)
                                            });

                                        }
                                    } else if (productCategory == 'ACCESSORIES') {

                                        otherAccessoriesWomen.push({

                                            "type": "image",
                                            "title": currentProductTitle,
                                            "src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
                                            'description': currentProduct.price,
                                            'link': currentProduct.productcategory,
                                            'slug': String(indexOfCurrentProduct)
                                        });

                                        // populating Amazonless
                                        if (!currentProduct.imagesrc.includes('amazon')) {

                                            otherAccessoriesWomenAmazonless.push({

                                                "type": "image",
                                                "title": currentProductTitle,
                                                "src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
                                                'description': currentProduct.price,
                                                'link': currentProduct.productcategory,
                                                'slug': String(indexOfCurrentProduct)
                                            });

                                        }
                                    } else if (productCategory == 'LUXURY TECH') {

                                        luxuryTechWomen.push({

                                            "type": "image",
                                            "title": currentProductTitle,
                                            "src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
                                            'description': currentProduct.price,
                                            'link': currentProduct.productcategory,
                                            'slug': String(indexOfCurrentProduct)
                                        });

                                        // populating Amazonless
                                        if (!currentProduct.imagesrc.includes('amazon')) {

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
                                if (currentProduct.gender == 'MEN') {

                                    // var isDisplayMensShoes = isItemsInList(availableProductCategoriesForMen, ['SHOE', 'WATCH', 'WATCHES']);
                                    // var isDisplayMensNecklaces = isItemsInList(availableProductCategoriesForMen, ['NECKLACE', 'BRACELET']);
                                    // var isDisplayFurnituresForMen = isItemsInList(availableProductCategoriesForMen, ['FURNITURE']);
                                    // var isDisplayMensClothes = isItemsInList(availableProductCategoriesForMen, ['CLOTHING', 'PERFUME']);
                                    // var isDisplayMensRings = isItemsInList(availableProductCategoriesForMen, ['FLOWER', 'RING']);
                                    // var isDisplayMensTravelBagsAndOtherBags = isItemsInList(availableProductCategoriesForMen, ['TRAVEL BAG', 'BAG']);
                                    // var isDisplayOtherAccessoriesForMen = isItemsInList(availableProductCategoriesForMen, ['ACCESSORIES']);
                                    // var isDisplayGiftsForHer = isItemsInList(availableProductCategoriesForWomen, ['FLOWER', 'RING', 'NECKLACE', ]);

                                    if (productCategory == 'SHOE' || productCategory == 'WATCH' || productCategory == 'WATCHES') {
                                        shoesAndWatchesMen.push({

                                            "type": "image",
                                            "title": currentProductTitle,
                                            "src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
                                            'description': currentProduct.price,
                                            'link': currentProduct.productcategory,
                                            'slug': String(indexOfCurrentProduct)
                                        });

                                        if ((productCategory == 'WATCH' || productCategory == 'WATCHES') && giftsForHim.length < 20) {
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
                                        if (!currentProduct.imagesrc.includes('amazon')) {

                                            shoesAndWatchesMenAmazonless.push({

                                                "type": "image",
                                                "title": currentProductTitle,
                                                "src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
                                                'description': currentProduct.price,
                                                'link': currentProduct.productcategory,
                                                'slug': String(indexOfCurrentProduct)
                                            });

                                            if ((productCategory == 'WATCH' || productCategory == 'WATCHES') && giftsForHimAmazonless.length < 20 && !currentProduct.imagesrc.includes('amazon')) {

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

                                    } else if (productCategory == 'NECKLACE' || productCategory == 'BRACELET') {

                                        necklacesAndBraceletsMen.push({

                                            "type": "image",
                                            "title": currentProductTitle,
                                            "src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
                                            'description': currentProduct.price,
                                            'link': currentProduct.productcategory,
                                            'slug': String(indexOfCurrentProduct)
                                        });

                                        if (!currentProduct.imagesrc.includes('amazon')) {

                                            necklacesAndBraceletsMenAmazonless.push({

                                                "type": "image",
                                                "title": currentProductTitle,
                                                "src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
                                                'description': currentProduct.price,
                                                'link': currentProduct.productcategory,
                                                'slug': String(indexOfCurrentProduct)
                                            });

                                        }

                                    } else if (productCategory == 'FURNITURE') {

                                        if (isItemsInList(furnituresMenAndWomen, [{

                                                "type": "image",
                                                "title": currentProductTitle,
                                                "src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
                                                'description': currentProduct.price,
                                                'link': currentProduct.productcategory,
                                                'slug': String(indexOfCurrentProduct)
                                            }]) == false) {

                                            furnituresMenAndWomen.push({

                                                "type": "image",
                                                "title": currentProductTitle,
                                                "src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
                                                'description': currentProduct.price,
                                                'link': currentProduct.productcategory,
                                                'slug': String(indexOfCurrentProduct)
                                            });

                                        };

                                        if (!currentProduct.imagesrc.includes('amazon')) {

                                            if (isItemsInList(furnituresMenAndWomen, [{

                                                    "type": "image",
                                                    "title": currentProductTitle,
                                                    "src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
                                                    'description': currentProduct.price,
                                                    'link': currentProduct.productcategory,
                                                    'slug': String(indexOfCurrentProduct)
                                                }]) == false) {

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

                                    } else if (productCategory == 'CLOTHING' || productCategory == 'PERFUME') {

                                        clothesAndPerfumesMen.push({

                                            "type": "image",
                                            "title": currentProductTitle,
                                            "src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
                                            'description': currentProduct.price,
                                            'link': currentProduct.productcategory,
                                            'slug': String(indexOfCurrentProduct)
                                        });

                                        if (!currentProduct.imagesrc.includes('amazon')) {

                                            clothesAndPerfumesMenAmazonless.push({

                                                "type": "image",
                                                "title": currentProductTitle,
                                                "src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
                                                'description': currentProduct.price,
                                                'link': currentProduct.productcategory,
                                                'slug': String(indexOfCurrentProduct)
                                            });

                                        }

                                    } else if (productCategory == 'FLOWER' || productCategory == 'RING') {

                                        flowersAndRingsMen.push({

                                            "type": "image",
                                            "title": currentProductTitle,
                                            "src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
                                            'description': currentProduct.price,
                                            'link': currentProduct.productcategory,
                                            'slug': String(indexOfCurrentProduct)
                                        });

                                        if (giftsForHim.length < 20) {
                                            giftsForHim.push({

                                                "type": "image",
                                                "title": currentProductTitle,
                                                "src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
                                                'description': currentProduct.price,
                                                'link': currentProduct.productcategory,
                                                'slug': String(indexOfCurrentProduct)
                                            });
                                        }

                                        if (!currentProduct.imagesrc.includes('amazon')) {

                                            flowersAndRingsMenAmazonless.push({

                                                "type": "image",
                                                "title": currentProductTitle,
                                                "src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
                                                'description': currentProduct.price,
                                                'link': currentProduct.productcategory,
                                                'slug': String(indexOfCurrentProduct)
                                            });

                                            if (giftsForHimAmazonless.length < 20) {
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

                                    } else if (productCategory == 'TRAVEL BAG' || productCategory == 'BAG') {

                                        travelBagsAndOtherBagsMen.push({

                                            "type": "image",
                                            "title": currentProductTitle,
                                            "src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
                                            'description': currentProduct.price,
                                            'link': currentProduct.productcategory,
                                            'slug': String(indexOfCurrentProduct)
                                        });

                                        // populating amazonless
                                        if (!currentProduct.imagesrc.includes('amazon')) {

                                            travelBagsAndOtherBagsMenAmazonless.push({

                                                "type": "image",
                                                "title": currentProductTitle,
                                                "src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
                                                'description': currentProduct.price,
                                                'link': currentProduct.productcategory,
                                                'slug': String(indexOfCurrentProduct)
                                            });

                                        }

                                    } else if (productCategory == 'ACCESSORIES') {

                                        otherAccessoriesMen.push({

                                            "type": "image",
                                            "title": currentProductTitle,
                                            "src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
                                            'description': currentProduct.price,
                                            'link': currentProduct.productcategory,
                                            'slug': String(indexOfCurrentProduct)
                                        })

                                        // populating amazonless
                                        if (!currentProduct.imagesrc.includes('amazon')) {

                                            otherAccessoriesMenAmazonless.push({

                                                "type": "image",
                                                "title": currentProductTitle,
                                                "src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
                                                'description': currentProduct.price,
                                                'link': currentProduct.productcategory,
                                                'slug': String(indexOfCurrentProduct)
                                            });

                                        }

                                    } else if (productCategory == 'LUXURY TECH') {

                                        luxuryTechMen.push({

                                            "type": "image",
                                            "title": currentProductTitle,
                                            "src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
                                            'description': currentProduct.price,
                                            'link': currentProduct.productcategory,
                                            'slug': String(indexOfCurrentProduct)
                                        });

                                        // populating Amazonless
                                        if (!currentProduct.imagesrc.includes('amazon')) {

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
                                if (currentProduct.gender == 'WOMEN' && currentProduct.productcategory != 'CLOTHING' && recommendedForWomen.length < 10) {

                                    console.log('got here 4ci');

                                    // Ensuring that not more than one 'LUXURY TECH' product gets recommended.. e.g Fancy TVs..
                                    if (currentProduct.productcategory == 'LUXURY TECH' && numberOfLuxuryTechInRecommendedGalleryTracker == 0) {

                                        recommendedForWomen.push(

                                            {

                                                "type": "image",
                                                "title": currentProductTitle,
                                                "src": currentProduct.imagesrc, // "wix:image://v1/99bc1c6f66444769b531221214c885ac.jpeg/A%20View.jpeg#originWidth=3264&originHeight=2448",
                                                'description': currentProduct.price,
                                                'link': currentProduct.productcategory,
                                                'slug': String(indexOfCurrentProduct)
                                            });
                                    } else if (currentProduct.productcategory != 'LUXURY TECH') {

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
                                        (currentProduct.gender == 'WOMEN' && currentProduct.productcategory == 'SHOE')) {
                                        ladiesShoesAndBagsIncludedTracker.push(currentProduct.productcategory);

                                        if (currentProduct.productcategory == 'SHOE') {
                                            // womensFeaturableShoesList.pop(currentProduct);
                                            // console.log('');
                                            // console.log('removed from copy: ' + womensFeaturableShoesListCopy[0].title + ', ' + womensFeaturableShoesListCopy[0].gender);
                                            womensFeaturableShoesListCopy.splice(0, 1);
                                            // console.log('womensFeaturableShoesList after item removal: ' + womensFeaturableShoesList.length);
                                        } else if (currentProduct.productcategory == 'HANDBAG') {
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


            // -----------------------------------------------------------------------------------------------------------------------------------

            // configuring the gallery to display using the current url string..
            $w('#itemsGallerySelectionDropDown').options = [

                { "label": "Women's Gallery", "value": "Women's Gallery" },

                { "label": "Men's Gallery", "value": "Men's Gallery" },

                // {"label": "All Galleries", "value":  "All Galleries"}

            ];

            var currentUrl = wixLocation.url;
            var indexOfHashSymbolInUrl = currentUrl.indexOf('#');
            var stringsAfterHashSymbol = (currentUrl.substring(indexOfHashSymbolInUrl + 1, currentUrl.length - 1)).toLowerCase();

            if (stringsAfterHashSymbol.includes('women-gallery-match-items')) {

                $w('#itemsGallerySelectionDropDown').selectedIndex = 0;

            } else if (stringsAfterHashSymbol.includes('men-gallery-match-items') && !stringsAfterHashSymbol.includes('women-gallery-match-items')) {

                $w('#itemsGallerySelectionDropDown').selectedIndex = 1;

            } else if (stringsAfterHashSymbol.includes('all-galleries-match-items')) {

                $w('#itemsGallerySelectionDropDown').selectedIndex = 0;

            } else {

                $w('#itemsGallerySelectionDropDown').selectedIndex = 0;

            }

            // CONFIGURING THE FILTERS AND CONTENTS OF THE MAIN GALLERY
            // 1.a Product Category Filter For Women
            var listOfProductCategoryForWomen = []; // useful for dropdown category selection

            //
            // var listOfAllProductCategoryForWomen = []; // useful for calculating

            // var listOfProductCategoryForWomen = [
            // 	{"label": "Shoe", "value": "Shoe"},
            // 	{"label": "Designer Bag", "value": "Designer Bag"},
            // 	{"label": "Furnitures", "value": "Furnitures"},
            // 	{"label": "Clothes And Perfumes", "value": "Clothes And Perfumes"},
            // 	{"label": "Ring", "value": "Ring"}, // Flowers & Rings
            // 	{"label": "Travel Bag", "value": "Travel Bag"},
            // 	{"label": "Other Accessories", "value": "Other Accessories"},
            // 	{"label": "Gifts For Him", "value": "Gifts For Him"}
            // ];

            console.log('got here 7');

            // console.log('availableProductCategoriesForWomen: ' + availableProductCategoriesForWomen);
            var isDisplayShoes = isItemsInList(availableProductCategoriesForWomen, ['SHOE']); // 'SANDALS'
            var isDisplayNecklace = isItemsInList(availableProductCategoriesForWomen, ['NECKLACE']);
            var isDisplayEarring = isItemsInList(availableProductCategoriesForWomen, ['EARRING']);

            // console.log('isDisplayShoes: ' + isDisplayShoes);
            var isDisplayWomensHandbags = isItemsInList(availableProductCategoriesForWomen, ['HANDBAG']); // 'BAG'
            var isDisplayWomensBracelets = isItemsInList(availableProductCategoriesForWomen, ['BRACELET']);
            var isDisplayWomensWatches = isItemsInList(availableProductCategoriesForWomen, ['WATCH', 'WATCHES']);

            // console.log('isDisplayWomensHandbags: ' + isDisplayWomensHandbags);

            // var isDisplayFurnituresForWomen = isItemsInList(availableProductCategoriesForWomen, ['FURNITURE']);
            // var isDisplayLuxuryTechForWomen = isItemsInList(availableProductCategoriesForWomen, ['LUXURY TECH']);

            // console.log('isDisplayFurnitures: ' + isDisplayFurnitures);
            var isDisplayWomensClothes = isItemsInList(availableProductCategoriesForWomen, ['CLOTHING']);
            var isDisplayWomensPerfumes = isItemsInList(availableProductCategoriesForWomen, ['PERFUME']);

            var isDisplayWomensRings = isItemsInList(availableProductCategoriesForWomen, ['RING']);
            var isDisplayTravelBags = isItemsInList(availableProductCategoriesForWomen, ['TRAVEL BAG']);
            // var isDisplayOtherAccessoriesForWomen = isItemsInList(availableProductCategoriesForWomen, ['ACCESSORIES']);
            // var isDisplayGiftsForHim = isItemsInList(availableProductCategoriesForMen, ['FLOWER', 'RING', 'WATCH', 'WATCHES']);

            // if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
            // 	listOfProductCategoryForWomen.push({"label": "Recommended", "value": "Recommended"});
            // }

            if (isDisplayWomensHandbags) {
                listOfProductCategoryForWomen.push({ "label": "Designer Bag", "value": "Handbag" });
            }

            if (isDisplayTravelBags) {
                listOfProductCategoryForWomen.push({ "label": "Travel Bag", "value": "Travel Bag" });
            }

            if (isDisplayShoes) {
                listOfProductCategoryForWomen.push({ "label": "Shoe", "value": "Shoe" }); // Shoes & Jewelleries
            }

            if (isDisplayNecklace) {
                listOfProductCategoryForWomen.push({ "label": "Necklace", "value": "Necklace" }); // Shoes & Jewelleries
            }

            if (isDisplayWomensBracelets) {
                listOfProductCategoryForWomen.push({ "label": "Bracelet", "value": "Bracelet" }); // Shoes & Jewelleries
            }

            if (isDisplayWomensWatches) {
                listOfProductCategoryForWomen.push({ "label": "Watch", "value": "Watch" }); // Shoes & Jewelleries
            }

            if (isDisplayEarring) {
                listOfProductCategoryForWomen.push({ "label": "Earring", "value": "Earring" }); // Shoes & Jewelleries
            }

            if (isDisplayWomensClothes) {
                listOfProductCategoryForWomen.push({ "label": "Clothing", "value": "Clothing" }); // Clothes & Perfumes
            }

            if (isDisplayWomensPerfumes) {
                listOfProductCategoryForWomen.push({ "label": "Perfume", "value": "Perfume" }); // Clothes & Perfumes
            }

            if (isDisplayWomensRings) {
                listOfProductCategoryForWomen.push({ "label": "Ring", "value": "Ring" }); // Flowers & Rings
            }

            // if (isDisplayOtherAccessoriesForWomen){
            // 	listOfProductCategoryForWomen.push({"label": "Other Accessories", "value": "Other Accessories"});
            // }
            //
            // if (isDisplayGiftsForHim){
            // 	listOfProductCategoryForWomen.push({"label": "Gifts For Him", "value": "Gifts For Him"});
            // }

            // 1.b Product Category Filter For Men
            var listOfProductCategoryForMen = [];

            console.log('got here 8');

            // var listOfProductCategoryForMen = [
            // 	{"label": "Shoe", "value": "Shoe"},
            // 	{"label": "Necklace", "value": "Necklace"},
            // 	{"label": "Furnitures", "value": "Furnitures"},
            // 	{"label": "Clothing", "value": "Clothing"},
            // 	{"label": "Ring", "value": "Ring"},
            // 	{"label": "Travel Bag", "value": "Travel Bag"},
            // 	{"label": "Other Accessories", "value": "Other Accessories"},
            // 	{"label": "Gifts For Her", "value": "Gifts For Her"}
            // ];

            var isDisplayMensShoes = isItemsInList(availableProductCategoriesForMen, ['SHOE']);
            var isDisplayMensWatches = isItemsInList(availableProductCategoriesForMen, ['WATCH', 'WATCHES']);
            var isDisplayMensNecklaces = isItemsInList(availableProductCategoriesForMen, ['NECKLACE']);
            var isDisplayMensBRACELET = isItemsInList(availableProductCategoriesForMen, ['BRACELET']);

            var isDisplayMensClothes = isItemsInList(availableProductCategoriesForMen, ['CLOTHING']);
            var isDisplayMensPerfumes = isItemsInList(availableProductCategoriesForMen, ['PERFUME']);

            var isDisplayMensRings = isItemsInList(availableProductCategoriesForMen, ['RING']);
            var isDisplayMensTravelBagsAndOtherBags = isItemsInList(availableProductCategoriesForMen, ['TRAVEL BAG']); // 'BAG'
            var isDisplayOtherAccessoriesForMen = isItemsInList(availableProductCategoriesForMen, ['ACCESSORIES']);
            var isDisplayGiftsForHer = isItemsInList(availableProductCategoriesForWomen, ['FLOWER', 'RING', 'EARRING', 'NECKLACE', ]);

            if (isDisplayMensWatches) {
                listOfProductCategoryForMen.push({ "label": "Watch", "value": "Watch" });
            }

            if (isDisplayMensShoes) {
                listOfProductCategoryForMen.push({ "label": "Shoe", "value": "Shoe" });
            }

            if (isDisplayMensNecklaces) {
                listOfProductCategoryForMen.push({ "label": "Necklace", "value": "Necklace" });
            }

            if (isDisplayMensBRACELET) {
                listOfProductCategoryForMen.push({ "label": "Bracelet", "value": "Bracelet" });
            }

            if (isDisplayMensClothes) {
                listOfProductCategoryForMen.push({ "label": "Clothing", "value": "Clothing" }); // Clothes & Perfumes
            }

            if (isDisplayMensPerfumes) {
                listOfProductCategoryForMen.push({ "label": "Perfume", "value": "Perfume" });
            }

            if (isDisplayMensRings) {
                listOfProductCategoryForMen.push({ "label": "Ring", "value": "Ring" }); // Flowers & Rings
            }

            if (isDisplayMensTravelBagsAndOtherBags) {
                listOfProductCategoryForMen.push({ "label": "Travel Bag", "value": "Travel Bag" });
            }

            // if (isDisplayOtherAccessoriesForMen){
            // 	listOfProductCategoryForMen.push({"label": "Other Accessories", "value": "Other Accessories"});
            // }
            //
            //
            // if (isDisplayGiftsForHer){
            // 	listOfProductCategoryForMen.push({"label": "Gifts For Her", "value": "Gifts For Her"});
            // }

            // SETTING LEFT AND RIGHT RELEVANT (MALE OR FEMALE) PRODUCT CATEGORIES
            var currentGalleryIndex = $w('#itemsGallerySelectionDropDown').selectedIndex

            var leftProductsListOfCategories = JSON.parse(JSON.stringify(listOfProductCategoryForWomen));
            var rightProductsListOfCategories = JSON.parse(JSON.stringify(listOfProductCategoryForWomen));

            if (currentGalleryIndex == 0) {

                var leftProductsListOfCategories = JSON.parse(JSON.stringify(listOfProductCategoryForWomen));
                var rightProductsListOfCategories = JSON.parse(JSON.stringify(listOfProductCategoryForWomen));

            }

            if (currentGalleryIndex == 1) {

                var leftProductsListOfCategories = JSON.parse(JSON.stringify(listOfProductCategoryForMen));
                var rightProductsListOfCategories = JSON.parse(JSON.stringify(listOfProductCategoryForMen));

            }

            if (currentGalleryIndex == 2) {

                var allAvailableWomenAndMenProductCategory = new Set(listOfProductCategoryForMen.concat(listOfProductCategoryForWomen));

                var leftProductsListOfCategories = JSON.parse(JSON.stringify(allAvailableWomenAndMenProductCategory));
                var rightProductsListOfCategories = JSON.parse(JSON.stringify(allAvailableWomenAndMenProductCategory));

            }

            // initial left and right, or singular product's category

            // var initialLeftProductsCategory = leftProductsListOfCategories[0];
            var indexOfInitialLeftProductsCategory = 0;

            // var rightProductsListOfCategoriesCopy = JSON.parse(JSON.stringify(rightProductsListOfCategories));
            // rightProductsListOfCategoriesCopy.splice(indexOfInitialLeftProductsCategory, 1);

            // var initialRightProductsCategory = rightProductsListOfCategories[0];
            var indexOfInitialRightProductsCategory = 1;

            var leftProductsListOfCategoriesLeftAdded = [];
            var rightProductsListOfCategoriesRightAdded = [];

            for (var index in leftProductsListOfCategories) {

                var currentCategory = JSON.parse(JSON.stringify(leftProductsListOfCategories[Number(index)]));
                currentCategory.label = currentCategory.label + ' - left';

                leftProductsListOfCategoriesLeftAdded.push(currentCategory)

            }

            for (var index in rightProductsListOfCategories) {

                var currentCategory = JSON.parse(JSON.stringify(rightProductsListOfCategories[Number(index)]));
                currentCategory.label = currentCategory.label + ' - right';

                rightProductsListOfCategoriesRightAdded.push(currentCategory);

            }

            // configuring the initial left and right items dropdown menu
            $w('#leftProductsCategoryDropDown').options = leftProductsListOfCategoriesLeftAdded;
            $w('#leftProductsCategoryDropDown').selectedIndex = indexOfInitialLeftProductsCategory;

            $w('#rightProductsCategoryDropDown').options = rightProductsListOfCategoriesRightAdded;
            $w('#rightProductsCategoryDropDown').selectedIndex = indexOfInitialRightProductsCategory;

            $w('#singularItemsCategoryDropDown').options = JSON.parse(JSON.stringify(leftProductsListOfCategories));
            $w('#singularItemsCategoryDropDown').selectedIndex = 0;

            // Determining whether or not singular items category dropdown menu should be displayed upon initail page load..
            var viewingOptionsDropDownSelectionIndex = $w('#viewingOptionsDropDown').selectedIndex;

            if (viewingOptionsDropDownSelectionIndex != 0) {

                $w('#leftProductsCategoryDropDown').hide();
                $w('#rightProductsCategoryDropDown').hide();

                $w('#singularItemsCategoryDropDown').show();

            } else if (viewingOptionsDropDownSelectionIndex == 0) {

                $w('#leftProductsCategoryDropDown').show();
                $w('#rightProductsCategoryDropDown').show();
                $w('#singularItemsCategoryDropDown').hide();

            }

            // var leftProductsCategoryDropDownSelection = $w('#leftProductsCategoryDropDown').value;
            // var rightProductsCategoryDropDownSelection = $w('#rightProductsCategoryDropDown').selectedIndex;

            // adapt gallery to current (gender) selection
            $w('#itemsGallerySelectionDropDown').onChange((event) => {

                var currentGalleryIndex = $w('#itemsGallerySelectionDropDown').selectedIndex;

                var leftProductsListOfCategories = JSON.parse(JSON.stringify(listOfProductCategoryForWomen));
                var rightProductsListOfCategories = JSON.parse(JSON.stringify(listOfProductCategoryForWomen));

                if (currentGalleryIndex == 0) {

                    console.log('Gallery 0');

                    leftProductsListOfCategories = JSON.parse(JSON.stringify(listOfProductCategoryForWomen));
                    rightProductsListOfCategories = JSON.parse(JSON.stringify(listOfProductCategoryForWomen));

                }

                if (currentGalleryIndex == 1) {

                    console.log('Gallery 1');

                    leftProductsListOfCategories = JSON.parse(JSON.stringify(listOfProductCategoryForMen));
                    rightProductsListOfCategories = JSON.parse(JSON.stringify(listOfProductCategoryForMen));

                }

                if (currentGalleryIndex == 2) {

                    console.log('Gallery 2');

                    var allAvailableWomenAndMenProductCategory = listOfProductCategoryForMen.concat(listOfProductCategoryForWomen);
                    var allAvailableWomenAndMenProductCategorySet = [];

                    for (let index in allAvailableWomenAndMenProductCategory) {

                        var currentCategory = allAvailableWomenAndMenProductCategory[Number(index)];

                        var isCurrentCategoryInAllAvailableWomenAndMenProductCategorySet = allAvailableWomenAndMenProductCategorySet.filter(
                            (item) => {

                                // console.log(item.label + '==' + currentCategory.label + ': ', item.label == currentCategory.label);

                                return item.label == currentCategory.label;

                            }
                        ).length > 0;

                        // console.log('isCurrentCategoryInAllAvailableWomenAndMenProductCategorySet: ' + isCurrentCategoryInAllAvailableWomenAndMenProductCategorySet);

                        if (isCurrentCategoryInAllAvailableWomenAndMenProductCategorySet == false) {

                            allAvailableWomenAndMenProductCategorySet.push(currentCategory);

                        }
                    }

                    leftProductsListOfCategories = JSON.parse(JSON.stringify(allAvailableWomenAndMenProductCategorySet));
                    rightProductsListOfCategories = JSON.parse(JSON.stringify(allAvailableWomenAndMenProductCategorySet));

                    console.log('leftProductsListOfCategories: ' + leftProductsListOfCategories[0]);
                    console.log('rightProductsListOfCategories: ' + rightProductsListOfCategories[0]);

                }

                // initial left and right, or singular product's category

                // var initialLeftProductsCategory = leftProductsListOfCategories[0];
                var indexOfInitialLeftProductsCategory = 0;

                // var rightProductsListOfCategoriesCopy = JSON.parse(JSON.stringify(rightProductsListOfCategories));
                // rightProductsListOfCategoriesCopy.splice(indexOfInitialLeftProductsCategory, 1);

                // var initialRightProductsCategory = rightProductsListOfCategories[0];
                var indexOfInitialRightProductsCategory = 1;

                var leftProductsListOfCategoriesLeftAdded = [];
                var rightProductsListOfCategoriesRightAdded = [];

                for (var index in leftProductsListOfCategories) {

                    var currentCategory = JSON.parse(JSON.stringify(leftProductsListOfCategories[Number(index)]));
                    currentCategory.label = currentCategory.label + ' - left';

                    leftProductsListOfCategoriesLeftAdded.push(currentCategory)

                }

                for (var index in rightProductsListOfCategories) {

                    var currentCategory = JSON.parse(JSON.stringify(rightProductsListOfCategories[Number(index)]));
                    currentCategory.label = currentCategory.label + ' - right';

                    rightProductsListOfCategoriesRightAdded.push(currentCategory)

                }

                // configuring the initial left and right items dropdown menu
                $w('#leftProductsCategoryDropDown').options = leftProductsListOfCategoriesLeftAdded;
                $w('#leftProductsCategoryDropDown').selectedIndex = indexOfInitialLeftProductsCategory;

                $w('#rightProductsCategoryDropDown').options = rightProductsListOfCategoriesRightAdded;
                $w('#rightProductsCategoryDropDown').selectedIndex = indexOfInitialRightProductsCategory;

                $w('#singularItemsCategoryDropDown').options = JSON.parse(JSON.stringify(leftProductsListOfCategories));
                $w('#singularItemsCategoryDropDown').selectedIndex = 0;

                generateNewPair(
                    false, // isRightProductsCategoryDropDownChanged
                    false, // isLeftProductsCategoryDropDownChanged
                    false, // isGenerateNewRightItemClicked
                    false, // isGenerateNewLeftItemClicked,
                    true // isOriginalUserRun
                );

            });

            // What happens when either the left or right item's category changes
            // remove the selected option from the opposite dropdown
            // i.e if an option is selected in the left item's category dropdown, delete it from the right item's category dropdown and vice versa..
            var leftOrRightItemsCategoryDropDownChangetracker = 0;

            // $w('#leftProductsCategoryDropDown').onChange((event) => {
            //
            // 	// determining the seletected item in the left item's category dropdown
            // 	var currentLeftProductsCategorySelection = $w('#leftProductsCategoryDropDown').value;
            // 	// var indexOfCurrentLeftProductsCategorySelection = leftProductsListOfCategories.indexOf(currentLeftProductsCategorySelection);
            // 	var indexOfCurrentLeftProductsCategorySelection = $w('#leftProductsCategoryDropDown').selectedIndex;
            //
            //
            // 	console.log('indexOfCurrentLeftProductsCategorySelection ' + indexOfCurrentLeftProductsCategorySelection);
            //
            // 	// deleting the seletected item in the left item's category dropdown from the right item's category dropdown
            // 	var rightProductsCategoryDropDownSelectedIndex = $w('#rightProductsCategoryDropDown').selectedIndex;
            //
            // 	var rightProductsListOfCategoriesCopy = JSON.parse(JSON.stringify(rightProductsListOfCategories));
            // 	// rightProductsListOfCategoriesCopy.splice(indexOfCurrentLeftProductsCategorySelection, 1); /////////////////////////////
            // 	$w('#rightProductsCategoryDropDown').options = rightProductsListOfCategoriesCopy;
            //
            // 	console.log('leftProductsCategoryDropDown, ' + indexOfCurrentLeftProductsCategorySelection);
            //
            // 	// if (rightProductsCategoryDropDownSelectedIndex >= rightProductsListOfCategories.length){
            // 	//
            // 	// 	$w('#rightProductsCategoryDropDown').selectedIndex = 0;
            // 	//
            // 	// }
            //
            // });

            // $w('#rightProductsCategoryDropDown').onChange((event) => {
            //
            // 	// determining the seletected item in the left item's category dropdown
            // 	var currentRightProductsCategorySelection = $w('#rightProductsCategoryDropDown').value;
            // 	// var indexOfCurrentRightProductsCategorySelection = rightProductsListOfCategories.indexOf(currentRightProductsCategorySelection);
            // 	var indexOfCurrentRightProductsCategorySelection = $w('#rightProductsCategoryDropDown').selectedIndex;
            //
            // 	// deleting the seletected item in the left item's category dropdown from the right item's category dropdown
            // 	var leftProductsCategoryDropDownSelectedIndex = $w('#leftProductsCategoryDropDown').selectedIndex;
            //
            // 	var leftProductsListOfCategoriesCopy = JSON.parse(JSON.stringify(leftProductsListOfCategories));
            // 	// leftProductsListOfCategoriesCopy.splice(indexOfCurrentRightProductsCategorySelection, 1); /////////////////////////////
            // 	$w('#leftProductsCategoryDropDown').options = leftProductsListOfCategoriesCopy;
            //
            // 	console.log('rightProductsCategoryDropDown Changed, ' + indexOfCurrentRightProductsCategorySelection);
            //
            // 	// if (leftProductsCategoryDropDownSelectedIndex >= leftProductsListOfCategories.length){
            // 	//
            // 	// 	$w('#rightProductsCategoryDropDown').selectedIndex = 0;
            // 	//
            // 	// }
            //
            // });

            // hiding or showing singular product's category depending on view option in viewingOptionsDropDropdown
            $w('#viewingOptionsDropDown').onChange((event) => {

                // hiding or showing singular product's category depending on view option in viewingOptionsDropDropdown
                var viewingOptionsDropDownSelectionIndex = $w('#viewingOptionsDropDown').selectedIndex;

                if (viewingOptionsDropDownSelectionIndex != 0) {

                    $w('#leftProductsCategoryDropDown').hide();
                    $w('#rightProductsCategoryDropDown').hide();
                    $w('#singularItemsCategoryDropDown').show();

                } else if (viewingOptionsDropDownSelectionIndex == 0) {

                    $w('#leftProductsCategoryDropDown').show();
                    $w('#rightProductsCategoryDropDown').show();
                    $w('#singularItemsCategoryDropDown').hide();

                }

            });

            // disable refresh current pair and update generateNewPairButton's label when left dropdown value changes
            $w('#leftProductsCategoryDropDown').onChange((event) => {

                // var leftProductsCategory = ($w('#leftProductsCategoryDropDown').value);

                // if (leftProductsCategory.includes('HANDBAG')){
                // 	leftProductsCategory = 'BAG'
                // }
                // if (leftProductsCategory.includes('CLOTHING')){
                // 	leftProductsCategory = 'CLOTH'
                // }

                // leftProductsCategory = leftProductsCategory[0] + leftProductsCategory.substring(1, leftProductsCategory.length).toLowerCase();

                // $w('#refreshCurrentPairButton').disable();

                // $w('#generateNewPairButton').label = 'Generate New ' + leftProductsCategory;

                // generate a new pair according to the left and right dropdown menu configuration whilst
                // shuffling the:
                // a. list of left items &&
                // b. list of items that match the left item
                // to ensure that the user sees a new matching right item for each new left item that will be displayed
                generateNewPair(
                    false, // isRightProductsCategoryDropDownChanged
                    true, // isLeftProductsCategoryDropDownChanged
                    false, // isGenerateNewRightItemClicked
                    false, // isGenerateNewLeftItemClicked,
                    true // isOriginalUserRun
                );

            });

            // SETTING THE INITIAL VALUE OF THE refreshCurrentPairButton AND GENERATING MATCHING ITEMS FOR THE FIRST TIME..
            var rightProductsCategory = $w('#rightProductsCategoryDropDown').value;

            if ((rightProductsCategory.toLowerCase()).includes('handbag')) {
                rightProductsCategory = 'Bag'
            }
            if (rightProductsCategory.includes('CLOTHING')) {
                rightProductsCategory = 'Cloth'
            }

            // rightProductsCategory = rightProductsCategory[0] + rightProductsCategory.substring(1, rightProductsCategory.length).toLowerCase();

            $w('#refreshCurrentPairButton').label = 'Show New ' + rightProductsCategory + ' - Right';

            // generate a new pair according to the left and right dropdown menu configuration ?whilst
            // shuffling the list of items that match the left item to ensure that the user sees
            // a new item combination each time the right dropdown menu changes
            generateNewPair(
                false, // isRightProductsCategoryDropDownChanged
                false, // isLeftProductsCategoryDropDownChanged
                false, // isGenerateNewRightItemClicked
                false, // isGenerateNewLeftItemClicked,
                true // isOriginalUserRun
            );

            // UPDATE refreshCurrentPairButton's LABEL WHEN RIGHT DROPDOWN VALUE CHANGES..
            // Also Generate a new pair accordingly..
            $w('#rightProductsCategoryDropDown').onChange((event) => {

                var rightProductsCategory = $w('#rightProductsCategoryDropDown').value;

                if ((rightProductsCategory.toLowerCase()).includes('handbag')) {
                    rightProductsCategory = 'Bag'
                }
                if (rightProductsCategory.includes('CLOTHING')) {
                    rightProductsCategory = 'Cloth'
                }

                rightProductsCategory = rightProductsCategory[0] + rightProductsCategory.substring(1, rightProductsCategory.length).toLowerCase();

                $w('#refreshCurrentPairButton').label = 'Show New ' + rightProductsCategory + ' - Right';

                // generate a new pair according to the left and right dropdown menu configuration whilst
                // shuffling the list of items that match the left item to ensure that the user sees
                // a new item combination each time the right dropdown menu changes
                generateNewPair(
                    true, // isRightProductsCategoryDropDownChanged
                    false, // isLeftProductsCategoryDropDownChanged
                    false, // isGenerateNewRightItemClicked
                    false, // isGenerateNewLeftItemClicked,
                    true // isOriginalUserRun
                );

            });

            console.log('got here 10');

            // ENGINE TO GENERATE NEW ITEM PAIRS
            $w('#generateNewPairButton').onClick((event) => {

                generateNewPair(
                    false, // isRightProductsCategoryDropDownChanged
                    false, // isLeftProductsCategoryDropDownChanged
                    false, // isGenerateNewRightItemClicked
                    true, // isGenerateNewLeftItemClicked
                    true // isOriginalUserRun
                );

                $w('#refreshCurrentPairButton').enable();
            });

            // When 'Show New Right Item' is clicked..
            $w('#refreshCurrentPairButton').onClick((event) => {

                var rightProductsCategory = $w('#rightProductsCategoryDropDown').value;

                if ((rightProductsCategory.toLowerCase()).includes('handbag')) {
                    rightProductsCategory = 'Bag'
                }
                if (rightProductsCategory.includes('CLOTHING')) {
                    rightProductsCategory = 'Cloth'
                }

                rightProductsCategory = rightProductsCategory[0] + rightProductsCategory.substring(1, rightProductsCategory.length).toLowerCase();

                $w('#refreshCurrentPairButton').label = 'Show New ' + rightProductsCategory + ' - Right';

                generateNewPair(
                    false, // isRightProductsCategoryDropDownChanged
                    false, // isLeftProductsCategoryDropDownChanged
                    true, // isGenerateNewRightItemClicked
                    false, // isGenerateNewLeftItemClicked,
                    true // isOriginalUserRun
                );

            });

            $w('#showPreviouslyGeneratedPair').onClick((event) => {

                generateNewPair(
                    false, // isRightProductsCategoryDropDownChanged
                    false, // isLeftProductsCategoryDropDownChanged
                    false, // isGenerateNewRightItemClicked
                    false, // isGenerateNewLeftItemClicked,
                    true, // isOriginalUserRun,
                    true // isBackButtonClicked
                );

            });

        }

    } else {

        return Promise.reject("Visitor's location fetch operation error!");

    }

}

// map of items that match the left items category.
// format: {"[usersPreferredGender][leftProductsCategory]": {list of items that match the left item's category (s)}}
var mapOfAllProductsThatMatchLeftItemsCategory = {};

// map of already displayed left and right items.. to ensure proper workings of the refreshCurrentPair and generateNewPair Buttons..
// format: {
//		"[usersPreferredGender][leftItemsCategory][rightItemsCategory]" : {
//			baseProductLinkId: {  // 'baseProductLinkId' denotes the left item
//				isMatchExists: trueOrFalse, // a right item (match) tracker to prevent the relevant (searcher) loop from going in circles or into an infinite loop
//				listOfAlreadyDisplayedRightItemsThatMatchLefItemCategory: [] // list of already viewed right items that match the current left item's category
//			}
//		}
// }
var mapOfAlreadyDisplayedItems = {};
// a copy of the above variable to repopulate it where the 'Back' (showPreviouslyGeneratedPair) operation is initiated by a user or in progress but
// mapOfAlreadyDisplayedItems is empty..
var mapOfAlreadyDisplayedItemsCopy = {};
// list to signify whether a copy of already displayed items (all) for the current product match configuration has been saved
var isMapOfAlreadyDisplayedItemsCopySavedForTheProductMatchConfigurationSavedList = [];

// map of already displayed left items
var mapOfAlreadyDisplayedLeftItems = {};
var mapOfAlreadyDisplayedLeftItemsCopy = {};

// product data of last displayed left item..
var lastDisplayedLeftItem = '';
// indicator variable to signify whether or not the generateNewPairButton has been clicked (or reset) by a user
// to ensure that newly generated item pairs are displayed properly when the user news to shuffle them
var isSpecificLeftItemTargetOn = false;

//
var lastLeftAndRightItemsCategoryConfiguration = '';

// variable to track whether an execution of generateNewPair function is its first run
// var generateNewPairRunCounter = 0;

// variable to indicate whether a product match configuration is being dispalyed for the first time or has already been displayed
var isCurrentProductMatchConfigurationPreviouslyBeenDefinedAndDisplayed = false;

function generateNewPair(
    isRightProductsCategoryDropDownChanged = false, // signifies that the right item or product's dropdown menu's value has changed
    isLeftProductsCategoryDropDownChanged = false, // signifies that the left item or product's dropdown menu's value has changed
    isGenerateNewRightItemClicked = false, // signifies that the user wants a new right item or product to be generated
    isGenerateNewLeftItemClicked = false, // signifies that the user wantes a new left and right item or product pair to be generated
    isOriginalUserRun = false, // signifies whether or not the function is being run organically when user interacts with UI,
    isBackButtonClicked = false // signifies whether the showPreviouslyGeneratedPair button has been clicked
) {

    // ensuring that the pair generation continues from the last generated left item where the left item's category changes..
    if (isLeftProductsCategoryDropDownChanged == true) {

        isGenerateNewLeftItemClicked = true;

    }

    // increment generateNewPairRunCounter for later identification of whether or not an execution of this function is its initial run
    // generateNewPairRunCounter += 1;

    // dropdown menus current selection index or value
    var viewingOptionsDropDownSelectionIndex = $w('#viewingOptionsDropDown').selectedIndex;
    var singularItemsCategory = ($w('#singularItemsCategoryDropDown').value).toUpperCase();
    var leftProductsCategory = ($w('#leftProductsCategoryDropDown').value).toUpperCase();
    var rightProductsCategory = ($w('#rightProductsCategoryDropDown').value).toUpperCase();
    var itemsGallerySelectionDropDownValue = ($w('#itemsGallerySelectionDropDown').value).toLowerCase();

    var currentLeftItemToDisplay = {};
    var currentRightItemToDisplay = {};
    var currentSingularLeftItemToDisplay = {};
    var currentSingularRightItemToDisplay = {};

    console.log('leftProductsCategory: ' + leftProductsCategory);
    console.log('rightProductsCategory: ' + rightProductsCategory);
    console.log('singularItemsCategory: ' + singularItemsCategory);
    console.log('itemsGallerySelectionDropDownValue: ' + itemsGallerySelectionDropDownValue);

    // defining current gender
    var usersPreferredGender = ''

    if (itemsGallerySelectionDropDownValue.includes('men') && !itemsGallerySelectionDropDownValue.includes('women')) {

        usersPreferredGender = 'MEN';
    } else if (itemsGallerySelectionDropDownValue.includes('women')) {

        usersPreferredGender = 'WOMEN';
    } else if (itemsGallerySelectionDropDownValue.includes('all')) {

        usersPreferredGender = 'ALL';

    }

    // if the current viewing option is 'Items that match', get the left and right item according
    // to the specified category and current gallery selection..
    if (viewingOptionsDropDownSelectionIndex == 0) {

        if (usersPreferredGender != 'ALL') {

            var isLeftItemAcquired = false;
            var isRightItemAcquired = false;

            // direct fetching since category will be present based on hard coding
            var productsThatMatchCurrentLeftItemCategory = totalProductsPerCategoryPerGenderCopy[usersPreferredGender][leftProductsCategory];

            // if the user selects the most current products match configuration 'again', exit generateNewPair function
            var currProductsMatchConfiguration = "[" + usersPreferredGender + "]" + "[" + leftProductsCategory + "]" + "[" + rightProductsCategory + "]";
            console.log('');
            console.log('currProductsMatchConfiguration: ' + currProductsMatchConfiguration);
            console.log('isLeftProductsCategoryDropDownChanged: ' + isLeftProductsCategoryDropDownChanged);
            console.log('isRightProductsCategoryDropDownChanged: ' + isRightProductsCategoryDropDownChanged);
            console.log('lastLeftAndRightItemsCategoryConfiguration: ' + lastLeftAndRightItemsCategoryConfiguration);
            console.log('');
            if ((isLeftProductsCategoryDropDownChanged == true || isRightProductsCategoryDropDownChanged == true) &&
                currProductsMatchConfiguration == lastLeftAndRightItemsCategoryConfiguration &&
                isOriginalUserRun == true) {

                console.log('cancelled ProductsMatchConfiguration reselection ');
                return;

            }

            // in the event that a user changes the value of the right or left item's category, reset lastDisplayedLeftItem and isSpecificLeftItemTargetOn
            // so that the initial left items can be processed and displayed; the event even at which the user can navigate backwards to previously generated
			// left items under the current products match configuration
            if (isRightProductsCategoryDropDownChanged == true &&
                !(currProductsMatchConfiguration == lastLeftAndRightItemsCategoryConfiguration)) { // || isLeftProductsCategoryDropDownChanged == true
                console.log('reset isSpecificLeftItemTargetOn');
                lastDisplayedLeftItem = '';
                isSpecificLeftItemTargetOn = false;

				// isGenerateNewLeftItemClicked = true;
            }

            // if the 'Back' | showPreviouslyGeneratedPair Button has been clicked and two or more left and right matching pair have been
            // generated and displayed, process a back operation.
            // Note that the first condition can only be true if at least two matching left and right pairs have been generated and displayed
            if ($w('#showPreviouslyGeneratedPair').enabled == true && isBackButtonClicked == true) {

                // check the current number of left items that's present in mapOfAlreadyDisplayedItems for the current products match configuration
                // to ascertain whether it's empty or not..
                var currentNumberOfRecordedDisplayedLeftItemsForTheCurrentProductsMatchConfigurationInmapOfAlreadyDisplayedItems =
                    mapOfAlreadyDisplayedItems[currProductsMatchConfiguration].size;

                console.log('');
                console.log('BEFORE FIRST DELETION');
				// determining and displaying the (number of) left items that have been displayed and are recorded in mapOfAlreadyDisplayedLeftItems
                for (var i in mapOfAlreadyDisplayedLeftItems[currProductsMatchConfiguration]) {
                    console.log(i + ' rem: ' + mapOfAlreadyDisplayedLeftItems[currProductsMatchConfiguration][Number(i)]);
                }
                console.log('');

                console.log('');
				// determining the number of left items that have been displayed and are recorded in mapOfAlreadyDisplayedItems
                var countMapOfAlreadyDisplayedItemsPerCurrentProductsMatchConfiguration = 0;
                for (var i in mapOfAlreadyDisplayedItems[currProductsMatchConfiguration]) {
                    countMapOfAlreadyDisplayedItemsPerCurrentProductsMatchConfiguration += 1;
                    console.log('rem: ' + i);
                }
                console.log('');

                console.log('size mapOfAlreadyDisplayedItems: ' +
                    countMapOfAlreadyDisplayedItemsPerCurrentProductsMatchConfiguration);

                // deleting the first of the last two displayed left items..
                // first check
                // if the list of already displayed left items within the mapOfAlreadyDisplayedItems per the current products match configuration is
                // equal to zero, populate  mapOfAlreadyDisplayedItems with mapOfAlreadyDisplayedItemsCopy
                if (countMapOfAlreadyDisplayedItemsPerCurrentProductsMatchConfiguration == 0) {

                    mapOfAlreadyDisplayedItems = mapOfAlreadyDisplayedItemsCopy;

                }

                var lengthOfAlreadyDisplayedLeftItems = mapOfAlreadyDisplayedLeftItems[currProductsMatchConfiguration].length;

                var lastDisplayedLeftItemPerTheCurrentProductsMatchConfiguration =
                    mapOfAlreadyDisplayedLeftItems[currProductsMatchConfiguration][lengthOfAlreadyDisplayedLeftItems - 1];

                // remove last displayed left item from mapOfAlreadyDisplayedItems and mapOfAlreadyDisplayedLeftItems
                delete mapOfAlreadyDisplayedItems[currProductsMatchConfiguration][lastDisplayedLeftItemPerTheCurrentProductsMatchConfiguration];
                mapOfAlreadyDisplayedLeftItems[currProductsMatchConfiguration].pop();

                console.log('');
                console.log('AFTER FIRST DELETION');
				// determining and displaying the (number of) left items that have been displayed and are recorded in mapOfAlreadyDisplayedLeftItems
                for (var i in mapOfAlreadyDisplayedLeftItems[currProductsMatchConfiguration]) {
                    console.log(i + ' rem: ' + mapOfAlreadyDisplayedLeftItems[currProductsMatchConfiguration][Number(i)]);
                }
                console.log('');

                console.log('');
				// determining and displaying the (number of) left items that have been displayed and are recorded in mapOfAlreadyDisplayedItems
                countMapOfAlreadyDisplayedItemsPerCurrentProductsMatchConfiguration = 0
                for (var i in mapOfAlreadyDisplayedItems[currProductsMatchConfiguration]) {
                    countMapOfAlreadyDisplayedItemsPerCurrentProductsMatchConfiguration += 1;
                    console.log('rem: ' + i);
                }
                console.log('');

                // second check
                // if the list of already displayed left items within the mapOfAlreadyDisplayedItems per the current products match configuration is
                // equal to zero, populate  mapOfAlreadyDisplayedItems with mapOfAlreadyDisplayedItemsCopy
                // currentNumberOfRecordedDisplayedLeftItemsForTheCurrentProductsMatchConfigurationInmapOfAlreadyDisplayedItems =
                // mapOfAlreadyDisplayedItems[currProductsMatchConfiguration].size;

                console.log('size mapOfAlreadyDisplayedItems: ' +
                    countMapOfAlreadyDisplayedItemsPerCurrentProductsMatchConfiguration);

                if (countMapOfAlreadyDisplayedItemsPerCurrentProductsMatchConfiguration == 0) {

                    mapOfAlreadyDisplayedItems = mapOfAlreadyDisplayedItemsCopy;

                }

                lengthOfAlreadyDisplayedLeftItems = mapOfAlreadyDisplayedLeftItems[currProductsMatchConfiguration].length;
                lastDisplayedLeftItemPerTheCurrentProductsMatchConfiguration =
                    mapOfAlreadyDisplayedLeftItems[currProductsMatchConfiguration][lengthOfAlreadyDisplayedLeftItems - 1];

                // remove last displayed left item from mapOfAlreadyDisplayedItems and mapOfAlreadyDisplayedLeftItems
                delete mapOfAlreadyDisplayedItems[currProductsMatchConfiguration][lastDisplayedLeftItemPerTheCurrentProductsMatchConfiguration];
                mapOfAlreadyDisplayedLeftItems[currProductsMatchConfiguration].pop();

                console.log('');
				// determining and displaying the (number of) left items that have been displayed and are recorded in mapOfAlreadyDisplayedLeftItems
                console.log('AFTER SECOND DELETION');
                for (var i in mapOfAlreadyDisplayedLeftItems[currProductsMatchConfiguration]) {
                    console.log(i + ' rem: ' + mapOfAlreadyDisplayedLeftItems[currProductsMatchConfiguration][Number(i)]);
                }
                console.log('');

                console.log('');
				// determining and displaying the (number of) left items that have been displayed and are recorded in mapOfAlreadyDisplayedItems
                for (var i in mapOfAlreadyDisplayedItems[currProductsMatchConfiguration]) {
                    console.log('rem: ' + i);
                }
                console.log('');

            }

            // console.log('isLeftProductsCategoryDropDownChanged: ' + isLeftProductsCategoryDropDownChanged);

            // using mapOfAllProductsThatMatchLeftItemsCategoryKey as a storage to ensure that users see
            // the same order of left item(s) during a page session despite the fact that the order will change in the
            // the next page session
            // var mapOfAllProductsThatMatchLeftItemsCategoryKey = "[" + usersPreferredGender + "]" + "[" + leftProductsCategory + "]";
            // console.log('mapOfAllProductsThatMatchLeftItemsCategoryKey: ' + mapOfAllProductsThatMatchLeftItemsCategoryKey);
            // var isKeyInMapOfAllProductsThatMatchLeftItemsCategory = mapOfAllProductsThatMatchLeftItemsCategory[mapOfAllProductsThatMatchLeftItemsCategoryKey];
            // console.log('isKeyInMapOfAllProductsThatMatchLeftItemsCategory: ' + isKeyInMapOfAllProductsThatMatchLeftItemsCategory, typeof(isKeyInMapOfAllProductsThatMatchLeftItemsCategory));

            // if (isKeyInMapOfAllProductsThatMatchLeftItemsCategory != undefined){

            // 	productsThatMatchCurrentLeftItemCategory = mapOfAllProductsThatMatchLeftItemsCategory[mapOfAllProductsThatMatchLeftItemsCategoryKey];

            // }
            // // if the list of left item has not been set, shuffle the list of left items to give a sense of variety and save it shuffle
            // else if (isKeyInMapOfAllProductsThatMatchLeftItemsCategory == undefined){

            // 	productsThatMatchCurrentLeftItemCategory = totalProductsPerCategoryPerGenderCopy[usersPreferredGender][leftProductsCategory];

            // 	// shuffling (twice) the list of products that match the specified gender and category to ensure that users see a
            // 	// truly different mix of products each time they visit products matching or recommendation page..
            // 	productsThatMatchCurrentLeftItemCategory = productsThatMatchCurrentLeftItemCategory.sort(function () {
            // 	  return Math.random() - 0.4;
            // 	});

            // 	mapOfAllProductsThatMatchLeftItemsCategory[mapOfAllProductsThatMatchLeftItemsCategoryKey] = productsThatMatchCurrentLeftItemCategory;

            // }

            // if the left items category dropdown changed, shuffle the list of left items to give a sense of variety and save it..
            // i.e to prevent visitors or users from seeing the same set of item pairs everytime they change the left item's category
            // if (isLeftProductsCategoryDropDownChanged == true){

            // 	console.log('Shuffled I');

            // 	productsThatMatchCurrentLeftItemCategory = totalProductsPerCategoryPerGenderCopy[usersPreferredGender][leftProductsCategory];

            // 	// shuffling (twice) the list of products that match the specified gender and category to ensure that users see a
            // 	// truly different mix of products each time they visit products matching or recommendation page..
            // 	productsThatMatchCurrentLeftItemCategory = productsThatMatchCurrentLeftItemCategory.sort(function () {
            // 	  return Math.random() - 0.4;
            // 	});

            // 	// mapOfAllProductsThatMatchLeftItemsCategory[mapOfAllProductsThatMatchLeftItemsCategoryKey] = productsThatMatchCurrentLeftItemCategory;

            // }

            console.log('productsThatMatchCurrentLeftItemCategory: ' + productsThatMatchCurrentLeftItemCategory);
            // console.log('items themself: ', productsThatMatchCurrentLeftItemCategory, leftProductsCategory);
            console.log('');

            // variable to signify whether or not a left and right item pair that matches the current configuration has been found
            var isLeftAndRightPairFound = false;
            // variable to signify whether or not the list of matching right items has already been shuffled
            // where 'isRightProductsCategoryDropDownChanged' is true
            var isListOfMatchingRightItemsAlreadyShuffled = false;

            // decoding IDs of products that match each product that is within productsThatMatchCurrentLeftItemCategory
            for (var index in productsThatMatchCurrentLeftItemCategory) {

                // check whether or not the current index is the last index in the list of products that match the current left item's category
                var isCurrentIndexTheLastIndexInTheListOfProductsThatMatchTheCurrentLeftItemsCategory = false;

                if (Number(index) == (productsThatMatchCurrentLeftItemCategory.length - 1)) {

                    isCurrentIndexTheLastIndexInTheListOfProductsThatMatchTheCurrentLeftItemsCategory = true;

                }

                // current left item
                var leftItem = productsThatMatchCurrentLeftItemCategory[Number(index)];

                // if the user chooses to generate new left and right item pair with the generateNewPair button, check whether the current
                // left item has been registered as a previously displayed item as per the current left and right item pair configuration..
                var currentProductsMatchConfiguration = "[" + usersPreferredGender + "]" + "[" + leftProductsCategory + "]" + "[" + rightProductsCategory + "]";

                // save the current left and right products match configuration to vet whether or not future products match configuration(s) should be implemented
                lastLeftAndRightItemsCategoryConfiguration = currentProductsMatchConfiguration;

                var currentLeftItemsProductLinksId = leftItem.baseproductlinksid;

                var isCurrentLeftItemAlreadyDisplayed = false;
                // confirming whether or not the current left item has been previously displayed
                if (mapOfAlreadyDisplayedItems[currentProductsMatchConfiguration] != undefined) {

                    var superCheckIsLeftAlreadyDisplayedBool = mapOfAlreadyDisplayedItems[currentProductsMatchConfiguration][currentLeftItemsProductLinksId];

                    if (superCheckIsLeftAlreadyDisplayedBool != undefined) {
                        isCurrentLeftItemAlreadyDisplayed = true;

                        //
                    }

                }

                console.log('');
                console.log('IN FOR LOOP');
                for (var i in mapOfAlreadyDisplayedLeftItems[currProductsMatchConfiguration]) {
                    console.log(i + ' rem: ' + mapOfAlreadyDisplayedLeftItems[currProductsMatchConfiguration][Number(i)]);
                }
                console.log('');

                console.log('');
                console.log('IN FOR LOOP');
                for (var i in mapOfAlreadyDisplayedItems[currentProductsMatchConfiguration]) {
                    console.log('rem: ' + i);
                }

                console.log('current left item: ' + leftItem.baseproductlinksid);
                console.log('isCurrentLeftItemAlreadyDisplayed: ' + isCurrentLeftItemAlreadyDisplayed);

                // MAJOR TRIGGER - LEFT & RIGHT ITEM
                // 1. The first condition is a special condition for showPreviouslyGeneratedPair button to ensure that all already displayed
                // left items that have been displayed and recorded in mapOfAlreadyDisplayedItems are skipped when the button is clicked

                // 2. If the user chooses that the left item should be changed and all the existing items that match the left item's category
                // have been displayed, clear the list of already displayed left items and execute, generateNewPair fundtion again to ensure
                // that the function should start displaying left items that match the current left item's category from stratch
                //
                // 3. If the user chooses that the left item should be changed and the current left item has been displayed,
                // skip it (the current left item)
                //
                // 4. Else (the last else if statement)
                // a. if the user chooses that the left item should be changed and the current left item has not been displayed, or
                // b. the user has not chosen that the left item should be changed,
                // go straight to searching for a proper right item

                if (isBackButtonClicked == true && isCurrentLeftItemAlreadyDisplayed == true) {

                    console.log('isBackButtonClicked; current item skipped'); {}

                } else if (
                    isGenerateNewLeftItemClicked == true &&
                    isCurrentLeftItemAlreadyDisplayed == true &&
                    isCurrentIndexTheLastIndexInTheListOfProductsThatMatchTheCurrentLeftItemsCategory == true) {

                    // checking whether copies of the current display config maps (mapOfAlreadyDisplayedItems & mapOfAlreadyDisplayedLeftItems)
                    // per the product match's configuration have been saved
                    var isDisplayConfigMapCopiesSavedForTheCurrentProductMatchConfigurationSaved =
                        isMapOfAlreadyDisplayedItemsCopySavedForTheProductMatchConfigurationSavedList.filter(
                            (alreadySavedDisplayConfigMapsProductMatchConfiguration) => {

                                return alreadySavedDisplayConfigMapsProductMatchConfiguration == currentProductsMatchConfiguration;

                            }).length > 0;

                    // if mapOfAlreadyDisplayedItemsCopy has not ever changed, save the original reversal process of
                    // mapOfAlreadyDisplayedLeftItems (i.e the first time the process is executed)
                    // This copy will be used or implemented everytime mapOfAlreadyDisplayedItems per the currentProductsMatchConfiguration
                    // is cleared..
                    if (isDisplayConfigMapCopiesSavedForTheCurrentProductMatchConfigurationSaved == false) {

                        // intiating the reversal process as continued in reversal_leftitemsmap
                        var firstLeftItemInMapOfAlreadyDisplayedLeftItems = mapOfAlreadyDisplayedLeftItems[currentProductsMatchConfiguration][0];
                        mapOfAlreadyDisplayedLeftItems[currentProductsMatchConfiguration].push(firstLeftItemInMapOfAlreadyDisplayedLeftItems); // position the item in the first index to the last list index
                        mapOfAlreadyDisplayedLeftItems[currentProductsMatchConfiguration].shift(); // i.e remove the item in the first index which has now been positioned at the end of mapOfAlreadyDisplayedLeftItems

                        mapOfAlreadyDisplayedLeftItemsCopy = JSON.parse(JSON.stringify(mapOfAlreadyDisplayedLeftItems));

                        // signify that copies of the current display config maps (mapOfAlreadyDisplayedItems & mapOfAlreadyDisplayedLeftItems)
                        // per the product match's configuration have been processed and deductively saved..
                        isMapOfAlreadyDisplayedItemsCopySavedForTheProductMatchConfigurationSavedList.push(currentProductsMatchConfiguration);

                    }

                    console.log('mapOfAlreadyDisplayedItemsCopy saved above');
                    // save a copy of mapOfAlreadyDisplayedItems
                    mapOfAlreadyDisplayedItemsCopy = JSON.parse(JSON.stringify(mapOfAlreadyDisplayedItems));

                    // reset mapOfAlreadyDisplayedItems for the current products match configuration
                    mapOfAlreadyDisplayedItems[currentProductsMatchConfiguration] = {};

                    // reset mapOfAlreadyDisplayedLeftItems for the current products match configuration as processed relevantly
                    // above..
                    mapOfAlreadyDisplayedLeftItems = JSON.parse(JSON.stringify(mapOfAlreadyDisplayedLeftItemsCopy));

                    generateNewPair(
                        isRightProductsCategoryDropDownChanged,
                        isLeftProductsCategoryDropDownChanged,
                        isGenerateNewRightItemClicked,
                        isGenerateNewLeftItemClicked
                    );

                } else if (isGenerateNewLeftItemClicked == true && isCurrentLeftItemAlreadyDisplayed == true) {

                    console.log('searchingROne'); {};

                } else if (

                    (isGenerateNewLeftItemClicked == true && isCurrentLeftItemAlreadyDisplayed == false) ||

                    (isGenerateNewLeftItemClicked == false)

                ) {

                    console.log('');
                    console.log('isSpecificLeftItemTargetOn: ' + isSpecificLeftItemTargetOn);
                    console.log('leftItem.baseproductlinksid: ' + leftItem.baseproductlinksid);
                    console.log('lastDisplayedLeftItem: ' + lastDisplayedLeftItem);
                    console.log('');

                    // 1. In the event that the user has clicked on generateNewPairButton previously  and the refreshCurrentPairButton afterwards,
                    // a. if the current left item doesn't match the item that was displayed when the user clicked on the generateNewPair Button,
                    // skip the current left item,
                    // b. if the current left item matches the item that was displayed when the user clicked on the generateNewPair Button, proceed
                    // to displaying the relevant right item match for the left item
                    //
                    // 2. If the user clicked on generateNewPairButton but did not click on refreshCurrentPairButton button, then generate a new item pair
                    // 'only'
                    // 3. In the event that the user did not click on generateNewPair Button previously, proceed to displaying the relevant right
                    // right item for the current left item without skipping..
                    if (
                        isSpecificLeftItemTargetOn == true && isGenerateNewRightItemClicked == true && leftItem.baseproductlinksid != lastDisplayedLeftItem) {

                        console.log('searchingRTwo'); {};

                    } else if (
                        (isSpecificLeftItemTargetOn == true && isGenerateNewRightItemClicked == true && leftItem.baseproductlinksid == lastDisplayedLeftItem) ||
                        (isSpecificLeftItemTargetOn == true && isGenerateNewRightItemClicked == false) ||
                        isSpecificLeftItemTargetOn == false
                    ) {

                        console.log('');
                        console.log('final isSpecificLeftItemTargetOn: ' + isSpecificLeftItemTargetOn);
                        console.log('isGenerateNewLeftItemClicked: ' + isGenerateNewLeftItemClicked);
                        console.log('');

                        console.log('current index: ' + index);
                        console.log('lengthOfItemsThatMatchLeftItemsCategory: ' + String(productsThatMatchCurrentLeftItemCategory.length));

                        // var currentItemData = '';

                        // for (var i in item){

                        // 	if (i != 'allproductsthatmatchproductscolor'){
                        // 		console.log('in 1');
                        // 		currentItemData += i + ": " + item[i] + ', '
                        // 	}
                        // 	else if (i == 'allproductsthatmatchproductscolor' && typeof(productsThatMatchCurrentLeftItemCategory[Number(index)].allproductsthatmatchproductscolor) != 'object'){
                        // 		console.log('in 2');
                        // 		currentItemData += i + ": " + decodeCodifiedString(item[i]) + ', '
                        // 	}

                        // }

                        // console.log(currentItemData);

                        console.log('Got into foreach loop: ');
                        console.log('allproductsthatmatchproductscolor: ' + productsThatMatchCurrentLeftItemCategory[Number(index)].allproductsthatmatchproductscolor);

                        // obtaining all products that match the current item at the first time by converting allproductsthatmatchproductscolor's
                        // codified string to a list..
                        // if allProductsThatMatchCurrentLeftProductsColor is an empty list, it will end up not being converted into an array or list,
                        // it would remain a string in such a scenario..
                        var allProductsThatMatchCurrentLeftProductsColor = [];
                        if (typeof (productsThatMatchCurrentLeftItemCategory[Number(index)].allproductsthatmatchproductscolor) == 'string' &&
                            // i.e when allproductsthatmatchproductscolor is not is parsable by decodeCodifiedString according to the current version..
                            (productsThatMatchCurrentLeftItemCategory[Number(index)].allproductsthatmatchproductscolor).length > 30) {

                            // console.log('got here x');
                            productsThatMatchCurrentLeftItemCategory[Number(index)].allproductsthatmatchproductscolor = decodeCodifiedString(
                                productsThatMatchCurrentLeftItemCategory[Number(index)].allproductsthatmatchproductscolor
                            );

                            // console.log('got here y');
                            allProductsThatMatchCurrentLeftProductsColor = productsThatMatchCurrentLeftItemCategory[Number(index)].allproductsthatmatchproductscolor;

                            // console.log('got here z');
                            // rectifying string decoding error that may have happened with 'decodeCodifiedString' function
                            if (!allProductsThatMatchCurrentLeftProductsColor.startsWith('[')) {

                                // console.log('');
                                // console.log('got here 1');
                                var indexOfInitialArrayBracketallProductsThatMatchCurrentLeftProductsColor = allProductsThatMatchCurrentLeftProductsColor.indexOf('[');
                                // console.log('got here 2');
                                var indexOfClosingBracketallProductsThatMatchCurrentLeftProductsColor = allProductsThatMatchCurrentLeftProductsColor.length;

                                // console.log('got here 3');
                                // console.log('allProductsThatMatchCurrentLeftProductsColor without substring: ' + allProductsThatMatchCurrentLeftProductsColor);

                                // console.log('got here 4');
                                allProductsThatMatchCurrentLeftProductsColor = allProductsThatMatchCurrentLeftProductsColor.substring(
                                    indexOfInitialArrayBracketallProductsThatMatchCurrentLeftProductsColor,
                                    indexOfClosingBracketallProductsThatMatchCurrentLeftProductsColor
                                );

                                // console.log('got here 5');
                                // console.log('allProductsThatMatchCurrentLeftProductsColor substring: ' + allProductsThatMatchCurrentLeftProductsColor);
                                // console.log('got here 6');

                                // console.log('');

                            }

                            // console.log('got here a');
                            allProductsThatMatchCurrentLeftProductsColor = JSON.parse(allProductsThatMatchCurrentLeftProductsColor);
                            // console.log('got here b');
                            productsThatMatchCurrentLeftItemCategory[Number(index)].allproductsthatmatchproductscolor = allProductsThatMatchCurrentLeftProductsColor;
                            console.log('allProductsThatMatchCurrentLeftProductsColor w: ' + allProductsThatMatchCurrentLeftProductsColor);
                        }

                        allProductsThatMatchCurrentLeftProductsColor = productsThatMatchCurrentLeftItemCategory[Number(index)].allproductsthatmatchproductscolor;
                        console.log('');
                        console.log('allProductsThatMatchCurrentLeftProductsColor post JSON to Array Conversion: ',
                            (productsThatMatchCurrentLeftItemCategory[Number(index)].allproductsthatmatchproductscolor),
                            typeof (productsThatMatchCurrentLeftItemCategory[Number(index)].allproductsthatmatchproductscolor)

                        );
                        console.log('');

                        // extracting items that match the current left item to ascertain which one of them matches the right item's category..
                        // Note that 'allProductsThatMatchCurrentLeftProductsColor' will only remain a string here in the event that it's an empty list
                        if (typeof (allProductsThatMatchCurrentLeftProductsColor) != 'string') {

                            // obtaining list of items that match the left item's color and also the right item's category
                            var allProductsThatMatchCurrentLeftProductsColorAndMatchRightProductsCategory = [];

                            for (var matchingProductsIndex in allProductsThatMatchCurrentLeftProductsColor) {

                                var currentMatchingProductBaseProductLinksId = allProductsThatMatchCurrentLeftProductsColor[Number(matchingProductsIndex)];
                                dbQueryAllResponseItems.filter((potentialRightProduct) => {

                                    // if (potentialRightProduct.baseproductlinksid == currentMatchingProductBaseProductLinksId){

                                    // 	console.log(leftItem.baseproductlinksid + ' == ' + potentialRightProduct.baseproductlinksid);
                                    // 	console.log(potentialRightProduct.baseproductlinksid + ' == ' + currentMatchingProductBaseProductLinksId);
                                    // 	console.log(potentialRightProduct.productcategory + ' == ' + rightProductsCategory);

                                    // }

                                    if (leftItem.baseproductlinksid != potentialRightProduct.baseproductlinksid &&
                                        potentialRightProduct.baseproductlinksid == currentMatchingProductBaseProductLinksId &&
                                        potentialRightProduct.productcategory == rightProductsCategory) {

                                        allProductsThatMatchCurrentLeftProductsColorAndMatchRightProductsCategory.push(currentMatchingProductBaseProductLinksId)
                                    }

                                });
                            }

                            // Ensuring that the current left item is registered in the list of already displayed items only if it has products or items
                            // that match its right item's category..
                            if (allProductsThatMatchCurrentLeftProductsColorAndMatchRightProductsCategory.length != 0) {

                                // Ensuring that the user is intimated about the number of pairs that matches their current product match
                                // configuration via text or button action
                                if (allProductsThatMatchCurrentLeftProductsColorAndMatchRightProductsCategory.length == 1) {
                                    $w('#matchUnavailableNotification').label = 'Found 1 Match';
                                    $w('#refreshCurrentPairButton').disable();
                                    console.log('refreshCurrentPairButton disabled');
                                    $w('#matchUnavailableNotification').show();
                                } else if (allProductsThatMatchCurrentLeftProductsColorAndMatchRightProductsCategory.length > 1) {
                                    $w('#matchUnavailableNotification').label =
                                        'Found ' + String(allProductsThatMatchCurrentLeftProductsColorAndMatchRightProductsCategory.length) + ' Matches';
                                    $w('#refreshCurrentPairButton').enable();
                                    $w('#matchUnavailableNotification').show();
                                }

                                // ------------------------------------------------------------------------------------------------------------------------------------------------------------
                                // SETTING UP TRACKER FRAME FOR THE CURRENT LEFT AND RIGHT ITEMS ONCE AND FOR ALL..
                                var currentProductsMatchConfiguration = "[" + usersPreferredGender + "]" + "[" + leftProductsCategory + "]" + "[" + rightProductsCategory + "]";
                                var iscurrentProductsMatchConfigurationInmapOfAlreadyDisplayedItems = mapOfAlreadyDisplayedItems[currentProductsMatchConfiguration];

                                if (iscurrentProductsMatchConfigurationInmapOfAlreadyDisplayedItems == undefined) {

                                    mapOfAlreadyDisplayedItems[currentProductsMatchConfiguration] = {};
                                    mapOfAlreadyDisplayedLeftItems[currentProductsMatchConfiguration] = [];

                                    // if the current product match configuration has not previously been recorded or displayed,
                                    // signify..
                                    isCurrentProductMatchConfigurationPreviouslyBeenDefinedAndDisplayed = false;

                                }
                                // if the current product match configuration has previously been recorded or displayed,
                                // signify..
                                else if (iscurrentProductsMatchConfigurationInmapOfAlreadyDisplayedItems != undefined) {

                                    isCurrentProductMatchConfigurationPreviouslyBeenDefinedAndDisplayed = true;

                                }

                                var currentLeftItemsProductLinksId = leftItem.baseproductlinksid;
                                var isCurrentLeftItemsProductLinksIdInmapOfAlreadyDisplayedItems = mapOfAlreadyDisplayedItems[currentProductsMatchConfiguration][currentLeftItemsProductLinksId];

                                if (isCurrentLeftItemsProductLinksIdInmapOfAlreadyDisplayedItems == undefined) {

                                    mapOfAlreadyDisplayedItems[currentProductsMatchConfiguration][currentLeftItemsProductLinksId] = {};

                                    mapOfAlreadyDisplayedItems[currentProductsMatchConfiguration][currentLeftItemsProductLinksId]['isMatchExists'] = false;
                                    mapOfAlreadyDisplayedItems[currentProductsMatchConfiguration][currentLeftItemsProductLinksId]['listOfAlreadyDisplayedRightItemsThatMatchLefItemCategory'] = [];

                                }

                                // ------------------------------------------------------------------------------------------------------------------------------------------------------------

                            }

                            // if the right items category dropdown changed, shuffle the list of right items to give a different view every time
                            // if (isRightProductsCategoryDropDownChanged == true &&
                            // 	isListOfMatchingRightItemsAlreadyShuffled == false){

                            // 	console.log('Shuffled II');
                            //
                            // 	allProductsThatMatchCurrentLeftProductsColorAndMatchRightProductsCategory = allProductsThatMatchCurrentLeftProductsColorAndMatchRightProductsCategory.sort(function () {
                            // 	  return Math.random() - 0.4;
                            // 	});

                            // 	isListOfMatchingRightItemsAlreadyShuffled = true;
                            //

                            // }

                            console.log('allProductsThatMatchCurrentLeftProductsColorAndMatchRightProductsCategory: ' + allProductsThatMatchCurrentLeftProductsColorAndMatchRightProductsCategory);

                            for (var potentialRightItemIndex in allProductsThatMatchCurrentLeftProductsColorAndMatchRightProductsCategory) {

                                var currentMatchingProductsLinksId = allProductsThatMatchCurrentLeftProductsColorAndMatchRightProductsCategory[Number(potentialRightItemIndex)];

                                // obtaining the current matching product's full info with it's baseProductLinksId
                                for (var itemIndexII in dbQueryAllResponseItems) {

                                    // current matching product's full info
                                    var potentialRightProductWithinDbQueryAllResponseItems = dbQueryAllResponseItems[Number(itemIndexII)];

                                    if (potentialRightProductWithinDbQueryAllResponseItems.baseproductlinksid == currentMatchingProductsLinksId) {

                                        console.log('');
                                        console.log('potentialRightProductWithinDbQueryAllResponseItems.baseproductlinksid: ' + potentialRightProductWithinDbQueryAllResponseItems.baseproductlinksid + " currentMatchingProductsLinksId: " + currentMatchingProductsLinksId);
                                        console.log('potentialRightProductWithinDbQueryAllResponseItems.gender: ' + potentialRightProductWithinDbQueryAllResponseItems.gender + ' usersPreferredGender: ' + usersPreferredGender);
                                        console.log('potentialRightProductWithinDbQueryAllResponseItems.productcategory: ' + potentialRightProductWithinDbQueryAllResponseItems.productcategory + ' rightProductsCategory: ' + rightProductsCategory);
                                        console.log('');

                                    }

                                    // if the current matching product's matches the right item's category, display it if
                                    // the current item matches the current right and left item configuration and preferrably
                                    // if it was not the last display pair of the current left and right combinantion..
                                    if (
                                        potentialRightProductWithinDbQueryAllResponseItems.baseproductlinksid == currentMatchingProductsLinksId &&
                                        potentialRightProductWithinDbQueryAllResponseItems.gender == usersPreferredGender &&
                                        (
                                            potentialRightProductWithinDbQueryAllResponseItems.productcategory == rightProductsCategory ||
                                            rightProductsCategory.includes(potentialRightProductWithinDbQueryAllResponseItems.productcategory)
                                        )
                                    ) {

                                        // label potentialRightProduct as the perfect right item for semantics..
                                        var perfectRightProduct = potentialRightProductWithinDbQueryAllResponseItems;

                                        // signal that a match for the current left and right item category configuration exists
                                        mapOfAlreadyDisplayedItems[currentProductsMatchConfiguration][currentLeftItemsProductLinksId]['isMatchExists'] = true;
                                        var isMatchExists = mapOfAlreadyDisplayedItems[currentProductsMatchConfiguration][currentLeftItemsProductLinksId]['isMatchExists'];

                                        // checking if the current left and right item has previously been displayed
                                        var listOfAlreadyDisplayedRightItemsForTheCurrentLeftItem = mapOfAlreadyDisplayedItems[currentProductsMatchConfiguration][
                                            currentLeftItemsProductLinksId
                                        ]['listOfAlreadyDisplayedRightItemsThatMatchLefItemCategory'];

                                        var isCurrentRightItemAlreadyDisplayed = listOfAlreadyDisplayedRightItemsForTheCurrentLeftItem.filter((alreadyDisplayedRightItem) => {
                                            return alreadyDisplayedRightItem == perfectRightProduct.baseproductlinksid;
                                        }).length > 0;

                                        console.log('isCurrentRightItemAlreadyDisplayed: ' + isCurrentRightItemAlreadyDisplayed);

                                        // checking whether the current left item has previously been recorded in mapOfAlreadyDisplayedLeftItems or 'presumably' displayed
                                        // which is used for navigating backwards for 'generated new items'..
                                        // checkLeft_I
                                        var isCurrentLeftItemAlreadyDisplayed = mapOfAlreadyDisplayedLeftItems[currentProductsMatchConfiguration].filter(
                                            (alreadyDisplayedLeftItemForTheCurrentMatchConfiguration) => {

                                                return alreadyDisplayedLeftItemForTheCurrentMatchConfiguration == leftItem.baseproductlinksid;

                                            }).length > 0;

                                        // if all items that the match the left item have been displayed, clear the list of already displayed items
                                        // and start displaying them all over again
                                        if (isMatchExists == true &&
                                            (Number(potentialRightItemIndex) == allProductsThatMatchCurrentLeftProductsColorAndMatchRightProductsCategory.length - 1) &&
                                            isCurrentRightItemAlreadyDisplayed == true
                                        ) {

                                            console.log('autobreakII!');

                                            // clearing list of already displayed right items that match the left item's category
                                            while (listOfAlreadyDisplayedRightItemsForTheCurrentLeftItem.length > 0) {
                                                mapOfAlreadyDisplayedItems[currentProductsMatchConfiguration][
                                                    currentLeftItemsProductLinksId
                                                ]['listOfAlreadyDisplayedRightItemsThatMatchLefItemCategory'].pop();
                                            }

                                            // console.log('autobreakII!');

                                            // generate new pair again and break the current operation
                                            // the list of already displayed right items that match the left item's category has been cleared,
                                            // the display of matching right items will start from stratch
                                            generateNewPair(
                                                isRightProductsCategoryDropDownChanged,
                                                isLeftProductsCategoryDropDownChanged,
                                                isGenerateNewRightItemClicked,
                                                isGenerateNewLeftItemClicked
                                            );

                                            return;

                                        }

                                        // if it's not in the list of previously displayed right items, add it to the list and display it..
                                        if (isCurrentRightItemAlreadyDisplayed == false) {

                                            // console.log('autobreak test');

                                            mapOfAlreadyDisplayedItems[currentProductsMatchConfiguration][currentLeftItemsProductLinksId][
                                                'listOfAlreadyDisplayedRightItemsThatMatchLefItemCategory'
                                            ].push(perfectRightProduct.baseproductlinksid);

                                            console.log('');
                                            console.log('listOfAlreadyDisplayedRightItemsForTheCurrentLeftItem: ' + listOfAlreadyDisplayedRightItemsForTheCurrentLeftItem);
                                            console.log('');

                                            $w('#itemsGallery').items = [{
                                                    "type": "image",
                                                    "title": leftItem.title.substring(0, 30) + '..',
                                                    "src": leftItem.imagesrc,
                                                    'description': leftItem.price,
                                                    'link': leftItem.productlink,

                                                },

                                                {
                                                    "type": "image",
                                                    "title": perfectRightProduct.title.substring(0, 30) + '..',
                                                    "src": perfectRightProduct.imagesrc,
                                                    'description': perfectRightProduct.price,
                                                    'link': perfectRightProduct.productlink,

                                                }
                                            ];

                                            // signal that the a perfect left and right pair has been found
                                            // isLeftAndRightPairFound = true;

                                            // updating last displayed left item's variable with the current left item's data
                                            // to help track the left item that should be displayed especially when the generateNewPairButton
                                            // is before the refreshCurrentPairButton is clicked..
                                            if (isGenerateNewLeftItemClicked == true) {

                                                lastDisplayedLeftItem = leftItem.baseproductlinksid;

                                                // register whether the user clicked 'generateNewPairButton' to determine whether or not the next displayed matching pair
                                                // should be implemented and displayed if user clicks on refreshCurrentPairButton immediately..
                                                isSpecificLeftItemTargetOn = true;

                                                console.log('isSpecificLeftItemTargetOn post match: ' + isSpecificLeftItemTargetOn);

                                                // Note: if current left item has already been added to the mapOfAlreadyDisplayedLeftItems, this means
                                                // that the mapOfAlreadyDisplayedItems (left and right) has been cleared and left items are being displayed
                                                // from stratch all over again. Hence the already existent left items in mapOfAlreadyDisplayedLeftItems
                                                // is repositioned from the first index to the last list index..
                                                //
                                                // if the current left item has not been recorded in the mapOfAlreadyDisplayedLeftItems according
                                                // to its relevant position, add it

                                                if (isCurrentLeftItemAlreadyDisplayed == false) {

                                                    mapOfAlreadyDisplayedLeftItems[currentProductsMatchConfiguration].push(leftItem.baseproductlinksid);
                                                    console.log('leftItem Test: ' + leftItem.baseproductlinksid);

                                                }
                                                // reversal_leftitemsmap
                                                else if (isCurrentLeftItemAlreadyDisplayed == true) {

                                                    // check whether the current left item has not already been placed at the last index of mapOfAlreadyDisplayedLeftItems
                                                    // if it has pause or skip, other wise continue
                                                    var firstLeftItemInMapOfAlreadyDisplayedLeftItems = mapOfAlreadyDisplayedLeftItems[currentProductsMatchConfiguration][0];

                                                    if (firstLeftItemInMapOfAlreadyDisplayedLeftItems == leftItem.baseproductlinksid) {

                                                        mapOfAlreadyDisplayedLeftItems[currentProductsMatchConfiguration].shift(); // i.e remove the already existent item
                                                        mapOfAlreadyDisplayedLeftItems[currentProductsMatchConfiguration].push(leftItem.baseproductlinksid); // and position it to the last list index

                                                    }

                                                }

                                            }

                                            // if the current product match configuration or current left item have not previously been displayed
                                            // record the current left item for the first time in the mapOfAlreadyDisplayedLeftItems relevantly
                                            // Also, disable the 'Back button on intital execution of the generateNewPair function as it should
                                            // only be available after two different left items have already been generated and displayed..
                                            if (isCurrentProductMatchConfigurationPreviouslyBeenDefinedAndDisplayed == false) {

                                                $w('#showPreviouslyGeneratedPair').disable();
                                                mapOfAlreadyDisplayedLeftItems[currentProductsMatchConfiguration].push(leftItem.baseproductlinksid);

                                            }
                                            // else if
                                            // 1. 'Back' button is clicked
                                            // 1. the current product match configuration has already been displayed and recorded, and
                                            // 2. the current left item is not in the mapOfAlreadyDisplayedLeftItems, add it..
                                            else if (isCurrentProductMatchConfigurationPreviouslyBeenDefinedAndDisplayed == true && isBackButtonClicked == true) {

                                                // update the
                                                lastDisplayedLeftItem = leftItem.baseproductlinksid;

                                                // register whether the user clicked the back button or 'showPreviouslyGeneratedPair' to determine whether or not the next
                                                // displayed matching pair should be implemented and displayed if user clicks on refreshCurrentPairButton immediately..
                                                isSpecificLeftItemTargetOn = true;

                                                // if the current left item has not been added to mapOfAlreadyDisplayedLeftItems, add it..
                                                if (isCurrentLeftItemAlreadyDisplayed == false) {

                                                    console.log('added left item to listofleftitems');
                                                    mapOfAlreadyDisplayedLeftItems[currentProductsMatchConfiguration].push(leftItem.baseproductlinksid);
                                                }

                                            }

                                            // On the side, if the list of already displayed left items per the current product match configuration
                                            // has a length of two or more left items, enable the 'Back' | showPreviouslyGeneratedPair button
                                            // This condition will ensure that the "Back" button remains enabled after the first two matching
                                            // left and right pair have been generated for a specific product match configuration
                                            if (mapOfAlreadyDisplayedLeftItems[currentProductsMatchConfiguration].length >= 2) {

                                                $w('#showPreviouslyGeneratedPair').enable();
                                            }

                                            // disable the number of times the user can go back is 'zero', since back operation only function
                                            // when two previously displayed items are available and can be deleted readily
                                            if (mapOfAlreadyDisplayedLeftItems[currentProductsMatchConfiguration].length < 2) {

                                                $w('#showPreviouslyGeneratedPair').disable();
                                            }

                                            // stop the loop if any of the following is true -
                                            // note: the condition is for sentimental value, what's really needed is the 'break'
                                            // if (isLeftProductsCategoryDropDownChanged == true || isRightProductsCategoryDropDownChanged == true ||
                                            // 	isGenerateNewRightItemClicked == true){
                                            console.log('autobreak!');
                                            isLeftAndRightPairFound = true;
                                            return;
                                            //	}

                                        }

                                        console.log('');
                                        console.log('listOfAlreadyDisplayedRightItemsForTheCurrentLeftItem: ' + listOfAlreadyDisplayedRightItemsForTheCurrentLeftItem);
                                        console.log('');

                                        // if (mapOfAlreadyDisplayedItems.get(item) == null){
                                        // 	mapOfAlreadyDisplayedItems[item] = {};
                                        // }
                                        //
                                        // if (mapOfAlreadyDisplayedItems[item].get(rightProductsCategory) == null){
                                        // 	mapOfAlreadyDisplayedItems[item][rightProductsCategory] = [potentialRightProduct.baseproductlinksid]
                                        // }
                                        // else{
                                        // 	mapOfAlreadyDisplayedItems[item][rightProductsCategory].push(potentialRightProduct.baseproductlinksid);
                                        // }
                                    }

                                }

                                console.log('isLeftAndRightPairFoundAfterLoop: ' + isLeftAndRightPairFound);

                                // itemThatMatchesCurrentItem = i
                            }

                            console.log('isCurrentLeftItemAlreadyDisplayed: ' + isCurrentLeftItemAlreadyDisplayed);

                            // If the user chooses that the left item should be changed and all the existing items but the last item in the list of items
                            // that match the left item's category have been displayed. In the event that such an item does not have not have an item that
                            // matches the right item's category, clear the list of already displayed left items and execute generateNewPair function again
                            // to ensure that the function starts displaying left items that match the current left item's category from stratch

                            if (
                                isGenerateNewLeftItemClicked == true &&
                                // false is used because the check operation for this variable happens early on before the left item is added after a match has been detected
                                isCurrentLeftItemAlreadyDisplayed == false && // ?i.e it has indirectly been displayed and registered but has not been registered according to the initial check in checkLeft_I
                                isCurrentIndexTheLastIndexInTheListOfProductsThatMatchTheCurrentLeftItemsCategory == true) {

                                console.log('got here 1');

                                // checking whether copies of the current display config maps (mapOfAlreadyDisplayedItems & mapOfAlreadyDisplayedLeftItems)
                                // per the product match's configuration have been saved
                                var isDisplayConfigMapCopiesSavedForTheCurrentProductMatchConfigurationSaved =
                                    isMapOfAlreadyDisplayedItemsCopySavedForTheProductMatchConfigurationSavedList.filter(
                                        (alreadySavedDisplayConfigMapsProductMatchConfiguration) => {

                                            return alreadySavedDisplayConfigMapsProductMatchConfiguration == currentProductsMatchConfiguration;

                                        }).length > 0;

                                // if mapOfAlreadyDisplayedItemsCopy has not ever changed, save the original reversal process of
                                // mapOfAlreadyDisplayedLeftItems above
                                if (isDisplayConfigMapCopiesSavedForTheCurrentProductMatchConfigurationSaved == false) {

                                    console.log('got in here 1a');

                                    // intiating the reversal process as continued in reversal_leftitemsmap
                                    var firstLeftItemInMapOfAlreadyDisplayedLeftItems = mapOfAlreadyDisplayedLeftItems[currentProductsMatchConfiguration][0];
                                    mapOfAlreadyDisplayedLeftItems[currentProductsMatchConfiguration].push(firstLeftItemInMapOfAlreadyDisplayedLeftItems); // position the item in the first index to the last list index
                                    mapOfAlreadyDisplayedLeftItems[currentProductsMatchConfiguration].shift(); // i.e remove the item in the first index which has now been positioned at the end of mapOfAlreadyDisplayedLeftItems

                                    mapOfAlreadyDisplayedLeftItemsCopy = JSON.parse(JSON.stringify(mapOfAlreadyDisplayedLeftItems));

                                    // signify that copies of the current display config maps (mapOfAlreadyDisplayedItems & mapOfAlreadyDisplayedLeftItems)
                                    // per the product match's configuration have been processed and deductively saved..
                                    isMapOfAlreadyDisplayedItemsCopySavedForTheProductMatchConfigurationSavedList.push(currentProductsMatchConfiguration);

                                }

                                console.log('got here 2');

                                // save a copy of mapOfAlreadyDisplayedItems
                                mapOfAlreadyDisplayedItemsCopy = JSON.parse(JSON.stringify(mapOfAlreadyDisplayedItems));

                                console.log('got here 3');

                                // reset mapOfAlreadyDisplayedItems for the current products match configuration
                                mapOfAlreadyDisplayedItems[currentProductsMatchConfiguration] = {};

                                console.log('got here 4');
                                console.log('currentProductsMatchConfiguration: ' + currentProductsMatchConfiguration);

                                // reset mapOfAlreadyDisplayedLeftItems for the current products match configuration as processed relevantly
                                // above..
                                console.log('mapOfAlreadyDisplayedLeftItemsCopy: ' + mapOfAlreadyDisplayedLeftItemsCopy[currentProductsMatchConfiguration]);
                                mapOfAlreadyDisplayedLeftItems = JSON.parse(JSON.stringify(mapOfAlreadyDisplayedLeftItemsCopy));

                                generateNewPair(
                                    isGenerateNewLeftItemClicked
                                );

                            }

                        }
                    }

                }

            }

            console.log('items themself: ', productsThatMatchCurrentLeftItemCategory, leftProductsCategory);

        }

    }

}

function retrieveDatabaseItems(
    dbCollectionToFocusOn,
    options
) {

    return wixData.query(dbCollectionToFocusOn).limit(1000).find(options)
        .then((dbQueryAllResponse) => {

            console.log(dbQueryAllResponse)

            dbQueryAllResponseItems = dbQueryAllResponse.items;

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
    //     $w('#aboutUsText').onClick((event) => {
    //         wixLocation.to('https://www.askandcarts.com/about-us');
    //     });
    //
    //     // terms and conditions button
    //     $w('#termsAndConditionsText').onClick((event) => {
    //         wixLocation.to('https://www.askandcarts.com/terms-and-conditions-and-privacy-policy');
    //     });
    //
    //     // store policy button
    //     $w('#privacyPolicyText').onClick((event) => {
    //         wixLocation.to('https://www.askandcarts.com/terms-and-conditions-and-privacy-policy#privacy-policy');
    //     });
    //
    //     // scroll to join newsletter widget if the loading device is a smartphone or tablet
    //     if (wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet") {
    //
    //         $w('#section5').hide();
    //         $w('#recommendedForWomenGallery').hide();
    //         $w('#mobileLine2').scrollTo();
    //         // $w('#gallery1').scrollTo();
    //         $w('#input2').label.bold();
    //
    //     }
    //
    // 	// Get subscribers (Join) form..
    // 	$w('#getSubscribers1').onWixFormSubmit((event) => {
    //
    // 		console.log('here 1');
    // 		console.log('userInput: ' + $w('#input2').value);
    // 		var userInput = $w('#input2').value;
    //
    // 		setTimeout(() => {
    //
    // 			const contactInfo = {
    // 			  name: {
    // 			    first: " ",
    // 			    last: "Undefined Gender"
    // 			  },
    // 			  emails: [
    // 			    {
    // 			      email: userInput,
    // 			    },
    // 			    {
    // 			      email: userInput
    // 			    }
    // 			  ],
    //
    // 			  phones: [
    //   				  {
    //   				    tag: "MOBILE",
    //   				    countryCode: usersCountryCode,
    //   				    phone: "once or twice a month",
    //   				    primary: true
    //   				  }
    //   				],
    //
    // 			  addresses: [
    //     			  {
    //     			    tag: "HOME",
    //     			    address: {
    //     			      formatted: usersCountry,
    //     			      location: {
    //     			        latitude: 0,
    //     			        longitude: 0
    //     			      },
    //     			      city: "",
    //     			      subdivision: "",
    //     			      country: usersCountryCode,
    //     			      postalCode: "00000"
    //     			    }
    //     			  }
    //     			],
    // 			};
    //
    // 			console.log('here 2');
    // 			// console.log('contactInfo: ' + contactInfo.phones[0].countryCode);
    //
    //
    // 			wixCrm.contacts.appendOrCreateContact(contactInfo)
    // 		  	.then((resolvedContact) => {
    // 				console.log('resolvedContact ' + resolvedContact);
    // 		  	  	return resolvedContact;
    // 		  	})
    // 		  	.catch((error) => {
    // 		  	  	console.error(error);
    // 		  	});
    //
    // 			console.log('here 3');
    //
    // 		}, 500);
    //
    // 	});
    //
    // 	// $w('#line1').hide();

    // Hiding 'No Match Was Found' Notification initially
    $w('#matchUnavailableNotification').hide();

    // Hiding singular item's category dropdown menu initially
    $w('#singularItemsCategoryDropDown').hide();

    $w('#showPreviouslyGeneratedPair').disable();

    if (wixWindow.rendering.env === "browser") {

        resolveGalleryItems();

    }

    // setTimeout(() => {

    // redirect to not available
    // if (usersCountryCode != 'AE' && usersCountryCode != 'US' && usersCountryCode != 'SG'){
    // 	wixLocation.to('https://askandcarts.com/not-available');
    // 	close();
    // }

    // removing items (products) without product category or gender & products that exist more than once in the database..

    // }, timeOut);

})

// // function to check the number of whether or not an item is in list
function isItemsInList(
    containerlist,
    listOfItemsToSearchFor,
) {
    var responseList = [];

    for (var indexOfItemToSearchFor in listOfItemsToSearchFor) {

        // check whether or not the current item to search for is within the container list, if so return true and vice versa
        var response = containerlist.filter((itemWithinList) => {
            // console.log(itemWithinList, listOfItemsToSearchFor[indexOfItemToSearchFor]);
            return itemWithinList == listOfItemsToSearchFor[indexOfItemToSearchFor];
        }).length > 0;

        // console.log('response: ' + response);
        if (response == true) {
            responseList.push(true)
        }
    }

    if (responseList.length > 0) {
        return true;
    } else {
        return false
    }

}

// decode codified url
function decodeCodifiedString(codifiedUrl) {

    if (codifiedUrl.includes('https://www.')) {
        codifiedUrl = codifiedUrl.replace('https://www.', '');
    } else if (codifiedUrl.includes('https://')) {
        // console.log('replacing https://');
        codifiedUrl = codifiedUrl.replace('https://', '');
    } else if (codifiedUrl.includes('http://www.')) {
        codifiedUrl = codifiedUrl.replace('http://www.', '');
    } else if (codifiedUrl.includes('http://')) {
        codifiedUrl = codifiedUrl.replace('http://', '');
    }

    let urlLength = (codifiedUrl.length - 20) / 5;
    let lengthPreSII = Math.floor(((urlLength * 2) + 15) * .25); // position of first block
    let lengthPreMid = Math.floor(((urlLength * 2) + 10) * .50); // position of second block
    let lengthPreSI = Math.floor(((urlLength * 2) + 5) * .75); // position of third block
    let codifiedUrlListLastBlock = (urlLength * 2); // position of last block

    // console.log('');
    // console.log('position of first block: ' + lengthPreSII);
    // console.log('position of second block: ' + lengthPreMid);
    // console.log('position of third block: ' + lengthPreSI);
    // console.log('position of last block: ' + codifiedUrlListLastBlock);

    // convert codifiedUrl string to array
    // let counter = 0;
    // console.log('codifiedUrl: ' + codifiedUrl.length);

    // 0 to first block;

    let shiftCounter = 0;
    let codifiedUrlListIndexCounter = 0;
    let unfinishedBusiness = false;

    let codifiedUrlList = [];
    let codifiedUrlListUnpack = {};

    // generate codifiedUrlList
    // 1. codifiedUrlList to first unblock
    // console.log('');
    // console.log('codifiedUrlListUnpack 1');
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
    // console.log('');
    // console.log('codifiedUrlListUnpack 2');
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
    // console.log("");
    // console.log('codifiedUrlListUnpack 3');
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
    // console.log("");
    // console.log('codifiedUrlListUnpack 4');
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

    while (currentIndex < codifiedUrlListlength) {

        let currentItem = codifiedUrlList[0];
        // console.log('current item: ' + currentItem);
        let countNumberOfTimesHere = 1;

        // console.log('String.fromCharCode(currentItem.charCodeAt(0) - 128)' + String.fromCharCode(currentItem.charCodeAt(0) - 128));

        if (currentItem.length == 1) {
            // console.log('currentItem.length == 1: ' + currentItem.length);
            // console.log('number of times here: ' + countNumberOfTimesHere);
            let c = String.fromCharCode(currentItem.charCodeAt(0) - 128);
            // console.log('b');
            codifiedUrlList.push(c);
            codifiedUrlList.shift();
        } else if (currentItem.length > 1) {
            // console.log('currentItem.length > 1: ' + currentItem.length)
            codifiedUrlList.shift();
        }

        currentIndex += 1;

    }

    codifiedUrlList.reverse();

    let returnValue = codifiedUrlList.join('');

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
) {
    // console.log('codifiedUrl: ' + codifiedUrl);
    // console.log('currentShiftCounterValue: ' + currentShiftCounterValue);
    // console.log('codifiedUrlListRecentValue: ' + codifiedUrlListRecentValue);
    // console.log('codifiedUrlListIndexCounter: ' + codifiedUrlListIndexCounter);
    // console.log('blockInFocusInputIndex: ' + blockInFocusInputIndex);
    // console.log('applyUnblock: ' + applyUnblock);
    // console.log('unfinishedBusinessBooleanValue: ' + unfinishedBusinessBooleanValue);

    // let shiftCounter = currentShiftCounterValue;
    // let codifiedUrlList = codifiedUrlListRecentValue;

    // obatining the length of the last item in codifiedUrlList if applicable..
    let isLastCodifiedUrlListItemsLengthAfterUnblockEqualToOne = false;
    let isLastCodifiedUrlListItemsLengthAfterUnblockGreaterThanOne = false;

    // if the current printing point is not the start of the codified url and codifiedUrlList has been populated to an unblocking,
    // check if the last unblocked item's (string) length is equal to 1.. useful after each unblock
    // console.log('isolate length 1');
    if (currentShiftCounterValue != 0 && codifiedUrlListRecentValue.length > 0) {

        // codifiedUrlListIndexCounter = codifiedUrlListIndexCounter - 1;

        // console.log('codifiedUrlListRecentValue length: ' + codifiedUrlListRecentValue.length);
        // console.log('codifiedUrlListIndexCounter: ' + codifiedUrlListIndexCounter);
        // console.log('Item at codifiedUrlListIndexCounter: ' + codifiedUrlListRecentValue[codifiedUrlListIndexCounter - 1]);
        // console.log('currentShiftCounterValue: ' + currentShiftCounterValue);
        // console.log('Item at currentShiftCounterValue: ' + codifiedUrl[currentShiftCounterValue]);

        // console.log('isolate length 2');
        let lengthOfLastItem = codifiedUrlListRecentValue[codifiedUrlListIndexCounter - 1].length;

        // console.log('isolate length 3');
        if (lengthOfLastItem == 1) {
            isLastCodifiedUrlListItemsLengthAfterUnblockEqualToOne = true;
            // isLastCodifiedUrlListItemsLengthAfterUnblockGreaterThanOne = false
        } else if (lengthOfLastItem > 1) {
            isLastCodifiedUrlListItemsLengthAfterUnblockGreaterThanOne = true;
            // isLastCodifiedUrlListItemsLengthAfterUnblockEqualToOne = false
        }
    }

    if (currentShiftCounterValue == 0 || (currentShiftCounterValue != 0 && isLastCodifiedUrlListItemsLengthAfterUnblockEqualToOne == true)) {

        while (codifiedUrlListIndexCounter < blockInFocusInputIndex && unfinishedBusinessBooleanValue == false) {

            // console.log('in equal to one');

            let tai = codifiedUrl[currentShiftCounterValue] + codifiedUrl[currentShiftCounterValue + 1] + codifiedUrl[currentShiftCounterValue + 2] + codifiedUrl[currentShiftCounterValue + 3];
            let c = codifiedUrl[currentShiftCounterValue + 4];

            if (codifiedUrlListIndexCounter == blockInFocusInputIndex) {
                unfinishedBusinessBooleanValue = true;
            }

            codifiedUrlListRecentValue.push(tai);
            codifiedUrlListIndexCounter += 1;
            currentShiftCounterValue += 4;

            if (codifiedUrlListIndexCounter != blockInFocusInputIndex) {
                codifiedUrlListRecentValue.push(c);
                codifiedUrlListIndexCounter += 1;
                currentShiftCounterValue += 1;
            } else {
                // currentShiftCounterValue += 1;
                unfinishedBusinessBooleanValue = true;
            }
        }
    } else if ((currentShiftCounterValue != 0 && isLastCodifiedUrlListItemsLengthAfterUnblockGreaterThanOne == true)) {

        while (codifiedUrlListIndexCounter < blockInFocusInputIndex && unfinishedBusinessBooleanValue == false) {

            // console.log('in greater than');

            let c = codifiedUrl[currentShiftCounterValue];
            let tai = codifiedUrl[currentShiftCounterValue + 1] + codifiedUrl[currentShiftCounterValue + 2] + codifiedUrl[currentShiftCounterValue + 3] + codifiedUrl[currentShiftCounterValue + 4];

            // if codifiedUrlListIndexCounter is same as blockInFocusInputIndex i.e prog has gotten to index of stoppage,
            // don't add the fourth sequence i.e the next index, rather signify that the fourth
            // sequence or the next index has not been added

            // console.log('codifiedUrlListIndexCounter: ' + codifiedUrlListIndexCounter);
            // console.log('blockInFocusInputIndex: ' + blockInFocusInputIndex);

            if (codifiedUrlListIndexCounter == blockInFocusInputIndex) {
                unfinishedBusinessBooleanValue = true;
            }

            codifiedUrlListRecentValue.push(c);
            codifiedUrlListIndexCounter += 1;
            currentShiftCounterValue += 1;

            if (codifiedUrlListIndexCounter != blockInFocusInputIndex) {
                codifiedUrlListRecentValue.push(tai);
                codifiedUrlListIndexCounter += 1;
                currentShiftCounterValue += 4;
            } else {
                // currentShiftCounterValue += 1;
                unfinishedBusinessBooleanValue = true;
            }

        }

        // console.log('codifiedUrlListIndexCounter: ' + codifiedUrlListIndexCounter);
        // console.log('blockInFocusInputIndex: ' + blockInFocusInputIndex);

    }

    // unblocking
    if (applyUnblock == true) {

        // first block to next start
        if (unfinishedBusinessBooleanValue == true) {
            // console.log('IN TRUE');
            // console.log('Pre Block Item shiftCounterValue: ' + codifiedUrl[currentShiftCounterValue - 1]);
            // console.log('Block identified at at shiftCounterValue: ' + codifiedUrl[currentShiftCounterValue]);
            // console.log('Post Block Item shiftCounterValue: ' + codifiedUrl[currentShiftCounterValue + 1]);
            // console.log('');

            // let currentShiftCounterValueTwo = currentShiftCounterValue;

            // let indexToStartFrom = codifiedUrlListIndexCounter;
            let doNum = 0;

            while (doNum < 5) {

                // console.log('codifiedUrlListRecentValue: ' + codifiedUrlListRecentValue);
                // console.log('codifiedUrlListRecentValueLength: ' + codifiedUrlListRecentValue.length);
                // console.log('isolate length 4');
                let lengthOfItemBeforeBlock = codifiedUrlListRecentValue[codifiedUrlListIndexCounter - 1].length;
                // console.log('isolate length 5');

                let block = codifiedUrl[currentShiftCounterValue];
                let next = '';

                if (lengthOfItemBeforeBlock > 1) {
                    next = codifiedUrl[currentShiftCounterValue + 1];
                    codifiedUrlListRecentValue.push(next);
                    codifiedUrlListIndexCounter += 1;
                    currentShiftCounterValue += 2; // next block sequence to be focused on..
                } else if (lengthOfItemBeforeBlock == 1) {
                    next = codifiedUrl[currentShiftCounterValue + 1] + codifiedUrl[currentShiftCounterValue + 2] + codifiedUrl[currentShiftCounterValue + 3] + codifiedUrl[currentShiftCounterValue + 4];
                    codifiedUrlListRecentValue.push(next);
                    codifiedUrlListIndexCounter += 1;
                    currentShiftCounterValue += 5;
                }

                doNum += 1;

            }

        } else if (unfinishedBusinessBooleanValue == false) {
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

            while (doNum < 5) {

                // console.log('codifiedUrlListRecentValue: ' + codifiedUrlListRecentValue);
                // console.log('codifiedUrlListRecentValueLength: ' + codifiedUrlListRecentValue.length);
                // console.log('isolate length 6');
                // console.log('index of item before block: ' + String(codifiedUrlListIndexCounter - 1));
                let lengthOfItemBeforeBlock = codifiedUrlListRecentValue[codifiedUrlListIndexCounter - 1].length;
                // console.log('isolate length 7');

                let block = codifiedUrl[currentShiftCounterValue];
                let next = '';

                if (lengthOfItemBeforeBlock == 1) {

                    next = codifiedUrl[currentShiftCounterValue + 1] + codifiedUrl[currentShiftCounterValue + 2] + codifiedUrl[currentShiftCounterValue + 3] + codifiedUrl[currentShiftCounterValue + 4];
                    codifiedUrlListRecentValue.push(next);
                    codifiedUrlListIndexCounter += 1;
                    currentShiftCounterValue += 5; // next block sequence to be focused on..

                } else if (lengthOfItemBeforeBlock > 1) {

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

// SORT DISPLAY -> MAIN GALLERY
// function SetGalleries(
// 	userInput,
// 	isMainGallery = true,
// 	isShowLinksMainGallery = true,
// 	isRecommendedGalleryForDesktop = true,
// 	isShowLinksRecommendedGallery = true,
//
// 	){
// 		// console.log('Got in Set Galleries');
//
// 	// console.log('isShowLinksMainGallery: ' + isShowLinksMainGallery);
//
// 	var currentProductCategory = $w('#dropdown3').value;
// 	var currentSortValue = $w('#dropdown5').value;
// 	var hideAmazonButtonValue = $w('#button2').label;
//
// 	// console.log('dropdown 3 value: ' + currentProductCategory);
//
// 	// console.log('hideAmazonButtonValue: ' + hideAmazonButtonValue);
//
// 	var gender = $w('#dropdown1').value;
//
// 	// setting recommended gallery
// 	if (isRecommendedGalleryForDesktop == true){
//
// 			// var productsInFocusSortedByRelevanceMobile = [];
// 			// var productsInFocusSortedByRelevanceDesktop = [];
//
// 			var productsInFocusSortedByRelevanceDesktop = orderProducts(recommendedForWomen, 'None', 3, isShowLinksRecommendedGallery);
//
// 			console.log('GOT HERE 1');
//
// 			$w('#recommendedForWomenGallery').items = productsInFocusSortedByRelevanceDesktop;
//
//
// 	}
// 	if (isMainGallery == true){
//
// 		// console.log('Got in MainGallery');
//
// 		// setting main gallery
// 		if (gender == 'Women'){
//
// 			// product categories that pertain to women
// 			if (currentProductCategory == 'Recommended'){
//
//
// 				// console.log('Calculated Recommended For Mobile');
//
// 				// console.log('within recommended:');
//
// 				// var productsInFocusSortedByRelevanceMobile = orderProducts(handbagsAndMoreWomen, 'HANDBAG', 2);
// 				// var productsInFocusSortedByRelevanceDesktop = orderProducts(handbagsAndMoreWomen, 'HANDBAG', 3);
//
// 				var productsInFocusSortedByRelevanceMobile = [];
// 				var productsInFocusSortedByRelevanceDesktop = [];
//
// 				if (hideAmazonButtonValue == 'Show Amazon Products'){
// 					// console.log('here hideAmazonButtonValue1start');
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(recommendedForWomenAmazonless, 'None', 3, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(recommendedForWomenAmazonless, 'None', 3, isShowLinksMainGallery);
// 					// console.log('here hideAmazonButtonValue1end');
// 				}
// 				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
// 					// console.log('here hideAmazonButtonValue2start');
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(recommendedForWomen, 'None', 3, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(recommendedForWomen, 'None', 3, isShowLinksMainGallery);
// 					// console.log('here hideAmazonButtonValue1end');
// 				}
//
// 				// console.log('recommended gallery length: ' + productsInFocusSortedByRelevanceMobile);
//
// 				// filtering by brand name or product name..
// 				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){
//
// 					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
// 					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
// 					&& !userInput.includes('\\') && !userInput.includes('=')
// 					&& !userInput.includes('==')){
//
// 						var itemCounter = 0;
// 						var productsListInFocus = [];
//
// 						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 							productsListInFocus = productsInFocusSortedByRelevanceMobile;
// 						}
// 						else if (wixWindow.formFactor === "Desktop"){
// 							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
// 						}
//
// 						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));
//
// 						while (itemCounter < lengthOfProductListInFocus){
//
//
// 							var currentItem = productsListInFocus[0];
//
// 							// console.log('currentItem: ' + currentItem);
// 							// console.log('itemCounter: ' + itemCounter);
//
//
// 							var currentItemsTitle = currentItem.title;
// 							var currentItemsLink = currentItem.link;
// 							// console.log('currentItemsLink: ' + currentItemsLink)
//
// 							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);
//
// 							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
// 							// console.log('productsListInFocus length: ' + productsListInFocus.length);
// 							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);
//
// 							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								productsListInFocus.push(currentItem);
// 								productsListInFocus.splice(0, 1);
//
// 								console.log(currentItemsLink + ' includes ' + userInput);
//
// 							}
//
// 							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								console.log(currentItemsLink + ' does not includes ' + userInput);
// 								productsListInFocus.splice(0, 1);
//
// 							}
//
// 							itemCounter += 1;
//
// 						}
//
// 						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
// 						// }
// 						// else if (wixWindow.formFactor === "Desktop"){
// 						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
// 						// }
//
// 						console.log(productsListInFocus.length);
//
//
// 						}
//
// 				}
//
//
// 				// fixing display by sort value
// 				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
//
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 						console.log('Calculated Recommended For Mobile - Relevance');
//
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
// 							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile; //
//
// 					}
//
//
// 					mainGalleryCopy = $w('#gallery1').items;
// 				}
// 				else if(wixWindow.formFactor === "Desktop"){
//
// 					if (currentSortValue == 'Relevance'){
// 						// if (isShowLinksMainGallery == true){
// 						// 	$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop; //
// 						// }
// 						// else{
// 						// 	$w('#gallery1').items = handbagsAndMoreWomen; //
// 						// }
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 				}
//
//
//
//
//
// 			}
//
// 			// product categories that pertain to women
// 			else if (currentProductCategory == 'Bags'){
//
// 				// var productsInFocusSortedByRelevanceMobile = orderProducts(handbagsAndMoreWomen, 'HANDBAG', 2);
// 				// var productsInFocusSortedByRelevanceDesktop = orderProducts(handbagsAndMoreWomen, 'HANDBAG', 3);
//
// 				var productsInFocusSortedByRelevanceMobile = [];
// 				var productsInFocusSortedByRelevanceDesktop = [];
//
// 				if (hideAmazonButtonValue == 'Show Amazon Products'){
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(handbagsAndMoreWomenAmazonless, 'HANDBAG', 2, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(handbagsAndMoreWomenAmazonless, 'HANDBAG', 3, isShowLinksMainGallery);
// 				}
// 				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(handbagsAndMoreWomen, 'HANDBAG', 2, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(handbagsAndMoreWomen, 'HANDBAG', 3, isShowLinksMainGallery);
// 				}
//
// 				// filtering by brand name or product name..
// 				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){
//
// 					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
// 					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
// 					&& !userInput.includes('\\') && !userInput.includes('=')
// 					&& !userInput.includes('==')){
//
// 						var itemCounter = 0;
// 						var productsListInFocus = [];
//
// 						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 							productsListInFocus = productsInFocusSortedByRelevanceMobile;
// 						}
// 						else if (wixWindow.formFactor === "Desktop"){
// 							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
// 						}
//
// 						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));
//
// 						while (itemCounter < lengthOfProductListInFocus){
//
//
// 							var currentItem = productsListInFocus[0];
//
// 							// console.log('currentItem: ' + currentItem);
// 							// console.log('itemCounter: ' + itemCounter);
//
//
// 							var currentItemsTitle = currentItem.title;
// 							var currentItemsLink = currentItem.link;
// 							// console.log('currentItemsLink: ' + currentItemsLink)
//
// 							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);
//
// 							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
// 							// console.log('productsListInFocus length: ' + productsListInFocus.length);
// 							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);
//
// 							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								productsListInFocus.push(currentItem);
// 								productsListInFocus.splice(0, 1);
//
// 								console.log(currentItemsLink + ' includes ' + userInput);
//
// 							}
//
// 							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								console.log(currentItemsLink + ' does not includes ' + userInput);
// 								productsListInFocus.splice(0, 1);
//
// 							}
//
// 							itemCounter += 1;
//
// 						}
//
// 						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
// 						// }
// 						// else if (wixWindow.formFactor === "Desktop"){
// 						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
// 						// }
//
// 						console.log(productsListInFocus.length);
//
//
// 						}
//
// 				}
//
//
// 				// fixing display by sort value
// 				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
//
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
// 							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile; //
// 					}
//
//
// 					mainGalleryCopy = $w('#gallery1').items;
// 				}
// 				else if(wixWindow.formFactor === "Desktop"){
//
// 					if (currentSortValue == 'Relevance'){
// 						// if (isShowLinksMainGallery == true){
// 						// 	$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop; //
// 						// }
// 						// else{
// 						// 	$w('#gallery1').items = handbagsAndMoreWomen; //
// 						// }
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 				}
//
//
//
//
//
// 			}
// 			else if (currentProductCategory == 'Shoes'){
//
// 				// var productsInFocusSortedByRelevanceMobile = orderProducts(handbagsAndMoreWomen, 'HANDBAG', 2);
// 				// var productsInFocusSortedByRelevanceDesktop = orderProducts(handbagsAndMoreWomen, 'HANDBAG', 3);
//
// 				var productsInFocusSortedByRelevanceMobile = [];
// 				var productsInFocusSortedByRelevanceDesktop = [];
//
// 				if (hideAmazonButtonValue == 'Show Amazon Products'){
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(shoesAndMoreWomenAmazonless, 'SHOE', 2, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(shoesAndMoreWomenAmazonless, 'SHOE', 3, isShowLinksMainGallery);
// 				}
// 				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(shoesAndMoreWomen, 'SHOE', 2, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(shoesAndMoreWomen, 'SHOE', 3, isShowLinksMainGallery);
// 				}
//
// 				// filtering by brand name or product name..
// 				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){
//
// 					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
// 					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
// 					&& !userInput.includes('\\') && !userInput.includes('=')
// 					&& !userInput.includes('==')){
//
// 						var itemCounter = 0;
// 						var productsListInFocus = [];
//
// 						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 							productsListInFocus = productsInFocusSortedByRelevanceMobile;
// 						}
// 						else if (wixWindow.formFactor === "Desktop"){
// 							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
// 						}
//
// 						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));
//
// 						while (itemCounter < lengthOfProductListInFocus){
//
//
// 							var currentItem = productsListInFocus[0];
//
// 							// console.log('currentItem: ' + currentItem);
// 							// console.log('itemCounter: ' + itemCounter);
//
//
// 							var currentItemsTitle = currentItem.title;
// 							var currentItemsLink = currentItem.link;
// 							// console.log('currentItemsLink: ' + currentItemsLink)
//
// 							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);
//
// 							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
// 							// console.log('productsListInFocus length: ' + productsListInFocus.length);
// 							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);
//
// 							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								productsListInFocus.push(currentItem);
// 								productsListInFocus.splice(0, 1);
//
// 								console.log(currentItemsLink + ' includes ' + userInput);
//
// 							}
//
// 							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								console.log(currentItemsLink + ' does not includes ' + userInput);
// 								productsListInFocus.splice(0, 1);
//
// 							}
//
// 							itemCounter += 1;
// 						}
//
// 						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
// 						// }
// 						// else if (wixWindow.formFactor === "Desktop"){
// 						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
// 						// }
//
// 						console.log(productsListInFocus.length);
//
//
// 						}
//
// 				}
//
//
// 				// fixing display by sort value
// 				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
//
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
// 							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile; //
// 					}
//
//
// 					mainGalleryCopy = $w('#gallery1').items;
// 				}
// 				else if(wixWindow.formFactor === "Desktop"){
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 				}
//
//
//
//
//
// 			}
// 			else if (currentProductCategory == 'Furnitures'){
//
// 				// var productsInFocusSortedByRelevanceMobile = orderProducts(furnituresMenAndWomen, 'FURNITURE', 2);
// 				// var productsInFocusSortedByRelevanceDesktop = orderProducts(furnituresMenAndWomen, 'FURNITURE', 2);
//
// 				var productsInFocusSortedByRelevanceMobile = [];
// 				var productsInFocusSortedByRelevanceDesktop = [];
//
// 				if (hideAmazonButtonValue == 'Show Amazon Products'){
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(furnituresMenAndWomenAmazonless, 'FURNITURE', 2, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(furnituresMenAndWomenAmazonless, 'FURNITURE', 2, isShowLinksMainGallery);
// 				}
// 				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(furnituresMenAndWomen, 'FURNITURE', 2, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(furnituresMenAndWomen, 'FURNITURE', 2, isShowLinksMainGallery);
// 				}
//
// 				// filtering by brand name or product name..
// 				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){
//
// 					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
// 					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
// 					&& !userInput.includes('\\') && !userInput.includes('=')
// 					&& !userInput.includes('==')){
//
// 						var itemCounter = 0;
// 						var productsListInFocus = [];
//
// 						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 							productsListInFocus = productsInFocusSortedByRelevanceMobile;
// 						}
// 						else if (wixWindow.formFactor === "Desktop"){
// 							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
// 						}
//
// 						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));
//
// 						while (itemCounter < lengthOfProductListInFocus){
//
//
// 							var currentItem = productsListInFocus[0];
//
// 							// console.log('currentItem: ' + currentItem);
// 							// console.log('itemCounter: ' + itemCounter);
//
//
// 							var currentItemsTitle = currentItem.title;
// 							var currentItemsLink = currentItem.link;
// 							// console.log('currentItemsLink: ' + currentItemsLink)
//
// 							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);
//
// 							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
// 							// console.log('productsListInFocus length: ' + productsListInFocus.length);
// 							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);
//
// 							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								productsListInFocus.push(currentItem);
// 								productsListInFocus.splice(0, 1);
//
// 								console.log(currentItemsLink + ' includes ' + userInput);
//
// 							}
//
// 							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								console.log(currentItemsLink + ' does not includes ' + userInput);
// 								productsListInFocus.splice(0, 1);
//
// 							}
//
// 							itemCounter += 1;
// 						}
//
// 						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
// 						// }
// 						// else if (wixWindow.formFactor === "Desktop"){
// 						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
// 						// }
//
// 						console.log(productsListInFocus.length);
//
//
// 						}
//
// 				}
//
//
// 				// fixing display by sort value
// 				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
//
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
// 							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
//
//
// 					mainGalleryCopy = $w('#gallery1').items;
// 				}
// 				else if(wixWindow.formFactor === "Desktop"){
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 				}
//
//
//
// 			}
// 			else if (currentProductCategory == 'Electronics'){
//
// 				// var productsInFocusSortedByRelevanceMobile = orderProducts(furnituresMenAndWomen, 'FURNITURE', 2);
// 				// var productsInFocusSortedByRelevanceDesktop = orderProducts(furnituresMenAndWomen, 'FURNITURE', 2);
//
// 				var productsInFocusSortedByRelevanceMobile = [];
// 				var productsInFocusSortedByRelevanceDesktop = [];
//
// 				if (hideAmazonButtonValue == 'Show Amazon Products'){
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(luxuryTechWomenAmazonless, '', 0, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(luxuryTechWomenAmazonless, '', 0, isShowLinksMainGallery);
// 				}
// 				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(luxuryTechWomen, '', 0, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(luxuryTechWomen, '', 0, isShowLinksMainGallery);
// 				}
//
// 				// filtering by brand name or product name..
// 				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){
//
// 					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
// 					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
// 					&& !userInput.includes('\\') && !userInput.includes('=')
// 					&& !userInput.includes('==')){
//
// 						var itemCounter = 0;
// 						var productsListInFocus = [];
//
// 						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 							productsListInFocus = productsInFocusSortedByRelevanceMobile;
// 						}
// 						else if (wixWindow.formFactor === "Desktop"){
// 							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
// 						}
//
// 						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));
//
// 						while (itemCounter < lengthOfProductListInFocus){
//
//
// 							var currentItem = productsListInFocus[0];
//
// 							// console.log('currentItem: ' + currentItem);
// 							// console.log('itemCounter: ' + itemCounter);
//
//
// 							var currentItemsTitle = currentItem.title;
// 							var currentItemsLink = currentItem.link;
// 							// console.log('currentItemsLink: ' + currentItemsLink)
//
// 							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);
//
// 							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
// 							// console.log('productsListInFocus length: ' + productsListInFocus.length);
// 							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);
//
// 							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								productsListInFocus.push(currentItem);
// 								productsListInFocus.splice(0, 1);
//
// 								console.log(currentItemsLink + ' includes ' + userInput);
//
// 							}
//
// 							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								console.log(currentItemsLink + ' does not includes ' + userInput);
// 								productsListInFocus.splice(0, 1);
//
// 							}
//
// 							itemCounter += 1;
// 						}
//
// 						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
// 						// }
// 						// else if (wixWindow.formFactor === "Desktop"){
// 						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
// 						// }
//
// 						console.log(productsListInFocus.length);
//
//
// 						}
//
// 				}
//
//
// 				// fixing display by sort value
// 				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
//
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
// 							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
//
//
// 					mainGalleryCopy = $w('#gallery1').items;
// 				}
// 				else if(wixWindow.formFactor === "Desktop"){
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 				}
//
//
//
// 			}
// 			else if (currentProductCategory == 'Clothes'){
//
// 				// var productsInFocusSortedByRelevanceMobile = orderProducts(clothesAndPerfumesWomen, 'CLOTHING', 2, isShowLinksMainGallery);
// 				// var productsInFocusSortedByRelevanceDesktop = orderProducts(clothesAndPerfumesWomen, 'CLOTHING', 3, isShowLinksMainGallery);
//
// 				var productsInFocusSortedByRelevanceMobile = [];
// 				var productsInFocusSortedByRelevanceDesktop = [];
//
// 				if (hideAmazonButtonValue == 'Show Amazon Products'){
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(clothesAndPerfumesWomenAmazonless, 'CLOTHING', 2, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(clothesAndPerfumesWomenAmazonless, 'CLOTHING', 3, isShowLinksMainGallery);
// 				}
// 				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(clothesAndPerfumesWomen, 'CLOTHING', 2, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(clothesAndPerfumesWomen, 'CLOTHING', 3, isShowLinksMainGallery);
// 				}
//
// 				// filtering by brand name or product name..
// 				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){
//
// 					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
// 					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
// 					&& !userInput.includes('\\') && !userInput.includes('=')
// 					&& !userInput.includes('==')){
//
// 						var itemCounter = 0;
// 						var productsListInFocus = [];
//
// 						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 							productsListInFocus = productsInFocusSortedByRelevanceMobile;
// 						}
// 						else if (wixWindow.formFactor === "Desktop"){
// 							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
// 						}
//
// 						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));
//
// 						while (itemCounter < lengthOfProductListInFocus){
//
//
// 							var currentItem = productsListInFocus[0];
//
// 							// console.log('currentItem: ' + currentItem);
// 							// console.log('itemCounter: ' + itemCounter);
//
//
// 							var currentItemsTitle = currentItem.title;
// 							var currentItemsLink = currentItem.link;
// 							// console.log('currentItemsLink: ' + currentItemsLink)
//
// 							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);
//
// 							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
// 							// console.log('productsListInFocus length: ' + productsListInFocus.length);
// 							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);
//
// 							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								productsListInFocus.push(currentItem);
// 								productsListInFocus.splice(0, 1);
//
// 								console.log(currentItemsLink + ' includes ' + userInput);
//
// 							}
//
// 							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								console.log(currentItemsLink + ' does not includes ' + userInput);
// 								productsListInFocus.splice(0, 1);
//
// 							}
//
// 							itemCounter += 1;
// 						}
//
// 						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
// 						// }
// 						// else if (wixWindow.formFactor === "Desktop"){
// 						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
// 						// }
//
// 						console.log(productsListInFocus.length);
//
//
// 						}
//
// 				}
//
//
// 				// fixing display by sort value
// 				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
//
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
// 							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
//
//
// 					mainGalleryCopy = $w('#gallery1').items;
// 				}
// 				else if(wixWindow.formFactor === "Desktop"){
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 				}
//
//
// 			}
// 			else if (currentProductCategory == 'Rings'){
//
// 				// var productsInFocusSortedByRelevanceMobile = orderProducts(flowersAndRingsWomen, 'RING', 2, isShowLinksMainGallery);
// 				// var productsInFocusSortedByRelevanceDesktop = orderProducts(flowersAndRingsWomen, 'RING', 3, isShowLinksMainGallery);
//
// 				var productsInFocusSortedByRelevanceMobile = [];
// 				var productsInFocusSortedByRelevanceDesktop = [];
//
// 				if (hideAmazonButtonValue == 'Show Amazon Products'){
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(flowersAndRingsWomenAmazonless, 'RING', 2, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(flowersAndRingsWomenAmazonless, 'RING', 3, isShowLinksMainGallery);
// 				}
// 				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(flowersAndRingsWomen, 'RING', 2, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(flowersAndRingsWomen, 'RING', 3, isShowLinksMainGallery);
// 				}
//
// 				// filtering by brand name or product name..
// 				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){
//
// 					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
// 					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
// 					&& !userInput.includes('\\') && !userInput.includes('=')
// 					&& !userInput.includes('==')){
//
// 						var itemCounter = 0;
// 						var productsListInFocus = [];
//
// 						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 							productsListInFocus = productsInFocusSortedByRelevanceMobile;
// 						}
// 						else if (wixWindow.formFactor === "Desktop"){
// 							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
// 						}
//
// 						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));
//
// 						while (itemCounter < lengthOfProductListInFocus){
//
//
// 							var currentItem = productsListInFocus[0];
//
// 							// console.log('currentItem: ' + currentItem);
// 							// console.log('itemCounter: ' + itemCounter);
//
//
// 							var currentItemsTitle = currentItem.title;
// 							var currentItemsLink = currentItem.link;
// 							// console.log('currentItemsLink: ' + currentItemsLink)
//
// 							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);
//
// 							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
// 							// console.log('productsListInFocus length: ' + productsListInFocus.length);
// 							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);
//
// 							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								productsListInFocus.push(currentItem);
// 								productsListInFocus.splice(0, 1);
//
// 								console.log(currentItemsLink + ' includes ' + userInput);
//
// 							}
//
// 							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								console.log(currentItemsLink + ' does not includes ' + userInput);
// 								productsListInFocus.splice(0, 1);
//
// 							}
//
// 							itemCounter += 1;
// 						}
//
// 						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
// 						// }
// 						// else if (wixWindow.formFactor === "Desktop"){
// 						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
// 						// }
//
// 						console.log(productsListInFocus.length);
//
//
// 						}
//
// 				}
//
//
// 				// fixing display by sort value
// 				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
//
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
// 							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
//
//
// 					mainGalleryCopy = $w('#gallery1').items;
// 				}
// 				else if(wixWindow.formFactor === "Desktop"){
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 				}
//
// 			}
// 			else if (currentProductCategory == 'Travel Bags & Other Bags'){
//
// 				// var productsInFocusSortedByRelevanceMobile = orderProducts(travelBagsAndOtherBagsWomen, 'TRAVEL BAG', 2);
// 				// var productsInFocusSortedByRelevanceDesktop = orderProducts(travelBagsAndOtherBagsWomen, 'TRAVEL BAG', 3);
//
// 				var productsInFocusSortedByRelevanceMobile = [];
// 				var productsInFocusSortedByRelevanceDesktop = [];
//
// 				if (hideAmazonButtonValue == 'Show Amazon Products'){
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(travelBagsAndOtherBagsWomenAmazonless, 'TRAVEL BAG', 2, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(travelBagsAndOtherBagsWomenAmazonless, 'TRAVEL BAG', 3, isShowLinksMainGallery);
// 				}
// 				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(travelBagsAndOtherBagsWomen, 'TRAVEL BAG', 2, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(travelBagsAndOtherBagsWomen, 'TRAVEL BAG', 3, isShowLinksMainGallery);
// 				}
//
// 				// filtering by brand name or product name..
// 				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){
//
// 					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
// 					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
// 					&& !userInput.includes('\\') && !userInput.includes('=')
// 					&& !userInput.includes('==')){
//
// 						var itemCounter = 0;
// 						var productsListInFocus = [];
//
// 						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 							productsListInFocus = productsInFocusSortedByRelevanceMobile;
// 						}
// 						else if (wixWindow.formFactor === "Desktop"){
// 							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
// 						}
//
// 						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));
//
// 						while (itemCounter < lengthOfProductListInFocus){
//
//
// 							var currentItem = productsListInFocus[0];
//
// 							// console.log('currentItem: ' + currentItem);
// 							// console.log('itemCounter: ' + itemCounter);
//
//
// 							var currentItemsTitle = currentItem.title;
// 							var currentItemsLink = currentItem.link;
// 							// console.log('currentItemsLink: ' + currentItemsLink)
//
// 							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);
//
// 							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
// 							// console.log('productsListInFocus length: ' + productsListInFocus.length);
// 							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);
//
// 							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								productsListInFocus.push(currentItem);
// 								productsListInFocus.splice(0, 1);
//
// 								console.log(currentItemsLink + ' includes ' + userInput);
//
// 							}
//
// 							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								console.log(currentItemsLink + ' does not includes ' + userInput);
// 								productsListInFocus.splice(0, 1);
//
// 							}
//
// 							itemCounter += 1;
// 						}
//
// 						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
// 						// }
// 						// else if (wixWindow.formFactor === "Desktop"){
// 						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
// 						// }
//
// 						console.log(productsListInFocus.length);
//
//
// 						}
//
// 				}
//
//
// 				// fixing display by sort value
// 				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
//
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
// 							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
//
//
// 					mainGalleryCopy = $w('#gallery1').items;
// 				}
// 				else if(wixWindow.formFactor === "Desktop"){
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 				}
//
// 			}
// 			else if (currentProductCategory == 'Other Accessories'){
//
// 				// var productsInFocusSortedByRelevanceMobile = orderProducts(otherAccessoriesWomen, 'ACCESSORIES', 2);
// 				// var productsInFocusSortedByRelevanceDesktop = orderProducts(otherAccessoriesWomen, 'ACCESSORIES', 3);
//
// 				var productsInFocusSortedByRelevanceMobile = [];
// 				var productsInFocusSortedByRelevanceDesktop = [];
//
// 				if (hideAmazonButtonValue == 'Show Amazon Products'){
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(otherAccessoriesWomenAmazonless, 'ACCESSORIES', 2, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(otherAccessoriesWomenAmazonless, 'ACCESSORIES', 3, isShowLinksMainGallery);
// 				}
// 				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(otherAccessoriesWomen, 'ACCESSORIES', 2, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(otherAccessoriesWomen, 'ACCESSORIES', 3, isShowLinksMainGallery);
// 				}
//
// 				// filtering by brand name or product name..
// 				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){
//
// 					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
// 					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
// 					&& !userInput.includes('\\') && !userInput.includes('=')
// 					&& !userInput.includes('==')){
//
// 						var itemCounter = 0;
// 						var productsListInFocus = [];
//
// 						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 							productsListInFocus = productsInFocusSortedByRelevanceMobile;
// 						}
// 						else if (wixWindow.formFactor === "Desktop"){
// 							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
// 						}
//
// 						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));
//
// 						while (itemCounter < lengthOfProductListInFocus){
//
//
// 							var currentItem = productsListInFocus[0];
//
// 							// console.log('currentItem: ' + currentItem);
// 							// console.log('itemCounter: ' + itemCounter);
//
//
// 							var currentItemsTitle = currentItem.title;
// 							var currentItemsLink = currentItem.link;
// 							// console.log('currentItemsLink: ' + currentItemsLink)
//
// 							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);
//
// 							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
// 							// console.log('productsListInFocus length: ' + productsListInFocus.length);
// 							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);
//
// 							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								productsListInFocus.push(currentItem);
// 								productsListInFocus.splice(0, 1);
//
// 								console.log(currentItemsLink + ' includes ' + userInput);
//
// 							}
//
// 							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								console.log(currentItemsLink + ' does not includes ' + userInput);
// 								productsListInFocus.splice(0, 1);
//
// 							}
//
// 							itemCounter += 1;
// 						}
//
// 						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
// 						// }
// 						// else if (wixWindow.formFactor === "Desktop"){
// 						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
// 						// }
//
// 						console.log(productsListInFocus.length);
//
//
// 						}
//
// 				}
//
//
// 				// fixing display by sort value
// 				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
//
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
// 							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
//
//
// 					mainGalleryCopy = $w('#gallery1').items;
// 				}
// 				else if(wixWindow.formFactor === "Desktop"){
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
//
// 				}
//
//
//
// 			}
// 			else if (currentProductCategory == 'Gifts For Him'){
//
// 				// var productsInFocusSortedByRelevanceMobile = orderProducts(giftsForHim, 'WATCHES', 2);
// 				// var productsInFocusSortedByRelevanceDesktop = orderProducts(giftsForHim, 'WATCHES', 3);
//
// 				var productsInFocusSortedByRelevanceMobile = [];
// 				var productsInFocusSortedByRelevanceDesktop = [];
//
// 				if (hideAmazonButtonValue == 'Show Amazon Products'){
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(giftsForHimAmazonless, 'WATCHES', 2, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(giftsForHimAmazonless, 'WATCHES', 3, isShowLinksMainGallery);
// 				}
// 				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
// 					console.log('in gifts for him amazon');
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(giftsForHim, 'WATCHES', 2, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(giftsForHim, 'WATCHES', 3, isShowLinksMainGallery);
// 				}
//
// 				// filtering by brand name or product name..
// 				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){
//
// 					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
// 					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
// 					&& !userInput.includes('\\') && !userInput.includes('=')
// 					&& !userInput.includes('==')){
//
// 						var itemCounter = 0;
// 						var productsListInFocus = [];
//
// 						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 							productsListInFocus = productsInFocusSortedByRelevanceMobile;
// 						}
// 						else if (wixWindow.formFactor === "Desktop"){
// 							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
// 						}
//
// 						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));
//
// 						while (itemCounter < lengthOfProductListInFocus){
//
//
// 							var currentItem = productsListInFocus[0];
//
// 							// console.log('currentItem: ' + currentItem);
// 							// console.log('itemCounter: ' + itemCounter);
//
//
// 							var currentItemsTitle = currentItem.title;
// 							var currentItemsLink = currentItem.link;
// 							// console.log('currentItemsLink: ' + currentItemsLink)
//
// 							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);
//
// 							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
// 							// console.log('productsListInFocus length: ' + productsListInFocus.length);
// 							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);
//
// 							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								productsListInFocus.push(currentItem);
// 								productsListInFocus.splice(0, 1);
//
// 								console.log(currentItemsLink + ' includes ' + userInput);
//
// 							}
//
// 							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								console.log(currentItemsLink + ' does not includes ' + userInput);
// 								productsListInFocus.splice(0, 1);
//
// 							}
//
// 							itemCounter += 1;
// 						}
//
// 						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
// 						// }
// 						// else if (wixWindow.formFactor === "Desktop"){
// 						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
// 						// }
//
// 						console.log(productsListInFocus.length);
//
//
// 						}
//
// 				}
//
//
// 				// fixing display by sort value
// 				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
//
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
// 							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
//
//
// 					mainGalleryCopy = $w('#gallery1').items;
// 				}
// 				else if(wixWindow.formFactor === "Desktop"){
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 				}
//
//
// 			}
// 		}
//
// 		else if (gender == 'Men'){
//
// 			if (currentProductCategory == 'Shoes & Watches'){
//
// 				// var productsInFocusSortedByRelevanceMobile = orderProducts(shoesAndWatchesMen, 'SHOE', 1);
// 				// var productsInFocusSortedByRelevanceDesktop = orderProducts(shoesAndWatchesMen, 'SHOE', 1);
//
// 				var productsInFocusSortedByRelevanceMobile = [];
// 				var productsInFocusSortedByRelevanceDesktop = [];
//
// 				if (hideAmazonButtonValue == 'Show Amazon Products'){
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(shoesAndWatchesMenAmazonless, 'SHOE', 1, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(shoesAndWatchesMenAmazonless, 'SHOE', 1, isShowLinksMainGallery);
// 				}
// 				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(shoesAndWatchesMen, 'SHOE', 1, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(shoesAndWatchesMen, 'SHOE', 1, isShowLinksMainGallery);
// 				}
//
// 				// filtering by brand name or product name..
// 				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){
//
// 					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
// 					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
// 					&& !userInput.includes('\\') && !userInput.includes('=')
// 					&& !userInput.includes('==')){
//
// 						var itemCounter = 0;
// 						var productsListInFocus = [];
//
// 						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 							productsListInFocus = productsInFocusSortedByRelevanceMobile;
// 						}
// 						else if (wixWindow.formFactor === "Desktop"){
// 							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
// 						}
//
// 						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));
//
// 						while (itemCounter < lengthOfProductListInFocus){
//
//
// 							var currentItem = productsListInFocus[0];
//
// 							// console.log('currentItem: ' + currentItem);
// 							// console.log('itemCounter: ' + itemCounter);
//
//
// 							var currentItemsTitle = currentItem.title;
// 							var currentItemsLink = currentItem.link;
// 							// console.log('currentItemsLink: ' + currentItemsLink)
//
// 							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);
//
// 							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
// 							// console.log('productsListInFocus length: ' + productsListInFocus.length);
// 							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);
//
// 							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								productsListInFocus.push(currentItem);
// 								productsListInFocus.splice(0, 1);
//
// 								console.log(currentItemsLink + ' includes ' + userInput);
//
// 							}
//
// 							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								console.log(currentItemsLink + ' does not includes ' + userInput);
// 								productsListInFocus.splice(0, 1);
//
// 							}
//
// 							itemCounter += 1;
// 						}
//
// 						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
// 						// }
// 						// else if (wixWindow.formFactor === "Desktop"){
// 						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
// 						// }
//
// 						console.log(productsListInFocus.length);
//
//
// 						}
//
// 				}
//
//
// 				// fixing display by sort value
// 				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
//
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
// 							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
//
//
// 					mainGalleryCopy = $w('#gallery1').items;
// 				}
// 				else if(wixWindow.formFactor === "Desktop"){
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 				}
//
// 			}
// 			else if (currentProductCategory == 'Necklaces & Bracelets'){
//
//
// 				// var productsInFocusSortedByRelevanceMobile = orderProducts(necklacesAndBraceletsMen, 'NECKLACE', 2);
// 				// var productsInFocusSortedByRelevanceDesktop = orderProducts(necklacesAndBraceletsMen, 'NECKLACE', 3);
//
// 				var productsInFocusSortedByRelevanceMobile = [];
// 				var productsInFocusSortedByRelevanceDesktop = [];
//
// 				if (hideAmazonButtonValue == 'Show Amazon Products'){
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(necklacesAndBraceletsMenAmazonless, 'NECKLACE', 2, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(necklacesAndBraceletsMenAmazonless, 'NECKLACE', 3, isShowLinksMainGallery);
// 				}
// 				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(necklacesAndBraceletsMen, 'NECKLACE', 2, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(necklacesAndBraceletsMen, 'NECKLACE', 3, isShowLinksMainGallery);
// 				}
//
// 				// filtering by brand name or product name..
// 				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){
//
// 					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
// 					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
// 					&& !userInput.includes('\\') && !userInput.includes('=')
// 					&& !userInput.includes('==')){
//
// 						var itemCounter = 0;
// 						var productsListInFocus = [];
//
// 						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 							productsListInFocus = productsInFocusSortedByRelevanceMobile;
// 						}
// 						else if (wixWindow.formFactor === "Desktop"){
// 							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
// 						}
//
// 						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));
//
// 						while (itemCounter < lengthOfProductListInFocus){
//
//
// 							var currentItem = productsListInFocus[0];
//
// 							// console.log('currentItem: ' + currentItem);
// 							// console.log('itemCounter: ' + itemCounter);
//
//
// 							var currentItemsTitle = currentItem.title;
// 							var currentItemsLink = currentItem.link;
// 							// console.log('currentItemsLink: ' + currentItemsLink)
//
// 							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);
//
// 							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
// 							// console.log('productsListInFocus length: ' + productsListInFocus.length);
// 							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);
//
// 							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								productsListInFocus.push(currentItem);
// 								productsListInFocus.splice(0, 1);
//
// 								console.log(currentItemsLink + ' includes ' + userInput);
//
// 							}
//
// 							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								console.log(currentItemsLink + ' does not includes ' + userInput);
// 								productsListInFocus.splice(0, 1);
//
// 							}
//
// 							itemCounter += 1;
// 						}
//
// 						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
// 						// }
// 						// else if (wixWindow.formFactor === "Desktop"){
// 						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
// 						// }
//
// 						console.log(productsListInFocus.length);
//
//
// 						}
//
// 				}
//
//
// 				// fixing display by sort value
// 				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
//
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
// 							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
//
//
// 					mainGalleryCopy = $w('#gallery1').items;
// 				}
// 				else if(wixWindow.formFactor === "Desktop"){
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 				}
//
//
// 			}
// 			else if (currentProductCategory == 'Furnitures'){
//
// 				// var productsInFocusSortedByRelevanceMobile = orderProducts(furnituresMenAndWomen, 'FURNITURE', 2);
// 				// var productsInFocusSortedByRelevanceDesktop = orderProducts(furnituresMenAndWomen, 'FURNITURE', 3);
//
// 				var productsInFocusSortedByRelevanceMobile = [];
// 				var productsInFocusSortedByRelevanceDesktop = [];
//
// 				if (hideAmazonButtonValue == 'Show Amazon Products'){
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(furnituresMenAndWomenAmazonless, 'FURNITURE', 2, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(furnituresMenAndWomenAmazonless, 'FURNITURE', 3, isShowLinksMainGallery);
// 				}
// 				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(furnituresMenAndWomen, 'FURNITURE', 2, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(furnituresMenAndWomen, 'FURNITURE', 3, isShowLinksMainGallery);
// 				}
//
// 				// filtering by brand name or product name..
// 				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){
//
// 					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
// 					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
// 					&& !userInput.includes('\\') && !userInput.includes('=')
// 					&& !userInput.includes('==')){
//
// 						var itemCounter = 0;
// 						var productsListInFocus = [];
//
// 						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 							productsListInFocus = productsInFocusSortedByRelevanceMobile;
// 						}
// 						else if (wixWindow.formFactor === "Desktop"){
// 							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
// 						}
//
// 						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));
//
// 						while (itemCounter < lengthOfProductListInFocus){
//
//
// 							var currentItem = productsListInFocus[0];
//
// 							// console.log('currentItem: ' + currentItem);
// 							// console.log('itemCounter: ' + itemCounter);
//
//
// 							var currentItemsTitle = currentItem.title;
// 							var currentItemsLink = currentItem.link;
// 							// console.log('currentItemsLink: ' + currentItemsLink)
//
// 							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);
//
// 							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
// 							// console.log('productsListInFocus length: ' + productsListInFocus.length);
// 							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);
//
// 							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								productsListInFocus.push(currentItem);
// 								productsListInFocus.splice(0, 1);
//
// 								console.log(currentItemsLink + ' includes ' + userInput);
//
// 							}
//
// 							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								console.log(currentItemsLink + ' does not includes ' + userInput);
// 								productsListInFocus.splice(0, 1);
//
// 							}
//
// 							itemCounter += 1;
// 						}
//
// 						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
// 						// }
// 						// else if (wixWindow.formFactor === "Desktop"){
// 						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
// 						// }
//
// 						console.log(productsListInFocus.length);
//
//
// 						}
//
// 				}
//
//
// 				// fixing display by sort value
// 				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
//
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
// 							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
//
//
// 					mainGalleryCopy = $w('#gallery1').items;
// 				}
// 				else if(wixWindow.formFactor === "Desktop"){
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 				}
// 			}
// 			else if (currentProductCategory == 'Electronics'){
//
// 				// var productsInFocusSortedByRelevanceMobile = orderProducts(furnituresMenAndWomen, 'FURNITURE', 2);
// 				// var productsInFocusSortedByRelevanceDesktop = orderProducts(furnituresMenAndWomen, 'FURNITURE', 3);
//
// 				var productsInFocusSortedByRelevanceMobile = [];
// 				var productsInFocusSortedByRelevanceDesktop = [];
//
// 				if (hideAmazonButtonValue == 'Show Amazon Products'){
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(luxuryTechMenAmazonless, '', 0, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(luxuryTechMenAmazonless, '', 0, isShowLinksMainGallery);
// 				}
// 				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(luxuryTechMen, '', 0, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(luxuryTechMen, '', 0, isShowLinksMainGallery);
// 				}
//
// 				// filtering by brand name or product name..
// 				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){
//
// 					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
// 					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
// 					&& !userInput.includes('\\') && !userInput.includes('=')
// 					&& !userInput.includes('==')){
//
// 						var itemCounter = 0;
// 						var productsListInFocus = [];
//
// 						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 							productsListInFocus = productsInFocusSortedByRelevanceMobile;
// 						}
// 						else if (wixWindow.formFactor === "Desktop"){
// 							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
// 						}
//
// 						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));
//
// 						while (itemCounter < lengthOfProductListInFocus){
//
//
// 							var currentItem = productsListInFocus[0];
//
// 							// console.log('currentItem: ' + currentItem);
// 							// console.log('itemCounter: ' + itemCounter);
//
//
// 							var currentItemsTitle = currentItem.title;
// 							var currentItemsLink = currentItem.link;
// 							// console.log('currentItemsLink: ' + currentItemsLink)
//
// 							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);
//
// 							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
// 							// console.log('productsListInFocus length: ' + productsListInFocus.length);
// 							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);
//
// 							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								productsListInFocus.push(currentItem);
// 								productsListInFocus.splice(0, 1);
//
// 								console.log(currentItemsLink + ' includes ' + userInput);
//
// 							}
//
// 							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								console.log(currentItemsLink + ' does not includes ' + userInput);
// 								productsListInFocus.splice(0, 1);
//
// 							}
//
// 							itemCounter += 1;
// 						}
//
// 						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
// 						// }
// 						// else if (wixWindow.formFactor === "Desktop"){
// 						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
// 						// }
//
// 						console.log(productsListInFocus.length);
//
//
// 						}
//
// 				}
//
//
// 				// fixing display by sort value
// 				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
//
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
// 							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
//
//
// 					mainGalleryCopy = $w('#gallery1').items;
// 				}
// 				else if(wixWindow.formFactor === "Desktop"){
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 				}
// 			}
// 			else if (currentProductCategory == 'Clothes'){
//
// 				// var productsInFocusSortedByRelevanceMobile = orderProducts(clothesAndPerfumesMen, 'CLOTHING', 2);
// 				// var productsInFocusSortedByRelevanceDesktop = orderProducts(clothesAndPerfumesMen, 'CLOTHING', 3);
//
// 				var productsInFocusSortedByRelevanceMobile = [];
// 				var productsInFocusSortedByRelevanceDesktop = [];
//
// 				if (hideAmazonButtonValue == 'Show Amazon Products'){
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(clothesAndPerfumesMenAmazonless, 'CLOTHING', 2, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(clothesAndPerfumesMenAmazonless, 'CLOTHING', 3, isShowLinksMainGallery);
// 				}
// 				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(clothesAndPerfumesMen, 'CLOTHING', 2, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(clothesAndPerfumesMen, 'CLOTHING', 3, isShowLinksMainGallery);
// 				}
//
// 				// filtering by brand name or product name..
// 				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){
//
// 					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
// 					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
// 					&& !userInput.includes('\\') && !userInput.includes('=')
// 					&& !userInput.includes('==')){
//
// 						var itemCounter = 0;
// 						var productsListInFocus = [];
//
// 						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 							productsListInFocus = productsInFocusSortedByRelevanceMobile;
// 						}
// 						else if (wixWindow.formFactor === "Desktop"){
// 							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
// 						}
//
// 						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));
//
// 						while (itemCounter < lengthOfProductListInFocus){
//
//
// 							var currentItem = productsListInFocus[0];
//
// 							// console.log('currentItem: ' + currentItem);
// 							// console.log('itemCounter: ' + itemCounter);
//
//
// 							var currentItemsTitle = currentItem.title;
// 							var currentItemsLink = currentItem.link;
// 							// console.log('currentItemsLink: ' + currentItemsLink)
//
// 							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);
//
// 							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
// 							// console.log('productsListInFocus length: ' + productsListInFocus.length);
// 							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);
//
// 							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								productsListInFocus.push(currentItem);
// 								productsListInFocus.splice(0, 1);
//
// 								console.log(currentItemsLink + ' includes ' + userInput);
//
// 							}
//
// 							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								console.log(currentItemsLink + ' does not includes ' + userInput);
// 								productsListInFocus.splice(0, 1);
//
// 							}
//
// 							itemCounter += 1;
// 						}
//
// 						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
// 						// }
// 						// else if (wixWindow.formFactor === "Desktop"){
// 						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
// 						// }
//
// 						console.log(productsListInFocus.length);
//
//
// 						}
//
// 				}
//
//
// 				// fixing display by sort value
// 				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
//
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
// 							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
//
//
// 					mainGalleryCopy = $w('#gallery1').items;
// 				}
// 				else if(wixWindow.formFactor === "Desktop"){
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 				}
// 			}
// 			else if (currentProductCategory == 'Rings'){
//
// 				// var productsInFocusSortedByRelevanceMobile = orderProducts(flowersAndRingsMen, 'RING', 2);
// 				// var productsInFocusSortedByRelevanceDesktop = orderProducts(flowersAndRingsMen, 'RING', 3);
//
// 				var productsInFocusSortedByRelevanceMobile = [];
// 				var productsInFocusSortedByRelevanceDesktop = [];
//
// 				if (hideAmazonButtonValue == 'Show Amazon Products'){
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(flowersAndRingsMenAmazonless, 'RING', 2, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(flowersAndRingsMenAmazonless, 'RING', 3, isShowLinksMainGallery);
// 				}
// 				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(flowersAndRingsMen, 'RING', 2, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(flowersAndRingsMen, 'RING', 3, isShowLinksMainGallery);
// 				}
//
// 				// filtering by brand name or product name..
// 				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){
//
// 					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
// 					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
// 					&& !userInput.includes('\\') && !userInput.includes('=')
// 					&& !userInput.includes('==')){
//
// 						var itemCounter = 0;
// 						var productsListInFocus = [];
//
// 						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 							productsListInFocus = productsInFocusSortedByRelevanceMobile;
// 						}
// 						else if (wixWindow.formFactor === "Desktop"){
// 							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
// 						}
//
// 						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));
//
// 						while (itemCounter < lengthOfProductListInFocus){
//
//
// 							var currentItem = productsListInFocus[0];
//
// 							// console.log('currentItem: ' + currentItem);
// 							// console.log('itemCounter: ' + itemCounter);
//
//
// 							var currentItemsTitle = currentItem.title;
// 							var currentItemsLink = currentItem.link;
// 							// console.log('currentItemsLink: ' + currentItemsLink)
//
// 							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);
//
// 							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
// 							// console.log('productsListInFocus length: ' + productsListInFocus.length);
// 							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);
//
// 							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								productsListInFocus.push(currentItem);
// 								productsListInFocus.splice(0, 1);
//
// 								console.log(currentItemsLink + ' includes ' + userInput);
//
// 							}
//
// 							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								console.log(currentItemsLink + ' does not includes ' + userInput);
// 								productsListInFocus.splice(0, 1);
//
// 							}
//
// 							itemCounter += 1;
// 						}
//
// 						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
// 						// }
// 						// else if (wixWindow.formFactor === "Desktop"){
// 						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
// 						// }
//
// 						console.log(productsListInFocus.length);
//
//
// 						}
//
// 				}
//
//
// 				// fixing display by sort value
// 				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
//
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
// 							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
//
//
// 					mainGalleryCopy = $w('#gallery1').items;
// 				}
// 				else if(wixWindow.formFactor === "Desktop"){
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 				}
// 			}
// 			else if (currentProductCategory == 'Travel Bags & Other Bags'){
//
// 				// var productsInFocusSortedByRelevanceMobile = orderProducts(travelBagsAndOtherBagsMen, 'TRAVEL BAG', 2);
// 				// var productsInFocusSortedByRelevanceDesktop = orderProducts(travelBagsAndOtherBagsMen, 'TRAVEL BAG', 3);
//
// 				var productsInFocusSortedByRelevanceMobile = [];
// 				var productsInFocusSortedByRelevanceDesktop = [];
//
// 				if (hideAmazonButtonValue == 'Show Amazon Products'){
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(travelBagsAndOtherBagsMenAmazonless, 'TRAVEL BAG', 2, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(travelBagsAndOtherBagsMenAmazonless, 'TRAVEL BAG', 3, isShowLinksMainGallery);
// 				}
// 				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(travelBagsAndOtherBagsMen, 'TRAVEL BAG', 2, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(travelBagsAndOtherBagsMen, 'TRAVEL BAG', 3, isShowLinksMainGallery);
// 				}
//
// 				// filtering by brand name or product name..
// 				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){
//
// 					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
// 					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
// 					&& !userInput.includes('\\') && !userInput.includes('=')
// 					&& !userInput.includes('==')){
//
// 						var itemCounter = 0;
// 						var productsListInFocus = [];
//
// 						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 							productsListInFocus = productsInFocusSortedByRelevanceMobile;
// 						}
// 						else if (wixWindow.formFactor === "Desktop"){
// 							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
// 						}
//
// 						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));
//
// 						while (itemCounter < lengthOfProductListInFocus){
//
//
// 							var currentItem = productsListInFocus[0];
//
// 							// console.log('currentItem: ' + currentItem);
// 							// console.log('itemCounter: ' + itemCounter);
//
//
// 							var currentItemsTitle = currentItem.title;
// 							var currentItemsLink = currentItem.link;
// 							// console.log('currentItemsLink: ' + currentItemsLink)
//
// 							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);
//
// 							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
// 							// console.log('productsListInFocus length: ' + productsListInFocus.length);
// 							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);
//
// 							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								productsListInFocus.push(currentItem);
// 								productsListInFocus.splice(0, 1);
//
// 								console.log(currentItemsLink + ' includes ' + userInput);
//
// 							}
//
// 							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								console.log(currentItemsLink + ' does not includes ' + userInput);
// 								productsListInFocus.splice(0, 1);
//
// 							}
//
// 							itemCounter += 1;
// 						}
//
// 						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
// 						// }
// 						// else if (wixWindow.formFactor === "Desktop"){
// 						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
// 						// }
//
// 						console.log(productsListInFocus.length);
//
//
// 						}
//
// 				}
//
//
// 				// fixing display by sort value
// 				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
//
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
// 							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
//
//
// 					mainGalleryCopy = $w('#gallery1').items;
// 				}
// 				else if(wixWindow.formFactor === "Desktop"){
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 				}
//
// 			}
// 			else if (currentProductCategory == 'Other Accessories'){
//
// 				// var productsInFocusSortedByRelevanceMobile = orderProducts(otherAccessoriesMen, 'ACCESSORIES', 2);
// 				// var productsInFocusSortedByRelevanceDesktop = orderProducts(otherAccessoriesMen, 'ACCESSORIES', 3);
//
// 				var productsInFocusSortedByRelevanceMobile = [];
// 				var productsInFocusSortedByRelevanceDesktop = [];
//
// 				if (hideAmazonButtonValue == 'Show Amazon Products'){
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(otherAccessoriesMenAmazonless, 'ACCESSORIES', 2, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(otherAccessoriesMenAmazonless, 'ACCESSORIES', 3, isShowLinksMainGallery);
// 				}
// 				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(otherAccessoriesMen, 'ACCESSORIES', 2, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(otherAccessoriesMen, 'ACCESSORIES', 3, isShowLinksMainGallery);
// 				}
//
//
// 				// filtering by brand name or product name..
// 				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){
//
// 					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
// 					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
// 					&& !userInput.includes('\\') && !userInput.includes('=')
// 					&& !userInput.includes('==')){
//
// 						var itemCounter = 0;
// 						var productsListInFocus = [];
//
// 						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 							productsListInFocus = productsInFocusSortedByRelevanceMobile;
// 						}
// 						else if (wixWindow.formFactor === "Desktop"){
// 							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
// 						}
//
// 						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));
//
// 						while (itemCounter < lengthOfProductListInFocus){
//
//
// 							var currentItem = productsListInFocus[0];
//
// 							// console.log('currentItem: ' + currentItem);
// 							// console.log('itemCounter: ' + itemCounter);
//
//
// 							var currentItemsTitle = currentItem.title;
// 							var currentItemsLink = currentItem.link;
// 							// console.log('currentItemsLink: ' + currentItemsLink)
//
// 							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);
//
// 							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
// 							// console.log('productsListInFocus length: ' + productsListInFocus.length);
// 							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);
//
// 							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								productsListInFocus.push(currentItem);
// 								productsListInFocus.splice(0, 1);
//
// 								console.log(currentItemsLink + ' includes ' + userInput);
//
// 							}
//
// 							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								console.log(currentItemsLink + ' does not includes ' + userInput);
// 								productsListInFocus.splice(0, 1);
//
// 							}
//
// 							itemCounter += 1;
// 						}
//
// 						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
// 						// }
// 						// else if (wixWindow.formFactor === "Desktop"){
// 						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
// 						// }
//
// 						console.log(productsListInFocus.length);
//
//
// 						}
//
// 				}
//
//
// 				// fixing display by sort value
// 				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
//
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
// 							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
//
//
// 					mainGalleryCopy = $w('#gallery1').items;
// 				}
// 				else if(wixWindow.formFactor === "Desktop"){
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 				}
// 			}
// 			else if (currentProductCategory == 'Gifts For Her'){
//
// 				// var productsInFocusSortedByRelevanceMobile = orderProducts(giftsForHer, 'NECKLACE', 1);
// 				// var productsInFocusSortedByRelevanceDesktop = orderProducts(giftsForHer, 'NECKLACE', 1);
//
// 				var productsInFocusSortedByRelevanceMobile = [];
// 				var productsInFocusSortedByRelevanceDesktop = [];
//
// 				if (hideAmazonButtonValue == 'Show Amazon Products'){
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(giftsForHerAmazonless, 'NECKLACE', 1, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(giftsForHerAmazonless, 'NECKLACE', 1, isShowLinksMainGallery);
// 				}
// 				else if (hideAmazonButtonValue == 'Hide Amazon Products'){
// 					var productsInFocusSortedByRelevanceMobile = orderProducts(giftsForHer, 'NECKLACE', 1, isShowLinksMainGallery);
// 					var productsInFocusSortedByRelevanceDesktop = orderProducts(giftsForHer, 'NECKLACE', 1, isShowLinksMainGallery);
// 				}
//
// 				// filtering by brand name or product name..
// 				if ((userInput != '' && userInput != ' ' && typeof(userInput) != 'undefined')){
//
// 					if (!userInput.includes('$') && !userInput.includes('#') && !userInput.includes('.')
// 					&& !userInput.includes('%') && !userInput.includes('+') && !userInput.includes('-') && !userInput.includes('/')
// 					&& !userInput.includes('\\') && !userInput.includes('=')
// 					&& !userInput.includes('==')){
//
// 						var itemCounter = 0;
// 						var productsListInFocus = [];
//
// 						if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 							productsListInFocus = productsInFocusSortedByRelevanceMobile;
// 						}
// 						else if (wixWindow.formFactor === "Desktop"){
// 							productsListInFocus = productsInFocusSortedByRelevanceDesktop;
// 						}
//
// 						var lengthOfProductListInFocus =  JSON.parse(JSON.stringify(productsListInFocus.length));
//
// 						while (itemCounter < lengthOfProductListInFocus){
//
//
// 							var currentItem = productsListInFocus[0];
//
// 							// console.log('currentItem: ' + currentItem);
// 							// console.log('itemCounter: ' + itemCounter);
//
//
// 							var currentItemsTitle = currentItem.title;
// 							var currentItemsLink = currentItem.link;
// 							// console.log('currentItemsLink: ' + currentItemsLink)
//
// 							// var indexOfCurrentItem = productsListInFocus.indexOf(currentItem);
//
// 							// console.log('indexOfCurrentItem: ' + indexOfCurrentItem);
// 							// console.log('productsListInFocus length: ' + productsListInFocus.length);
// 							// console.log('original length of productsInFocus: ' + lengthOfProductListInFocus);
//
// 							if ((currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) || (currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								productsListInFocus.push(currentItem);
// 								productsListInFocus.splice(0, 1);
//
// 								console.log(currentItemsLink + ' includes ' + userInput);
//
// 							}
//
// 							if (!(currentItemsLink.toLowerCase()).includes(userInput.toLowerCase()) && !(currentItemsTitle.toLowerCase()).includes(userInput.toLowerCase())){
//
// 								console.log(currentItemsLink + ' does not includes ' + userInput);
// 								productsListInFocus.splice(0, 1);
//
// 							}
//
// 							itemCounter += 1;
// 						}
//
// 						// if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
// 						// 	productsInFocusSortedByRelevanceMobile = productsListInFocus;
// 						// }
// 						// else if (wixWindow.formFactor === "Desktop"){
// 						// 	productsInFocusSortedByRelevanceDesktop = productsListInFocus;
// 						// }
//
// 						console.log(productsListInFocus.length);
//
//
// 						}
//
// 				}
//
//
// 				// fixing display by sort value
// 				if(wixWindow.formFactor === "Mobile" || wixWindow.formFactor === "Tablet"){
//
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceMobile.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
// 							console.log('first and second creation time' + firstItemsCreationDate, secondItemsCreationDate);
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceMobile;
// 					}
//
//
// 					mainGalleryCopy = $w('#gallery1').items;
// 				}
// 				else if(wixWindow.formFactor === "Desktop"){
//
// 					if (currentSortValue == 'Relevance'){
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Ascending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? 0 : -1))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Price Descending'){
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => (stripP(a.description) > stripP(b.description) ? -1 : 0))
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop;
// 					}
// 					else if (currentSortValue == 'Recently Added'){
//
// 						productsInFocusSortedByRelevanceDesktop.sort((a, b) => {
//
// 							console.log('here: Recently Added');
//
// 							var firstItemsCreationDate = dbQueryAllResponseItems[Number(a.slug)]['_createdDate'];
// 							var secondItemsCreationDate = dbQueryAllResponseItems[Number(b.slug)]['_createdDate'];
//
//
// 							return firstItemsCreationDate > secondItemsCreationDate ? -1 : 0;
// 						});
//
// 						$w('#gallery1').items = productsInFocusSortedByRelevanceDesktop ;
// 					}
// 				}
// 			}
//
//
// 		}
//
// 	}
//
//}

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
) {

    var orderedContent = [];

    // var initialValueofPositionOfSubcategoryFrommainCategoryVariable = positionOfSubcategoryFromMainCategory;
    var nonMainCategoryProductInsertIndex = positionOfSubcategoryFromMainCategory;

    // console.log('in order Products');
    // console.log('listOfCategoryOptionsProducts' + listOfCategoryOptionsProducts, listOfCategoryOptionsProducts[0]);

    // include the mainCategory in the orderedContent list first..
    for (var productIndex in listOfCategoryOptionsProducts) {

        var originalCurrentProduct = listOfCategoryOptionsProducts[Number(productIndex)];
        var currentProduct = JSON.parse(JSON.stringify(originalCurrentProduct));
        var currentProductsSlug = currentProduct.slug;

        // console.log('in order Products, slug detected main category');

        if (currentProduct.link == mainCategoryName) {

            if (isShowLinksMainGallery == true) {
                var currentProductEncodedLink = dbQueryAllResponseItems[Number(currentProductsSlug)].productlink;
                currentProduct.link = currentProductEncodedLink;

                // console.log('');
                // console.log('orderProducts - Added Product name:' + currentProduct.title);
                // console.log('orderProducts - Added Product link:' + currentProduct.link);
                // console.log('');
            } else if (isShowLinksMainGallery == false) {
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
    for (var productIndex in listOfCategoryOptionsProducts) {

        var originalCurrentProduct = listOfCategoryOptionsProducts[Number(productIndex)];
        var currentProduct = JSON.parse(JSON.stringify(originalCurrentProduct));
        var currentProductsSlug = currentProduct.slug;

        // if the value that indicates where non main category products should be positioned
        // has not changed, insert the current non main category product at the 'positionOfSubcategoryFromMainCategory'
        // else place it just after the 'positionOfSubcategoryFromMainCategory'. This helps ensure that non main category products are
        // positioned evenly..
        // if (nonMainCategoryProductInsertIndex == initialValueofPositionOfSubcategoryFrommainCategoryVariable){

        // console.log('in order Products, slug detected subcategory');

        if (currentProduct.link != mainCategoryName) {

            if (isShowLinksMainGallery == true) {
                // console.log('?error1');
                // console.log('slug: ' + currentProductsSlug);
                var currentProductEncodedLink = dbQueryAllResponseItems[Number(currentProductsSlug)].productlink;
                // console.log('?error2');
                currentProduct.link = currentProductEncodedLink;
            } else if (isShowLinksMainGallery == false) {
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
function stripP(priceString) {

    var listPriceNumbers = [];
    var priceFloat = 0;

    for (var i in priceString) {
        var isCharNumber = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'].filter((numberOrDot) => numberOrDot == priceString[i]).length > 0;

        if (isCharNumber) {
            listPriceNumbers.push(priceString[i]);
        }

    }

    return priceFloat = Number(listPriceNumbers.join(""));

}