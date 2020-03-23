module.exports = class APIqueryFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    //Prepare query
    const extendedQuery = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete extendedQuery[el]);

    const stringifyQuery = JSON.stringify(extendedQuery).replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}`
    );

    //Filter query e.g. ?price[gt]=100
    this.mongooseQuery.find(JSON.parse(stringifyQuery));
    return this;
  }

  sort() {
    //Sort query e.q. ?sort=price
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.mongooseQuery.sort(sortBy);
    } else {
      //Default sorted by createdAt
      this.mongooseQuery.sort('createdAt');
    }
    return this;
  }

  fields() {
    //Selected fields are displayed ?fields=name,price
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.mongooseQuery.select(fields);
    } else {
      //Default fields are displayed
      this.mongooseQuery.select('name price difficulty duration summary');
    }
    return this;
  }

  pagination() {
    //Pagination ?page=1&?limit=5
    // default ?page=1&limit=10
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 10;
    const skip = (page - 1) * 10;
    this.mongooseQuery.skip(skip).limit(limit);
    return this;
  }
};
