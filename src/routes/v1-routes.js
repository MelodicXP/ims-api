'use strict';

const express = require('express');

const crudInterfaces = require('../database/database-crud-interfaces');
const verifyBearerToken = require('../authentication/middleware/bearer-auth-middleware');
const requirePermission = require('../authentication/middleware/access-control-list-middleware');


const router = express.Router();

async function handleGetAll(req, res, next) {
  try {
    let allRecords = await req.model.get();
    res.status(200).json(allRecords);
  } catch (error) {
    next(error);
  }
}

async function handleGetOne(req, res, next) {
  try {
    const id = req.params.id;
    let theRecord = await req.model.get({ id: id });
    if(!theRecord) {
      return res.status(404).json({ message: 'Record not found'});
    }
    res.status(200).json(theRecord);
  } catch (error) {
    next(error);
  }
}

async function handleCreate(req, res, next) {
  try {
    let obj = req.body;
    let newRecord = await req.model.create(obj);
    res.status(201).json(newRecord);
  } catch (error) {
    next(error);
  }
}

async function handleUpdate(req, res, next) {
  try {
    const id = req.params.id;
    const obj = req.body;
    let updatedRecord = await req.model.update(id, obj);
    if(!updatedRecord) {
      return res.status(404).json({ message: 'Record not found'});
    }
    res.status(200).json(updatedRecord);
  } catch (error) {
    next(error);
  }
}

async function handleDelete(req, res, next) {
  let id = req.params.id;
  try {
    await req.model.delete(id);
    res.status(200).json({ message: `Record ${id} deleted`});
  } catch (error) {
    next(error); // Pass errors to error handling middleware
  }
}

router.param('model', (req, res, next) => {
  const modelName = req.params.model;

  if (crudInterfaces[modelName]) {
    req.model = crudInterfaces[modelName];
    next();
  } else {
    next('Invalid Model');
  }
});

router.get('/:model', verifyBearerToken, handleGetAll);
router.get('/:model/:id', verifyBearerToken, handleGetOne);
router.post('/:model', verifyBearerToken, requirePermission('create'), handleCreate);
router.put('/:model/:id', verifyBearerToken, requirePermission('update'), handleUpdate);
router.delete('/:model/:id', verifyBearerToken, requirePermission('delete'), handleDelete);

module.exports = router;