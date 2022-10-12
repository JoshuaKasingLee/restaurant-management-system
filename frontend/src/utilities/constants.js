export function nextOrderStatus(status) {
    switch (status) {
        case "ordered":     return "cooking";
        case "cooking":     return "prepared";
        case "prepared":    return "completed";
        default:            return null;
    }
};