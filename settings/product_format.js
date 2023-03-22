function mold_product(
        productName,
        brandName='',
        productCategory
        priceFloat,
        priceStringWithCurrencySymbol,
        currencyString
        imageLink,
        productLink
){

   product_format_dict = {
        "name": productName,
        "description": "",
        "price": priceFloat,
        "pricePerUnitData": {
          "totalQuantity": 100,
          "totalMeasurementUnit": "G",
          "baseQuantity": 1,
          "baseMeasurementUnit": "G"
        },
        "sku": "Colombian-001",
        "visible": true,
        "discount": {
          "type": "AMOUNT",
          "value": "0"
        },
        "productOptions": {
          "Weight": {
            "choices": []
          }
        },
        "manageVariants": false,
        "productType": "physical",
        "weight": 1,
        "ribbon": "Organic",
        "brand": brandName,
        "seoData": {
          "tags": [{
            "type": "title",
            "children": productName,
            "custom": false,
            "disabled": false
          },
          {
            "type": "meta",
            "props": {
              "name": "description",
              "content": productName + productCategory
            },
            "custom": false,
            "disabled": false
          }
          ]
        }
    }

}