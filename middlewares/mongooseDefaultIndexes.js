// index accepts single object or objects array
module.exports = function mongooseDefaultIndexes(schema, index) {
  let indexes = [
    {
      _id: 1,
      isDeleted: 1
    }
  ];
  if (index && typeof index === 'object') {
    indexes = indexes.concat(index);
  }
  // set indexes
  indexes.forEach(index => schema.index(index));
};
