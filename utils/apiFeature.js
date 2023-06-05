class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  paginate() {
    if (this.queryString.page && this.queryString.limit) {
      const page = +this.queryString.page || 1;
      const limit = +this.queryString.limit || 100;

      const skip = (page - 1) * limit;

      console.log(skip);

      this.query = this.query.skip(skip).limit(limit);
    }

    return this;
  }
}

module.exports = ApiFeatures;
