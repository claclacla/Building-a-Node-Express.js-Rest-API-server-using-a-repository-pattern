class IRepository {
  constructor() {
    if (this.add === undefined) {
      throw new Error("Must override .add() method");
    }

    if (this.update === undefined) {
      throw new Error("Must override .update() method");
    }

    if (this.getByUid === undefined) {
      throw new Error("Must override .getByUid() method");
    }

    this.GET_FILTER_SKIP = "skip";
    this.GET_FILTER_LIMIT = "limit";
    this.GET_FILTER_SORT = "sort";

    this.GET_FILTERS = [
      this.GET_FILTER_SKIP,
      this.GET_FILTER_LIMIT,
      this.GET_FILTER_SORT
    ];

    if (this.mapGetFilters === undefined) {
      throw new Error("Must override .mapGetFilters() method");
    }

    if (this.get === undefined) {
      throw new Error("Must override .get() method");
    }

    if (this.remove === undefined) {
      throw new Error("Must override .remove() method");
    }
  }

  validateGetFilters(filters) {
    if (filters === undefined) {
      return undefined;
    }

    Object.keys(filters).forEach(key => {
      if (this.GET_FILTERS.indexOf(key) < 0) {
        throw new Error("No valid filter passed to repository with key: " + key);
      }

      if ([this.GET_FILTER_SKIP, this.GET_FILTER_LIMIT].indexOf(key) >= 0) {
        if (isNaN(parseInt(filters[key]))) {
          throw new Error("No valid " + key + " value: " + filters[key]);
        }
      }
    });

    return filters;
  }
}

module.exports = IRepository
