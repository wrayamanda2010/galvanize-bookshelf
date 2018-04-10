'use strict';

module.exports = {
  development: {
    client:'pg',
    connection:'postgres://awray:doot@localhost:5433/bookshelf_dev'
  },

  test: {
    client:'pg',
    connection:'postgres://awray:doot@localhost:5433/bookshelf_test'
  },

  production: {
    client: 'pg',
    
  }
};
