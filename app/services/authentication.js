import { apiEndpoint } from '../../config/app';
import createRestApiClient from '../utils/createRestApiClient';

export default () => {
  const client = createRestApiClient().withConfig({ baseURL: apiEndpoint });
  return {
    getList: () => client.request({
      method: 'GET',
      url: '/results'
    }),
    getExam: (examId) => client.request({
      method: 'GET',
      url: '/results/' + examId
    }),
    login: ({ username, password }) => client.request({
      method: 'POST',
      url: '/sessions',
      data: {
        username,
        password
      }
    }),
    signUp: ({ email, password }) => client.request({
      method: 'POST',
      url: '/users',
      data: {
        email,
        password
      }
    }),
    examSubmit: (data) => client.request({
      method: 'POST',
      url: '/users/exam',
      data
    }),
    logOut: () => client.request({
      method: 'DELETE',
      url: '/sessions'
    })
  };
};

