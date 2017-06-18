class IDTO {
  constructor(uid) {
    if (uid === undefined) {
      throw new Error("UID not valid");
    }

    this.uid = uid;
  }
}

module.exports = IDTO
