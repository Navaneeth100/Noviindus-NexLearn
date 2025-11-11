export const base = 'https://nexlearn.noviindusdemosites.in';

async function req(path, { method='GET', body, token, isForm=false } = {}) {
  const headers = {};

  if (token && !isForm) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!isForm && body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }

  if (isForm && token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${base}${path}`, {
    method,
    headers,
    body,
  });

  const data = await res.json().catch(() => ({}));

  // if (!res.ok) {
  //   throw new Error(data.message || "Request failed");
  // }

  return data;
}

export const api = {
  sendOtp: (mobile) => req('/auth/send-otp', { method:'POST', body:{ mobile } }),
  verifyOtp: (mobile, otp) => req('/auth/verify-otp', { method:'POST', body:{ mobile, otp } }),
  createProfile: (payload, token) => req('/auth/create-profile', { method:'POST', body: payload, token, isForm: true }),
  logout: () => req('/auth/logout', { method:'POST' }),
  questionList: (token) => req('/question/list', { method:'GET', token }),
  submitAnswers: (answers, token) => req('/answers/submit', { method:'POST', body:{ answers: JSON.stringify(answers) }, token }),
};
