import { LoginUserRequest, RegisterUserRequest } from '../model/User';

const SERVICE_API_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:8080/v1/api/users';

const LOGIN_ENDPOINT = `${SERVICE_API_URL}/login`;
const REGISTER_ENDPOINT = `${SERVICE_API_URL}/register`;
const VALIDATE_ENDPOINT = `${SERVICE_API_URL}/validate`;

const state = {
  response: null
};

const normalizeResponse = (payload, fallbackMessage) => {
  if (!payload) {
    return {
      success: false,
      message: fallbackMessage || 'Unexpected empty response from server.'
    };
  }

  if (typeof payload.success === 'boolean') {
    return payload;
  }

  // Backward compatibility for Optional-like wrappers.
  if (payload.value && typeof payload.value.success === 'boolean') {
    return payload.value;
  }

  if (payload.data && typeof payload.data.success === 'boolean') {
    return payload.data;
  }

  return {
    success: false,
    message: fallbackMessage || payload.message || 'Unexpected server response.'
  };
};

const parseJsonSafe = async (response) => {
  const text = await response.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
};

const postFetch = async (data, endpoint, options = {}) => {
  const headers = options.headers || { 'Content-Type': 'application/json' };
  const body =
    Object.prototype.hasOwnProperty.call(options, 'body') && options.body !== undefined
      ? options.body
      : JSON.stringify(data);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body
  });

  const payload = await parseJsonSafe(response);

  if (!response.ok) {
    const normalizedError = normalizeResponse(
      payload,
      `Request failed (${response.status}). Please try again.`
    );
    state.response = normalizedError;
    throw new Error(normalizedError.message || 'Request failed.');
  }

  const normalized = normalizeResponse(payload);
  state.response = normalized;
  return normalized;
};

const persistSession = (result) => {
  const data = result?.data || {};
  const rawToken = data?.token;
  const token =
    typeof rawToken === 'string'
      ? rawToken
      : rawToken?.key || rawToken?.token || rawToken?.value || '';

  if (!token) {
    throw new Error('Login succeeded but token is missing in the response.');
  }

  localStorage.setItem('token', token);
  if (data.uid !== undefined && data.uid !== null) {
    localStorage.setItem('uid', String(data.uid));
  }
  if (data.mail) {
    localStorage.setItem('mail', data.mail);
  }
  if (data.name) {
    localStorage.setItem('name', data.name);
  }
  if (data.surname) {
    localStorage.setItem('surname', data.surname);
  }
};

const UserService = {
  getResponse() {
    return state.response;
  },

  setResponse(value) {
    state.response = value;
  },

  async login(mail, password) {
    const loginUser = new LoginUserRequest(mail, password);
    const result = await postFetch(loginUser, LOGIN_ENDPOINT);

    if (!result.success) {
      throw new Error(result.message || 'Login failed.');
    }

    persistSession(result);
    return result;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('uid');
    localStorage.removeItem('mail');
    localStorage.removeItem('name');
    localStorage.removeItem('surname');
  },

  async isTokenValid(token) {
    if (!token) {
      const res = { success: false, message: 'No token provided.' };
      state.response = res;
      return false;
    }

    try {
      const response = await fetch(VALIDATE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: token
      });

      if (!response.ok) {
        state.response = { success: false, message: 'Token validation failed.' };
        return false;
      }

      const payload = await parseJsonSafe(response);
      const isValid = Boolean(payload);
      state.response = { success: isValid, data: payload };
      return isValid;
    } catch (error) {
      state.response = {
        success: false,
        message: 'Unable to validate session. Please sign in again.'
      };
      return false;
    }
  },

  async register(name, surname, mail, password) {
    const registerUser = new RegisterUserRequest(name, surname, mail, password);
    const result = await postFetch(registerUser, REGISTER_ENDPOINT);
    if (!result.success) {
      throw new Error(result.message || 'Registration failed.');
    }
    return result;
  }
};

export default UserService;
