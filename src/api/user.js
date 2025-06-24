export const getUsers = {
  method: 'GET',
  url: 'users',
};

export const createUser = (data) => ({
  method: 'POST',
  url: 'users',
  data
});

export const getUserByID = {
  method: 'GET',
  url: 'users/:id',
};

export const updateUser = {
  method: 'PUT',
  url: 'users',
};

export const deleteUser = {
  method: 'DELETE',
  url: 'users',
};
