export const getPromotions = (params) => ({
  method: 'GET',
  url: 'promotions',
  params
});

export const getPromotionsById = (id) => ({
  method: 'GET',
  url: `promotions/${id}`,
});

export const createPromotion = (data) =>({
  method: 'POST',
  url: 'promotions',
  data
});
