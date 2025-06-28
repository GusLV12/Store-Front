export const getCredits = () => ({
  method: 'GET',
  url: 'credits',
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
