export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateValidity = (validity) => {
  return Number.isInteger(Number(validity)) && validity > 0;
};

export const validateShortcode = (shortcode) => {
  return !shortcode || /^[a-zA-Z0-9]{4,10}$/.test(shortcode);
};