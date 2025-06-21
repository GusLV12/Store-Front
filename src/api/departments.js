export const getDepartments = () => ({
  method: 'GET',
  url: 'departments',
});

export const createDepartment = (data) => {
  return {
    method: 'POST',
    url: 'departments',
    data,
  };
};
