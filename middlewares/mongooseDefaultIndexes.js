// index accepts single object or objects array
const mongooseDefaultIndexes = (schema, index) => {
  let indexes = [
    {
      _id: 1,
      isDeleted: 1,
    },
  ];

  if (index && typeof index === 'object') {
    indexes = indexes.concat(index);
  }

  indexes.forEach(i => schema.index(i));
};

export default mongooseDefaultIndexes;
