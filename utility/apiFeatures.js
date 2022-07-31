class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObject = { ...this.queryString };
    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(
      /\b(gt|lt|gte|lte)\b/g,
      (match) => `$${match}`
    );
    const filteredQuery = JSON.parse(queryString);
    const filterOption = [
      'sort',
      'limit',
      'page',
      'fields',
    ];
    filterOption.map(
      (element) => delete filteredQuery[element]
    );
    // Data searching using query
    this.query = this.query.find(filteredQuery);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      let sortBy = this.queryString.sort;
      sortBy = sortBy.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('createdAt');
    }
    return this;
  }

  selectFields() {
    if (this.queryString.fields) {
      let { fields } = this.queryString;
      fields = fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  // default page is 1 and limit is 5
  pagination() {
    if (this.queryString.page || this.queryString.limit) {
      const limit = this.queryString.limit * 1 || 5;
      const page = this.queryString.page * 1 - 1 || 0;
      this.query = this.query
        .skip(page * limit)
        .limit(limit);
    }
    return this;
  }
}

module.exports = ApiFeatures;
