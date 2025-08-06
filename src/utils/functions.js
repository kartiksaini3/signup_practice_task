export const commonReturn = (res, message, data, status = 200) =>
  res.status(status).send({
    message,
    data,
  });
