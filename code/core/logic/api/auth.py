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
from ..utils import generate_token, decode_token, _mail, account_activation_token
from .schemas import *
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.http import JsonResponse
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
    except Exception as e:
        print("Error: ", e)
        return JsonResponse({"status": "nok", "error": str(e)}, status=400)
    if not Configs.objects.first().emails:
        user = User.objects.get(username=inpt['username'])
        return JsonResponse({"token": generate_token(user.id), "user": user.username})
    user = User.objects.get(username=inpt['username'])
    user.is_active = False
    user.save()
    content =  """
    Olá {{ user }},
    {% autoescape off %}
    Por favor, clique no link abaixo para confirmar seu cadastro:

    {{ protocolo }}://{{ dominio }}{% url 'efetuar_ativacao' uidb64=uid token=token %}
    {% endautoescape %}
    """
    _mail("Ative sua conta", content, {
        'user': user.username,
        "protocolo": 'https' if request.is_secure() else 'http',
        'dominio': get_current_site(request).domain,
        'uid': urlsafe_base64_encode(force_bytes(user.pk)),
        'token': account_activation_token.make_token(user),
    }, user.email)
    return JsonResponse({"status": "ok"})


@auth_router.post("/login/")
def user_login(request):
    inpt = json.loads(request.body.decode("utf-8")).get('user', [])
    user = authenticate(request, username=inpt['username'], password=inpt['password'])
    if user:
        if not user.is_active:
            return JsonResponse({"error": "Account not activated"}, status=401)
        return JsonResponse({"token": generate_token(user.id), "user": user.username})
    return JsonResponse({"error": "Invalid credentials"}, status=401)


@auth_router.post("/check/")
def check_token(request): # receives token and returns if it is valid
    try:
        body = json.loads(request.body.decode("utf-8"))
        user_id = decode_token(body.get('token', []))
        username = body.get('user', [])
        user = User.objects.get(id=user_id)
        if user.username == username and user.is_active:
            return JsonResponse({"user_id": user_id, "status": "ok"})
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
