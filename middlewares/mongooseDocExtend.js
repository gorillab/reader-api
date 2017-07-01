// extend updates
const mongooseDocExtend = (schema) => {
  schema.method('extend', function (source) {
    Object.assign(this, source);
    Object.keys(source).forEach((key) => {
      this.markModified(key);
    });

    return this;
  });
};

export default mongooseDocExtend;
