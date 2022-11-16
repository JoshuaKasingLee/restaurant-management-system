export default function truncateString(str) {
    if (str.length > 12) {
      return str.slice(0, 11) + '...'
    }

    return str
  }