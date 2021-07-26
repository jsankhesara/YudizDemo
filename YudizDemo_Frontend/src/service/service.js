import axios from 'axios';
const BASE_URL = 'http://localhost:3001'

export const API = {
    SignUp: (user) => {
        return axios.post(BASE_URL + `/api/query/register`, user)
        .then(res => res.data
        ).catch(error => {
            throw error;
          });
    },
    Login: (user) => {
        return axios.post(BASE_URL + `/api/query/login`, user)
        .then(res => res.data
        ).catch(error => {
            throw error;
          });
    },
  };