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

// --------------------------- | Endpoints creditCahneges | ---------------------------
export const createCreditChange = (data) => ({
  method: 'POST',
  url: 'credit-changes',
  data,
});

export const creditByUser = (id)=> ({
  method: 'GET',
  url: `credit-changes/payment/${id}`,
});
