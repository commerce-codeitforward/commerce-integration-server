const db = require('../db');
const randomstring = require('randomstring');
const uuid = require('uuid');

const CONSTANTS = require('../constants');

module.exports = function(app, debugLogger) {

  /*
   * GET (Read)
   */
  app.get('/api/sfcc_inventory', async function(req, res, next) {
    const { DEBUG, SCHEMA } = process.env;
    const response = {...CONSTANTS.RESPONSE_OBJECT};

    try {
      const { state, country, amountsBySKU, sfinstance } = req.query;

      if (!amountsBySKU) {
        const error = new Error();
        error.message = 'Required fields not found.';
        error.status = 206;

        throw(error);
      }

      console.log('amountsBySKU: '+amountsBySKU);
      let parsePayload = JSON.parse(amountsBySKU);
      // values that are brought in by amountsBySKU {"82734":40.00,"ChargeSKU":11.99}
      let taxResponse = {};
      let skuKeys = Object.keys(parsePayload);
      skuKeys.forEach((sku) => {
        let taxRate = 0.08;
        let taxItemResponse = {};
        taxItemResponse.taxAmount = parsePayload[sku]*taxRate;
        taxItemResponse.taxRate = taxRate;
        taxItemResponse.taxName = 'GST';
        taxResponse[sku] = taxItemResponse;
      })
      console.log('taxResponse: '+JSON.stringify(taxResponse));

      if (DEBUG === 'true') debugLogger.info('/api/checkInventory', 'GET', parsePayload, 'Inventory Level query.', parsePayload);

      //response.data = {"SKU_1_september10-1568355297":{"taxAmount":2.8229012971048855,"taxRate":0.08,"taxName":"GST"},"SKU_0_september10-1568355296":{"taxAmount":5.0479003481482385,"taxRate":0.08,"taxName":"GST"}};
      response.data = taxResponse;
      response.success = true;

      res.status(200).send(response);

    } catch (error) {
      const { id } = req.query;

      response.error = {...CONSTANTS.RESPONSE_ERROR_OBJECT};
      response.error.message = error.message || 'Internal Server Error';
      response.error.status = error.status || 500;
      response.success = false;

      if (DEBUG === 'true') debugLogger.info('/api/sfcc_inventory', 'GET', id, 'Exception', response);

      res.status(error.status || 500).send(response);
    }
  });
};