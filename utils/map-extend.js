module.exports = function mapAndExtend(src, dest, mapFunction) {
  Object.keys(src).forEach(function (name) {
    dest[name] = mapFunction(name, src);
  });
};