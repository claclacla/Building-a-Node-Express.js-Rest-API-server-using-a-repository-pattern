class IUpdateRoute {
  constructor() {
    if (this.use === undefined) {
      throw new Error("Must override .use() method");
    }
  }
}

module.exports = IUpdateRoute;
