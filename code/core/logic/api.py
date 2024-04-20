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

from django.http import JsonResponse
from ninja import Router
from ninja import Schema
from .models import *
from typing import List
import base64
import json


api_router = Router()


class ItemSchema(Schema):
    id: int
    name: str
    description: str
    price: float
    vendor: str
    date: str
    image: str


@api_router.get("/status/")
def status(request):
    return JsonResponse({"status": "ok"})


def get_selected_items(items):
    response_data = []
    for item in items:
        latest_auction = Auction.objects.filter(item=item, status__in=['P', 'O']).first()
        if not latest_auction:
            continue
        item_data = {
            "id": item.id,
            "name": item.name,
            "description": item.description,
            "price": item.price,
            "vendor": item.vendor.username,
            "date": latest_auction.date_and_time.strftime('%Y-%m-%d %H:%M:%S'),
            "image": base64.b64encode(item.image).decode('utf-8'),
        }
        response_data.append(item_data)
    return response_data


@api_router.get("/items/", response=List[ItemSchema])
def get_items(request):
    return get_selected_items(Item.objects.all())


@api_router.post("/items/update/", response=List[ItemSchema])
def update_items(request):
    ids = json.loads(request.body.decode("utf-8")).get('ids', [])
    return get_selected_items(Item.objects.exclude(id__in=ids))
