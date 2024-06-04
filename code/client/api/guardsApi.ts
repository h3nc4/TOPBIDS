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

interface GuardsResponse {
  guards: string[];
}

export const getGuards = async (): Promise<Array<string>> => {
  const response = await fetch(`${API_URL}/guard/get`);
  const data: GuardsResponse = await response.json();
  if (!response.ok && !response.redirected) {
    console.log('Error fetching guards:', data);
    throw new Error(JSON.stringify(data));
  }
  return data.guards;
}
