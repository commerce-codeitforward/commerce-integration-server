const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const en_US_SERVICE_NAME = 'Canada Post';
const de_SERVICE_NAME = 'Kanada Post';
const ja_SERVICE_NAME = 'カナダ郵便公社';

const en_US_DELIVERY_METHOD_1 = 'Delivery Method 1';
const de_DELIVERY_METHOD_1 = 'Liefermethode 1';
const ja_DELIVERY_METHOD_1 = '配送方法1';

const en_US_DELIVERY_METHOD_2 = 'Delivery Method 2';
const de_DELIVERY_METHOD_2 = 'Liefermethode 2';
const ja_DELIVERY_METHOD_2 = '配送方法2';

const en_US_SERVICE_NAME_1 = 'Test Carrier 1';
const de_SERVICE_NAME_1 = 'Testträger 1';
const ja_SERVICE_NAME_1 = 'テストキャリア1';

const en_US_SERVICE_NAME_2 = 'Test Carrier 2';
const de_SERVICE_NAME_2 = 'Testträger 2';
const ja_SERVICE_NAME_2 = 'テストキャリア2';

function shippingRatesJson() {
    return {
        status: 'calculated',
        rate: {
            serviceName: 'Canada Post',
            serviceCode: 'SNC9600',
            shipmentCost: 11.99,
            otherCost: 5.99
        }
    };
}

function shippingRatesJson(lang) {
    let serviceName = en_US_SERVICE_NAME;
    if(lang == 'de') {
        serviceName = de_SERVICE_NAME;
    } else if(lang == 'ja') {
        serviceName = ja_SERVICE_NAME;
    }

    return {
        status: 'calculated',
        rate: {
            serviceName: serviceName,
            serviceCode: 'SNC9600',
            shipmentCost: 11.99,
            otherCost: 5.99
        }
    };
}

// return 2 shipping rates
function shippingRates228Json() {
    return [
        {
          "status": "calculated",
          "rate": {
            "name" : "Delivery Method 1",
            "serviceName": "Test Carrier 1", 
            "serviceCode": "SNC9600", 
            "shipmentCost": 11.99,
            "otherCost": 5.99
          }
        },
        {
          "status": "calculated",
          "rate": {
            "name": "Delivery Method 2",
            "serviceName": "Test Carrier 2",
            "serviceCode": "SNC9600",
            "shipmentCost": 15.99,
            "otherCost": 6.99
          }
        }
      ];
}

// return 2 shipping rates
function shippingRates228Json(lang) {
    let deliveryMethod1 = en_US_DELIVERY_METHOD_1;
    let serviceName1 = en_US_SERVICE_NAME_1;
    let deliveryMethod2 = en_US_DELIVERY_METHOD_2;
    let serviceName2 = en_US_SERVICE_NAME_2;
    if(lang == 'de') {
        deliveryMethod1 = de_DELIVERY_METHOD_1;
        serviceName1 = de_SERVICE_NAME_1;
        deliveryMethod2 = de_DELIVERY_METHOD_2;
        serviceName2 = de_SERVICE_NAME_2;
    } else if(lang == 'ja') {
        deliveryMethod1 = ja_DELIVERY_METHOD_1;
        serviceName1 = ja_SERVICE_NAME_1;
        deliveryMethod2 = ja_DELIVERY_METHOD_2;
        serviceName2 = ja_SERVICE_NAME_2;
    }
    return [
        {
          "status": "calculated",
          "rate": {
            "name" : deliveryMethod1,
            "serviceName": serviceName1, 
            "serviceCode": "SNC9600", 
            "shipmentCost": 11.99,
            "otherCost": 5.99
          }
        },
        {
          "status": "calculated",
          "rate": {
            "name": deliveryMethod2,
            "serviceName": serviceName2,
            "serviceCode": "SNC9600",
            "shipmentCost": 15.99,
            "otherCost": 6.99
          }
        }
      ];
}

// Return the same list of SKUs with a quantity of 9999 for each SKU
function getInventory(skus) {
    if (skus == null) {
        return {
            "error": "Input SKUs list is empty or undefined."
        };
    }
    let inventoryJson = {};
    const skusArray = skus.slice(1, -1).split(',');
    for (const sku of skusArray) {
        inventoryJson[sku.slice(1, -1)] = 9999.00;
    }
    return inventoryJson;
}

