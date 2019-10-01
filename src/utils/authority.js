// use localStorage to store the authority info
// return localStorage.getItem('authority') || 'user';
// authority could be 'admin' or 'user
export function getAuthority() {
  return localStorage.getItem('authority');
}

export function setAuthority(authority) {
  return localStorage.setItem('authority', authority);
}

export function getTokens() {
  return {
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken'),
  };
}

export function setTokens(payload) {
  localStorage.setItem('token', payload.token);
  localStorage.setItem('refreshToken', payload.refreshToken);
}

export function getEmail() {
  return localStorage.getItem('email');
}

export function setEmail(email) {
  localStorage.setItem('email', email);
}

export function getRole() {
  return localStorage.getItem('role');
}

export function setRole(payload) {
  let userRole;
  if (payload.role === 'admin') userRole = 'admin';
  else if (payload.companyType === 'authority') userRole = 'authority';
  else if (payload.companyType === 'contractor') userRole = 'contractor';
  else if (payload.state === 'verified') userRole = 'user';

  localStorage.setItem('role', userRole);
}
