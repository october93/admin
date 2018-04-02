export default (filter, row) => {
  const filters = filter.value.split(",").map(d => d.trim())
  if (filters.includes(row[filter.id])) {
    return true
  }
  return false
}