// Return the same list of SKUs with the same sale price (0.00) for each SKU
function getSalesPrices(skus) {
    if (skus == null) {
        return {
            "error": "Input SKUs list is empty or undefined."
        };
    }
    let json = {};
    const skusArray = skus.slice(1, -1).split(',');
    for (const sku of skusArray) {
        const simpleSku = sku.slice(1, -1);
        if (simpleSku == 'SKU_FOR_TEST') {
            json[simpleSku] = 100.00;
        } else {
            json[simpleSku] = 0.00;
        }
    }
    return json;
}

// Return the same list of SKUs with the calculated tax amount and the tax rate 0.08 for each SKU
function getTaxRates(amountsBySKU) {
    if (amountsBySKU == null) {
        return {
            "error": "Input SKUs list is empty or undefined."
        };
    }
    let json = {};
    const skusArray = amountsBySKU.slice(1, -1).split(',');
    for (const skuAndAmount of skusArray) {
        const sku = skuAndAmount.split(':')[0];
        const amount = skuAndAmount.split(':')[1];
        const taxRate = 0.08;
        const taxAmount = amount * taxRate;
        json[sku.slice(1, -1)] = {
            taxAmount: taxAmount,
            taxRate: taxRate,
            taxName: 'GST'
        };
    }
    return json;
}

// Return the same list of SKUs with the calculated tax amount and the tax rate 0.08 for each SKU
function getTaxRatesByTaxType(amountsBySKU, taxType) {
    if (amountsBySKU == null) {
        return {
            "error": "Input SKUs list is empty or undefined."
        };
    }
    let json = {};
    const skusArray = amountsBySKU.slice(1, -1).split(',');
    for (const skuAndAmount of skusArray) {
        const sku = skuAndAmount.split(':')[0];
        const amount = skuAndAmount.split(':')[1];
        const taxRate = 0.08;
        var finalTaxAmount = 0.00;
        if(taxType == 'Gross') {
            finalTaxAmount = amount * taxRate / (1 + taxRate);
        } else {
            finalTaxAmount = amount * taxRate;
        }
        json[sku.slice(1, -1)] = {
            taxAmount: finalTaxAmount,
            taxRate: taxRate,
            taxName: 'GST'
        };
    }
    return json;
}

// Tax Rate for Non-US Countries will be 0.15 and for US it will be 0.08
function getTaxRatesWithAdjustments(amountsBySKU, country, state, taxType) {
    if (amountsBySKU == null) {
        return {
            "error": "Input SKUs list is empty or undefined."
        };
    }
    var skus = JSON.parse(amountsBySKU);
    var taxRate = 0.15;
    let json = {};
    for (var key in skus) {
        const cartItemId = skus[key].cartItemId;
        const sku = skus[key].sku;
        const amount = skus[key].amount;
        const tierAdjustment = skus[key].tierAdj;
        const itemizedPromotions = skus[key].itemizedPromos;
        const quantity = skus[key].quantity;
    
        if(country == 'US') {
            taxRate = 0.08;
            const noSalesTaxUSStates = ['AK', 'DE', 'MT', 'NH', 'OR'];
            if (noSalesTaxUSStates.includes(state)) {
                taxRate = 0.00;
            }
        }

        var itemizedPromotionTax = 0.00;
        var itemizedPromotionTaxArr = [];
        var netUnitPrice = 0.00;
        var grossUnitPrice = 0.00;

        var multiplier = 0.00;

        if(taxType == 'Gross') {
            multiplier = taxRate / (1 + taxRate)
        } else {
            multiplier = taxRate;
        }

        var cartItemTax = amount * multiplier;
        var tierAdjustmentTax = (tierAdjustment ? tierAdjustment : 0.00) * multiplier;
        itemizedPromotions.forEach(element => {
            var itemTaxAmount = (element.amount ? element.amount : 0.00) * multiplier;
            itemizedPromotionTaxArr.push({id: element.id, taxAmount: itemTaxAmount});
            itemizedPromotionTax = itemizedPromotionTax + itemTaxAmount;
        });

        if(taxType == 'Gross') {
            grossUnitPrice = amount / quantity;
            netUnitPrice = (amount - cartItemTax) / quantity;
        } else {
            grossUnitPrice = (amount + cartItemTax) / quantity;
            netUnitPrice = amount / quantity;
        }

        json[sku] = {
            cartItemId: cartItemId,
            taxAmount: cartItemTax,
            adjustmentTaxAmount: tierAdjustmentTax,
            itemizedPromotionTaxAmounts: itemizedPromotionTaxArr,
            totalItemizedPromotionTaxAmount: itemizedPromotionTax,
            grossUnitPrice: grossUnitPrice,
            netUnitPrice: netUnitPrice,
            taxRate: taxRate,
            taxName: 'GST'
        };
    }
    return json;
}

