export const denormalizeFilters = (filters) => ({
  ...filters,
  status: filters.status.map((status) => status.toLowerCase()),
  brand: filters.brand.brand,
  model: filters.model.model,
})
