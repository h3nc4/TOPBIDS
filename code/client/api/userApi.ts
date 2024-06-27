/*
*  Copyright 2024 TopBids
* 
* This file is part of TopBids.
* 
* TopBids is free software: you can redistribute it and/or modify it
* under the terms of the GNU Affero General Public License as published by the Free
* Software Foundation, either version 3 of the License, or (at your option) any
* later version.
* 
* TopBids is distributed in the hope that it will be
* useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero
* General Public License for more details.
* 
* You should have received a copy of the GNU Affero
* General Public License along with TopBids. If not, see
* <https://www.gnu.org/licenses/>.
*/

import config from '../.config.json';

const API_URL = config.MASTER_URL + '/api';

export const loginUser = async (username: string, password: string): Promise<string> => {
  const response = await fetch(`${API_URL}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: { username, password } }),
  });
  if (response.ok || response.redirected) {
    const data = await response.json();
    return JSON.stringify(data);
  }
  throw new Error('Invalid credentials');
};

export const signupUser = async (user: string): Promise<string> => {
  console.log("Sending data: " + user);
  const response = await fetch(`${API_URL}/auth/signup/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: user,
  });
  if (response.ok || response.redirected) {
    const data = await response.json();
    return JSON.stringify(data);
  }
  const error = await response.json();
  throw new Error(JSON.stringify(error.error));
};

export const sendRecoveryEmail = async (email: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_URL}/auth/forgot/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (response.ok) {
    return await response.json();
  }
  const error = await response.json();
  throw new Error(error.error || 'Failed to send recovery email');
};

export const changeUserPassword = async (newPassword: string, uid: string, token: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_URL}/auth/reset/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ new_password: newPassword, uid, token }),
  });
  if (response.ok) {
    return await response.json();
  }
  const error = await response.json();
  throw new Error(error.error || 'Failed to change password');
};
