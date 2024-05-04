#  Copyright 2024 TopBids
# 
# This file is part of TopBids.
# 
# TopBids is free software: you can redistribute it and/or modify it
# under the terms of the GNU Affero General Public License as published by the Free
# Software Foundation, either version 3 of the License, or (at your option) any
# later version.
# 
# TopBids is distributed in the hope that it will be
# useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero
# General Public License for more details.
# 
# You should have received a copy of the GNU Affero
# General Public License along with TopBids. If not, see
# <https://www.gnu.org/licenses/>.

from ninja import Schema


class ItemSchema(Schema):
    id: int
    name: str
    description: str
    price: float
    vendor: str
    date: str
    image: str


class SignupInput(Schema):
    username: str
    email: str
    password: str
    cpf: str
    phone: str
    address: str
    city: str
    state: str
    zip_code: str


class LoginInput(Schema):
    username: str
    password: str
