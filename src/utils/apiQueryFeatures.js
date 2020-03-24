module.exports = class APIqueryFeatures {
  constructor(mongooseQuery, requestQuery) {
    this.mongooseQuery = mongooseQuery;
    this.requestQuery = requestQuery;
  }

  filter() {
    //Prepare query
    const extendedQuery = { ...this.requestQuery };
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
    if (this.requestQuery.sort) {
      const sortBy = this.requestQuery.sort.split(',').join(' ');
      this.mongooseQuery.sort(sortBy);
    } else {
      //Default sorted by createdAt
      this.mongooseQuery.sort('createdAt');
    }
    return this;
  }

  fields() {
    //Selected fields are displayed ?fields=name,price
    if (this.requestQuery.fields) {
      const fields = this.requestQuery.fields.split(',').join(' ');
      this.mongooseQuery.select(fields);
    } else {
      //Default fields are displayed
      this.mongooseQuery.select(
        'name price ratingsAverage difficulty startDates duration summary'
      );
    }
    return this;
  }

  pagination() {
    //Pagination ?page=1&?limit=5
    // default ?page=1&limit=10
    const page = Number(this.requestQuery.page) || 1;
    const limit = Number(this.requestQuery.limit) || 10;
    const skip = (page - 1) * 10;
    this.mongooseQuery.skip(skip).limit(limit);
    return this;
  }
};
