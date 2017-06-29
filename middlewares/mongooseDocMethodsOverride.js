// return promise
const mongooseDocMethodsOverride = (schema) => {
  // method create
  schema.method('createByUser', function (user = undefined, cb) {
    if (!this.created) {
      this.created = {
        at: new Date(),
      };
    }
    this.created.by = user;

    return this.create(cb);
  });
  schema.method('create', function (cb) {
    this.isCreating = true;

    if (!this.created) {
      this.created = {
        at: new Date(),
      };
    }

    return this.save(cb);
  });

  // method update
  schema.method('updateByUser', function (user = undefined, cb) {
    if (!this.updated) {
      this.updated = {
        at: new Date(),
      };
    }
    this.updated.by = user;

    return this.update(cb);
  });
  schema.method('update', function (cb) {
    this.isUpdating = true;

    if (!this.updated) {
      this.updated = {
        at: new Date(),
      };
    }

    return this.save(cb);
  });

  // method delete
  schema.method('deleteByUser', function (user = undefined, cb) {
    this.isDeleted = true;

    if (!this.deleted) {
      this.deleted = {
        at: new Date(),
      };
    }
    this.user = user;

    return this.update(cb);
  });
  schema.method('delete', function (cb) {
    this.isDeleting = true;

    this.isDeleted = true;
    if (!this.deleted) {
      this.deleted = {
        at: new Date(),
      };
    }

    return this.save(cb);
  });
};

export default mongooseDocMethodsOverride;
