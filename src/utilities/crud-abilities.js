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

  // READ - get records by foreign key (retrieves associated records)
  async getbyForeignKey(foreignKey, value) {
    try {
      if(!value) {
        throw new Error('A value for foreign key is required');
      }

      const records = await this.model.findAll({ where: {[foreignKey]: value } });
      return records;
    } catch (error) {
      console.error(`Read by foreign key (${foreignKey}) error in crud abilities:`, error);
      throw error;
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