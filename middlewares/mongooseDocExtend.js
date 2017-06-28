export default function mongooseDocExtend(schema) {
  // extend updates
  schema.method('extend', function (source) {
    const self = this;

    // extend doc
    Object.assign(self, source);
    // mark all doc paths are modified
    Object.keys(source).forEach((path) => {
      self.markModified(path);
    });

    return self;
  });
}
