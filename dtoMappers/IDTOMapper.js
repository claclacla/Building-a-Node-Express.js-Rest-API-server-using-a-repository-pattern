class IDTOMapper {
  constructor() {
    if (this.map === undefined) {
      throw new Error("Must override .map() method");
    }
  }
}

module.exports = IDTOMapper
