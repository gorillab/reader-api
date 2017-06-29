// extend updates
const mongooseDocExtend = (schema) => {
  schema.method('extend', (source) => {
    Object.assign(this, source);
    Object.keys(source).forEach(this.markModified);

    return this;
  });
};

export default mongooseDocExtend;
