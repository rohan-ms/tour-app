class Features {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
    filters() {
      const dbQuery = { ...this.queryString };
      const excludeFields = ['page', 'sort', 'limit', 'fields'];
      excludeFields.forEach((field) => {
        delete dbQuery[field];
      });
      ///advance filtering
      let fdbQuery = JSON.stringify(dbQuery);
      fdbQuery = fdbQuery.replace(/\b(gte|gt|lte|lt)\b/gi, (res) => {
        return `$${res}`;
      });
      this.query = this.query.find(JSON.parse(fdbQuery));
      return this;
    }
    sort() {
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(',').join(' ');
        this.query.sort(sortBy);
      } else {
        this.query.sort('-createdAt');
      }
      return this;
    }
    selectFields() {
      if (this.queryString.fields) {
        const selFields = this.queryString.fields.split(',');
        this.query.select(selFields);
      } else {
        this.query.select('-__v');
      }
      return this;
    }
    paginate() {
      if (this.queryString.page) {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 10;
        const skip = (page - 1) * limit;
        this.query.skip(skip).limit(limit);
      }
      return this;
    }
  }
module.exports=Features;  