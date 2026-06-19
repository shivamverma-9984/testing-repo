const test = require('node:test');
const assert = require('node:assert/strict');
const controller = require('../controllers/itemController');

function createRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

test('getItems returns all items sorted newest first', async () => {
  const res = createRes();
  const items = [{ _id: '1', name: 'B', createdAt: '2024-01-02' }, { _id: '2', name: 'A', createdAt: '2024-01-03' }];

  const originalFind = require('../models/Item').find;
  require('../models/Item').find = () => ({
    sort: async () => items,
  });

  try {
    await controller.getItems({}, res);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, items);
  } finally {
    require('../models/Item').find = originalFind;
  }
});

test('createItem responds with 201 and created item', async () => {
  const res = createRes();
  const req = { body: { name: 'Book', description: 'Great book', price: 10 } };
  const createdItem = { _id: 'abc', ...req.body };

  const originalCreate = require('../models/Item').create;
  require('../models/Item').create = async () => createdItem;

  try {
    await controller.createItem(req, res);
    assert.equal(res.statusCode, 201);
    assert.deepEqual(res.body, createdItem);
  } finally {
    require('../models/Item').create = originalCreate;
  }
});

test('deleteItem returns 404 when item is not found', async () => {
  const res = createRes();
  const req = { params: { id: 'missing-id' } };

  const originalDelete = require('../models/Item').findByIdAndDelete;
  require('../models/Item').findByIdAndDelete = async () => null;

  try {
    await controller.deleteItem(req, res);
    assert.equal(res.statusCode, 404);
    assert.deepEqual(res.body, { message: 'Item not found' });
  } finally {
    require('../models/Item').findByIdAndDelete = originalDelete;
  }
});
