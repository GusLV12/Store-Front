export const getCredits = (params) => ({
  method: 'GET',
  url: 'credits',
  params
});

export const getCreditById = (id) => ({
  method: 'GET',
  url: `credits/${id}`,
});

export const createCredit = (data) => ({
  method: 'POST',
  url: 'credits',
  data,
});

export const updateCredit = (id, data) => ({
  method: 'PUT',
  url: `credits/${id}`,
  data,
});

export const deleteCredit = (id) => ({
  method: 'DELETE',
  url: `credits/${id}`,
});

// Endpoint CreditChanges
