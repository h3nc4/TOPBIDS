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
from datetime import datetime
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
            "date": latest_auction.date_and_time.strftime('%Y-%m-%d %H:%M'),
            "image": base64.b64encode(item.image).decode('utf-8'),
        }
        response_data.append(item_data)
    return response_data


@api_router.get("/items/", response=List[ItemSchema])
def get_items(request):
    return get_selected_items(Item.objects.all())


@api_router.post("/items/update/", response=dict)
def update_items(request):
    c_info = json.loads(request.body.decode("utf-8")).get('localItems', []) # client side info
    c_item_ids = [item['id'] for item in c_info] # the ids of the items last known by the client
    c_items = Item.objects.filter(id__in=c_item_ids).select_related('auction')
    items_to_delete = []
    updated_items = []
    for info in c_info:
        item = next((x for x in c_items if x.id == info['id']), None)
        if not item:
            items_to_delete.append(info['id'])
        elif item.auction.status not in ['P', 'O']:
            items_to_delete.append(info['id'])
        elif item.auction.date_and_time.strftime('%Y-%m-%d %H:%M') != info['date']:
            updated_items.append({'id': item.id, 'date': item.auction.date_and_time.strftime('%Y-%m-%d %H:%M')})
    response_data = {
        "delete": items_to_delete,
        "update": updated_items,
        "add": get_selected_items(Item.objects.exclude(id__in=c_item_ids))
    }
    return response_data
