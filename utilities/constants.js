export const LOGIN = '/login';
export const REGISTER = '/register';

const BASE_URL = 'https://amenify.herokuapp.com/api';

export const ApiUrl = (url) => {
  return `${BASE_URL}${url}`;
};
