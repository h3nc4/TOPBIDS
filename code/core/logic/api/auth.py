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

from ..models import *
from ..utils import generate_token, decode_token
from .schemas import *
from django.http import JsonResponse
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from ninja import Router
import json


auth_router = Router()


@auth_router.post("/signup/")
def signup(request):
    inpt = json.loads(request.body.decode("utf-8")).get('user', {})
    try:
        User.objects.create(username=inpt['username'],  email=inpt['email'],  password=make_password(inpt['password']),  cpf=inpt['cpf'],
                            phone=inpt['phone'],  address=inpt['address'],  city=inpt['city'],  state=inpt['state'],  zip_code=inpt['zip_code'], buyer=Buyer.objects.create())
    except Exception:
         # print information about the error
         print("Error: ", Exception)
         return JsonResponse({"status": "nok"}, status=400)
    user = User.objects.get(username=inpt['username'])
    return JsonResponse({"token": generate_token(user.id), "user": user.username})


@auth_router.post("/login/")
def user_login(request):
    inpt = json.loads(request.body.decode("utf-8")).get('user', [])
    user = authenticate(request, username=inpt['username'], password=inpt['password'])
    if user:
        return JsonResponse({"token": generate_token(user.id), "user": user.username})
    return JsonResponse({"error": "Invalid credentials"}, status=401)


@auth_router.post("/check/")
def check_token(request): # receices token and returns if it is valid
    try:
        body = json.loads(request.body.decode("utf-8"))
        user_id = decode_token(body.get('token', []))
        username = body.get('user', [])
        user = User.objects.get(id=user_id)
        if user.username == username:
            return JsonResponse({"status": "ok"})
        return JsonResponse({"status": "nok"}, status=401)
    except Exception:
        return JsonResponse({"status": "nok"}, status=401)


@auth_router.get("/deactivate/")
def deactivate_account(request):
    user = User.objects.get(id=decode_token(request.body.decode("utf-8")).get('jwt', []))
    if user:
        user.is_active = False
        user.save()
        return JsonResponse({"message": "Account deactivated"})
    return JsonResponse({"error": "Invalid token"}, status=401)


@auth_router.get("/update/")
def update_account(request):
    user = User.objects.get(id=decode_token(request.body.decode("utf-8")).get('jwt', []))
    if user:
        inpt = json.loads(request.body.decode("utf-8")).get('user', [])
        user.username = inpt['username'] if inpt['username'] else user.username
        user.email = inpt['email'] if inpt['email'] else user.email
        user.password = make_password(inpt['password']) if inpt['password'] else user.password
        user.cpf = inpt['cpf'] if inpt['cpf'] else user.cpf
        user.phone = inpt['phone'] if inpt['phone'] else user.phone
        user.address = inpt['address'] if inpt['address'] else user.address
        user.city = inpt['city'] if inpt['city'] else user.city
        user.state = inpt['state'] if inpt['state'] else user.state
        user.zip_code = inpt['zip_code'] if inpt['zip_code'] else user.zip_code
        user.save()
        return JsonResponse({"message": "Account updated"})
    return JsonResponse({"error": "Invalid token"}, status=401)
