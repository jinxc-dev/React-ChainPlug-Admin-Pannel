import request from '@/utils/request';
import { getEmail, getTokens } from '@/utils/authority';

export async function query() {
  return request('/api/users');
}

export async function queryUser(params = {}) {
  const { token } = getTokens();

  return request(`/api/v1/users/${params.email}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: 'GET',
  });
}

export async function updateUser(params = {}) {
  const { token } = getTokens();
  const email = getEmail();

  return request(`/api/v1/users/${email}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: 'PATCH',
    data: params,
  });
}
