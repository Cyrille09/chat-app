export const recordNotFound = (message: string) => {
  const error: any = new Error();
  error.status = 404;
  error.message = `${message} Not Found!`;
  return error;
};

export const unauthorizedError = (message?: string) => {
  const error: any = new Error();
  error.status = 401;
  error.message = `${message || "Unauthorized"}`;
  return error;
};
