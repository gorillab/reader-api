var _ = require('lodash');

// return promise
module.exports = function mongooseDocMethodsOverride(schema) {
  // method create
  schema.method('createByUser', function(user, cb) {
    var self = this;

    // log time
    if (!self.created) {
      self.created = {
        at: new Date()
      };
    }
    if (user) {
      self.created.by = user;
    }

    return self.create(cb);
  });
  schema.method('create', function(cb) {
    var self = this;
    self.isCreating = true;

    // log time
    if (!self.created) {
      self.created = {
        at: new Date()
      };
    }

    if (cb && typeof cb === 'function') {
      return self.save(cb);
    }
    return self.save();
  });
  // method update
  schema.method('updateByUser', function(user, cb) {
    var self = this;

    // log time
    if (!self.updated) {
      self.updated = {
        at: new Date()
      };
    }
    if (user) {
      self.updated.by = user;
    }

    return self.update(cb);
  });
  schema.method('update', function(cb) {
    var self = this;
    self.isUpdating = true;

    // log time
    if (!self.updated) {
      self.updated = {
        at: new Date()
      };
    }

    if (cb && typeof cb === 'function') {
      return self.save(cb);
    }
    return self.save();
  });
  // method delete
  schema.method('deleteByUser', function(user, cb) {
    var self = this;

    // log time
    self.isDeleted = true;
    if (!self.deleted) {
      self.deleted = {
        at: new Date()
      };
    }
    if (user) {
      self.deleted.by = user;
    }

    return self.update(cb);
  });
  schema.method('delete', function(cb) {
    var self = this;
    self.isDeleting = true;

    // log time
    self.isDeleted = true;
    if (!self.deleted) {
      self.deleted = {
        at: new Date()
      };
    }

    if (cb && typeof cb === 'function') {
      return self.save(cb);
    }
    return self.save();
  });
};
