const db = require('./db');

const init = () => {
  const { SCHEMA } = process.env;

  const query_init = `
    CREATE TABLE IF NOT EXISTS ${SCHEMA}.debug (
      id SERIAL,
      datestamp timestamp without time zone,
      loglevel character varying(255),
      endpoint character varying(255),
      method character varying(255),
      userid character varying(255),
      message character varying(255),
      owner character varying(255),
      "data" text,
      PRIMARY KEY(id)
    )
  `;
  
  const results_init = db.query(query_init);

  return this;
};

const info = (endpoint = '', method = '', userId = '', message = '', data = {}) => {
  const { SCHEMA } = process.env;

  const data_stringified = (typeof data === 'object' ? JSON.stringify(data) : data);
  const level = 'LOW';
  const owner = 'Customer';

  const query_info = `
    INSERT INTO 
      ${SCHEMA}.debug (logLevel, endpoint, method, userId, message, owner, data) 
    VALUES 
      ($1,$2,$3,$4,$5,$6,$7) 
    RETURNING 
      *
  `;

  const results_info = db.query(query_info, [level, endpoint, method, userId, message, owner, data_stringified]);
};

exports.info = info;
exports.init = init;
