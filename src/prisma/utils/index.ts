export const buildDbUrl = (
  DB_URL: string,
  DB_SCHEMA: string,
  DB_POOL_SIZE = 15,
  DB_POOL_TIME_OUT = 10
) => {
  return `${DB_URL}?schema=${DB_SCHEMA}&connection_limit=${DB_POOL_SIZE}&pool_timeout=${DB_POOL_TIME_OUT}`;
};
