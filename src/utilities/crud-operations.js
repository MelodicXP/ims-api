'use strict';

class CRUD {
  constructor(model) {
    this.model = model;
  }

  // CREATE
  async create(record) {
    return await this.model.create(record);
  }

  // READ - Accept object as a parameter to accept more dynamic queries (name, id, etc...)
  async get(query = {}) {
    if(Object.keys(query).length) {
      // If query object not empty, find one based on query
      return await this.model.findOne({ where: query });
    } else {
      // If query object empty, find all
      return await this.model.findAll({});
    }
  }

  // UPDATE 
  async update(id, data) {
    const record = await this.model.findOne({ where: { id } });
    return await record.update(data);
  }

  // DELETE
  async delete(id) {
    return await this.model.destroy({ where: { id } });
  }
}

module.exports = CRUD;