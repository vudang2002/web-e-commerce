export const formatResponse = (success, message, data = null) => {
  return { success, message, data };
};

export const createResponse = (data, message = "Success") => {
  return formatResponse(true, message, data);
};
