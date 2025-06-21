export const getTypes = () => ({
  method: 'GET',
  url: 'types',
});

export const createType = (data) => {
  return {
    method: 'POST',
    url: 'types',
    data,
  };
};
