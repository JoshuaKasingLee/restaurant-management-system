export function nextOrderStatus(status) {
  switch (status) {
    case "ordered":     return "cooking";
    case "cooking":     return "prepared";
    case "prepared":    return "completed";
    default:            return null;
  }
};

export const ALL_TAGS_LIST = [
  'vegetarian',
  'vegan',
  'gluten free',
  'nut free',
  'dairy free',
  'chef recommended'
];