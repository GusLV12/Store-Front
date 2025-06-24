export const getUsers = (params) => ({
  method: 'GET',
  url: 'users',
  params,
});

export const createUser = (data) => ({
  method: 'POST',
  url: 'users',
  data,
});

export const getUserByID = (id) => ({
  method: 'GET',
  url:`users/${id}`,
});

export const updateUser = (id, data) => ({
  method: 'PUT',
  url: `users/${id}`,
  data,
});

export const deleteUser = (id) => ({
  method: 'DELETE',
  url: `users/${id}`,
});
