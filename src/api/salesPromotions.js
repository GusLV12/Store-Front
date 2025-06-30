export const getSalesPromotions = (params) => ({
  method: 'GET',
  url: 'sales-promotions',
  params
});

export const createSalePromotion = (data) =>({
  method: 'POST',
  url: 'sales-promotions',
  data
});

export const deleteSalePromotion = (data) =>({
  method: 'DELETE',
  url: `sales-promotions/${id}`,
  data
});