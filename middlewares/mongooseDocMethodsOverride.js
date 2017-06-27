// return promise
export default function mongooseDocMethodsOverride(schema) {
  // method create
  schema.method('createByUser', (user, cb) => {
    const self = this;

    // log time
    if (!self.created) {
      self.created = {
        at: new Date(),
      };
    }
    if (user) {
      self.created.by = user;
    }

    return self.create(cb);
  });
  schema.method('create', (cb) => {
    const self = this;
    self.isCreating = true;

    // log time
    if (!self.created) {
      self.created = {
        at: new Date(),
      };
    }

    if (cb && typeof cb === 'function') {
      return self.save(cb);
    }
    return self.save();
  });
  // method update
  schema.method('updateByUser', (user, cb) => {
    const self = this;

    // log time
    if (!self.updated) {
      self.updated = {
        at: new Date(),
      };
    }
    if (user) {
      self.updated.by = user;
    }

    return self.update(cb);
  });
  schema.method('update', (cb) => {
    const self = this;
    self.isUpdating = true;

    // log time
    if (!self.updated) {
      self.updated = {
        at: new Date(),
      };
    }

    if (cb && typeof cb === 'function') {
      return self.save(cb);
    }
    return self.save();
  });
  // method delete
  schema.method('deleteByUser', (user, cb) => {
    const self = this;

    // log time
    self.isDeleted = true;
    if (!self.deleted) {
      self.deleted = {
        at: new Date(),
      };
    }
    if (user) {
      self.deleted.by = user;
    }

    return self.update(cb);
  });
  schema.method('delete', (cb) => {
    const self = this;
    self.isDeleting = true;

    // log time
    self.isDeleted = true;
    if (!self.deleted) {
      self.deleted = {
        at: new Date(),
      };
    }

    if (cb && typeof cb === 'function') {
      return self.save(cb);
    }
    return self.save();
  });
}
