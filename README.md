# commerce-integration-server

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

<h3>Overview</h3>
<p>Almost every commerce cloud project requires integrations, with Salesforce B2B Commerce that is no different. Up until recently Salesforce has provided a sample heroku server to mock the expected response to their sample adapters. With that sample heroku server being turned off in Sept of 2023, we've build this app for customers & partners alike.</p>
<p>This app is build in NodeJs and is designed to mock responses back to your stores for the integrations in checkout. </p>

##### Disclaimer
*This integration server is purely a reference application and should never be used in a production setting. This should be used for testing purposes or developing in lower instance before a real integration is setup.*

### Tax Integration
| Endpoints  | Inputs | Response |
| ------------- | ------------- | ------------- | 
| /get-tax-rates  | amountsBySKU  | ```{"SKU_1_september10-1568355297":{"taxAmount":2.8229012971048855,"taxRate":0.08,"taxName":"GST"},"SKU_0_september10-1568355296":{"taxAmount":5.0479003481482385,"taxRate":0.08,"taxName":"GST"}}``` | 
| /get-tax-rates-by-tax-type  | amountsBySKU, taxType  | ```{"SKU_1_september10-1568355297":{"taxAmount":2.8229012971048855,"taxRate":0.08,"taxName":"GST"},"SKU_0_september10-1568355296":{"taxAmount":5.0479003481482385,"taxRate":0.08,"taxName":"GST"}}``` |
| /get-tax-rates-with-adjustments  | amountsBySKU, country, state, taxType  | ```{"SKU_1_september10-1568355297":{"taxAmount":2.8229012971048855,"taxRate":0.08,"taxName":"GST"},"SKU_0_september10-1568355296":{"taxAmount":5.0479003481482385,"taxRate":0.08,"taxName":"GST"}}``` |
| /get-tax-rates-with-adjustments-post | amountsBySKU, country, state, taxType  | ```{"SKU_1_september10-1568355297":{"taxAmount":2.8229012971048855,"taxRate":0.08,"taxName":"GST"},"SKU_0_september10-1568355296":{"taxAmount":5.0479003481482385,"taxRate":0.08,"taxName":"GST"}}``` | 

### Shipping

| Endpoints  | Inputs | Response |
| ------------- | ------------- | ------------- | 
| /calculate-shipping-rates-winter-21  | None  | ```{ status: 'calculated', rate: { serviceName: serviceName, serviceCode: 'SNC9600', shipmentCost: 11.99, otherCost: 5.99 } };``` |
| /calculate-shipping-rates-with-lang  | lang  | ```{ status: 'calculated', rate: { serviceName: serviceName, serviceCode: 'SNC9600', shipmentCost: 11.99, otherCost: 5.99 } };``` | 
| /calculate-shipping-rates-winter-21  | None  | ```[{ "status": "calculated", "rate": { "name" : "Delivery Method 1", "serviceName": "Test Carrier 1", "serviceCode": "SNC9600", "shipmentCost": 11.99, "otherCost": 5.99 } }, { "status": "calculated", "rate": { "name": "Delivery Method 2", "serviceName": "Test Carrier 2", "serviceCode": "SNC9600", "shipmentCost": 15.99, "otherCost": 6.99 } } ];``` |
| /calculate-shipping-rates-winter-21-with-lang  | lang  | ```[{ "status": "calculated", "rate": { "name" : "Delivery Method 1", "serviceName": "Test Carrier 1", "serviceCode": "SNC9600", "shipmentCost": 11.99, "otherCost": 5.99 } }, { "status": "calculated", "rate": { "name": "Delivery Method 2", "serviceName": "Test Carrier 2", "serviceCode": "SNC9600", "shipmentCost": 15.99, "otherCost": 6.99 } } ];``` |

### Inventory
| Endpoints  | Inputs | Response |
| ------------- | ------------- | ------------- | 
| /get-inventory  | skus  | ```{"SKU-25-10028":9999.00, "SKU-25-10030":9999.00}``` |

### Sales Price  
| Endpoints  | Inputs | Response |
| ------------- | ------------- | ------------- | 
| /get-sales-prices  | skus  | ```{"SKU-25-10028":0.00, "SKU-25-10030":0.00, "SKU_FOR_TEST":100.00}``` | 
    

## Setup Steps

Deploy the App
1. Click the 'Deploy to Heroku' button
2. Authenticate to the heroku account you wish to use
3. Click Deploy

Remote Site Settings:
1. Navigate to Setup → Remote Site Settings
2. Click the New Remote Site button
3. Enter the following information:
    1. Name: herokuapp
    2. Remote Site URL: https://XXXX.herokuapp.com (Replacing the XXXX with the url of the app that you've created)
    3. Disable Protocol Security: Unchecked
    4. Active: Checked
4. Click the Save button