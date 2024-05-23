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
    if (response.ok) {
        const data = await response.json();
        return JSON.stringify(data);
    }
    throw new Error('Invalid credentials');
};

export const signupUser = async (username: string, email: string, password: string, cpf: string, phone: string, address: string, city: string, state: string, zipCode: string): Promise<string> => {
    console.log("Sending data: " + JSON.stringify({ user: { username, email, password, cpf, phone, address, city, state, zip_code: zipCode } }));
    const response = await fetch(`${API_URL}/auth/signup/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: { username, email, password, cpf, phone, address, city, state, zip_code: zipCode } }),
    });
    if (response.ok) {
        const data = await response.json();
        return JSON.stringify(data);
    }
    throw new Error('Error signing up');
};
