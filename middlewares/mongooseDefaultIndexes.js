// index accepts single object or objects array
export default function mongooseDefaultIndexes(schema, index) {
  let indexes = [
    {
      _id: 1,
      isDeleted: 1,
    },
  ];
  if (index && typeof index === 'object') {
    indexes = indexes.concat(index);
  }
  // set indexes
  indexes.forEach(i => schema.index(i));
}
