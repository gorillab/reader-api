var _ = require('lodash');

module.exports = function mongooseDocExtend(schema) {
  // extend updates
  schema.method('extend', function(source) {
    var self = this;

    // extend doc
    _.extend(self, source);
    // mark all doc paths are modified
    Object.keys(source).forEach(function(path) {
      self.markModified(path);
    });

    return self;
  });
};
