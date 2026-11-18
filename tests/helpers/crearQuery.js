function crearQuery(resultado) {
  const query = {};
  ["select", "insert", "update", "delete", "eq", "gt", "ilike", "order"].forEach((metodo) => {
    query[metodo] = jest.fn(() => query);
  });
  query.single = jest.fn(() => Promise.resolve(resultado));
  query.maybeSingle = jest.fn(() => Promise.resolve(resultado));
  query.then = (resolve, reject) => Promise.resolve(resultado).then(resolve, reject);
  return query;
}

module.exports = { crearQuery };