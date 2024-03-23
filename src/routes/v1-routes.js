'use strict';

const express = require('express');

const crudInterfaces = require('../database/database-crud-interfaces');

const router = express.Router();

async function handleGetAll(req, res) {
  let allRecords = await req.model.get();
  res.status(200).json(allRecords);
}

async function handleGetOne(req, res) {
  const id = req.params.id;
  let theRecord = await req.model.get(id);
  res.status(200).json(theRecord);
}

async function handleCreate(req, res) {
  let obj = req.body;
  let newRecord = await req.model.create(obj);
  res.status(201).json(newRecord);
}

async function handleUpdate(req, res) {
  const id = req.params.id;
  const obj = req.body;
  let updatedRecord = await req.model.update(id, obj);
  res.status(200).json(updatedRecord);
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

router.get('/:model', handleGetAll);
router.get('/:model/:id', handleGetOne);
router.post('/:model', handleCreate);
router.put('/:model/:id', handleUpdate);
router.delete('/:model/:id', handleDelete);



module.exports = router;