function getTaxRatesWithAdjustmentsPost(amountsBySKU, country, state, taxType) {
    if (amountsBySKU == null) {
        return {
            "error": "Input SKUs list is empty or undefined."
        };
    }
    var taxRate = 0.15;
    let json = {};
    for (var key in amountsBySKU) {
        const cartItemId = amountsBySKU[key].Id;
        const amount = amountsBySKU[key].TotalLineAmount;
        const tierAdjustment = amountsBySKU[key].AdjustmentAmount;
        let itemizedPromotions = [];
        if(amountsBySKU[key].CartItemPriceAdjustments) {
            itemizedPromotions = amountsBySKU[key].CartItemPriceAdjustments.records;
        }
        const quantity = amountsBySKU[key].Quantity;
    
        if(country == 'US') {
            taxRate = 0.08;
            const noSalesTaxUSStates = ['AK', 'DE', 'MT', 'NH', 'OR'];
            if (noSalesTaxUSStates.includes(state)) {
                taxRate = 0.00;
            }
        }

        var itemizedPromotionTax = 0.00;
        var itemizedPromotionTaxArr = [];
        var netUnitPrice = 0.00;
        var grossUnitPrice = 0.00;

        var multiplier = 0.00;

        if(taxType == 'Gross') {
            multiplier = taxRate / (1 + taxRate)
        } else {
            multiplier = taxRate;
        }

        var cartItemTax = amount * multiplier;
        var tierAdjustmentTax = (tierAdjustment ? tierAdjustment : 0.00) * multiplier;
        itemizedPromotions.forEach(element => {
            var itemTaxAmount = (element.TotalAmount ? element.TotalAmount : 0.00) * multiplier;
            itemizedPromotionTaxArr.push({id: element.Id, taxAmount: itemTaxAmount});
            itemizedPromotionTax = itemizedPromotionTax + itemTaxAmount;
        });

        if(taxType == 'Gross') {
            grossUnitPrice = amount / quantity;
            netUnitPrice = (amount - cartItemTax) / quantity;
        } else {
            grossUnitPrice = (amount + cartItemTax) / quantity;
            netUnitPrice = amount / quantity;
        }

        json[cartItemId] = {
            cartItemId: cartItemId,
            taxAmount: cartItemTax,
            adjustmentTaxAmount: tierAdjustmentTax,
            itemizedPromotionTaxAmounts: itemizedPromotionTaxArr,
            totalItemizedPromotionTaxAmount: itemizedPromotionTax,
            grossUnitPrice: grossUnitPrice,
            netUnitPrice: netUnitPrice,
            taxRate: taxRate,
            taxName: 'GST'
        };
    }
    return json;
}

express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .use(express.json({limit: '5mb'}))
    .get('/', (req, res) => res.render('pages/index'))
    .get('/calculate-shipping-rates', (req, res) => res.json(shippingRatesJson()))
    .get('/calculate-shipping-rates-with-lang', (req, res) => res.json(shippingRatesJson(req.query.lang)))
    .get('/calculate-shipping-rates-winter-21', (req, res) => res.json(shippingRates228Json()))
    .get('/calculate-shipping-rates-winter-21-with-lang', (req, res) => res.json(shippingRates228Json(req.query.lang)))
    .get('/get-inventory', (req, res) => res.json(getInventory(req.query.skus)))
    .get('/get-sales-prices', (req, res) => res.json(getSalesPrices(req.query.skus)))
    .get('/get-tax-rates', (req, res) => res.json(getTaxRates(req.query.amountsBySKU)))
    .get('/get-tax-rates-by-tax-type', (req, res) => res.json(getTaxRatesByTaxType(req.query.amountsBySKU, req.query.taxType)))
    .get('/get-tax-rates-with-adjustments', (req, res) => res.json(getTaxRatesWithAdjustments(req.query.amountsBySKU, req.query.country, req.query.state, req.query.taxType)))
    .post('/get-tax-rates-with-adjustments-post', (req, res) => res.json(getTaxRatesWithAdjustmentsPost(req.body.amountsBySKU, req.body.country, req.body.state, req.body.taxType)))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));
