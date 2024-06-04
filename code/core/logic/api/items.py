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
from .schemas import ItemSchema
from django.utils.timezone import now
from typing import List
from ninja import Router
from datetime import timedelta
import base64
import json


item_router = Router()


def format_items(items):
    response_data = []
    for item in items:
        item_data = {
            "id": item.id,
            "name": item.name,
            "description": item.description,
            "price": item.base_price,
            "vendor": item.vendor.username,
            "date": item.auction.date_and_time.strftime('%Y-%m-%d %H:%M'),
            "image": base64.b64encode(item.image).decode('utf-8'),
        }
        response_data.append(item_data)
    return response_data


@item_router.get("/", response=List[ItemSchema])
def get_items(request):
    fifteen_minutes_ago = now() - timedelta(minutes=15)
    return format_items(Item.objects.filter(auction__status__in=['P', 'O'],
                                                auction__date_and_time__gt=fifteen_minutes_ago))


@item_router.post("/update/", response=dict)
def update_items(request):
    c_info = json.loads(request.body.decode("utf-8")).get('localItems', []) # client side info
    c_item_ids = [item['id'] for item in c_info] # the ids of the items last known by the client
    c_items = Item.objects.filter(id__in=c_item_ids).select_related('auction')
    items_to_delete = []
    updated_items = []
    fifteen_minutes_ago = now() - timedelta(minutes=15)
    for info in c_info:
        item = next((x for x in c_items if x.id == info['id']), None)
        if not item or item.auction.date_and_time < fifteen_minutes_ago or item.auction.status not in ['P', 'O']:
            items_to_delete.append(info['id'])
        elif item.auction.date_and_time.strftime('%Y-%m-%d %H:%M') != info['date']:
            updated_items.append({'id': item.id, 'date': item.auction.date_and_time.strftime('%Y-%m-%d %H:%M')})
    return {
        "delete": items_to_delete,
        "update": updated_items,
        "add": format_items(Item.objects.exclude(id__in=c_item_ids)
                                .filter(auction__status__in=['P', 'O'],
                                        auction__date_and_time__gt=fifteen_minutes_ago)
        )
    }


@item_router.post("/my_items/", response=List[int])
def my_items(request):
    fifteen_minutes_ago = now() - timedelta(minutes=15)
    items = Item.objects.filter(auction__status__in=['P', 'O'],
                                auction__date_and_time__gt=fifteen_minutes_ago,
                                # auction__last_buyer=request.user)
                                auction__last_buyer=request.body.decode("utf-8").get('id'))
    for item in items:
        if item.auction.date_and_time <= fifteen_minutes_ago:
            item.auction.status = 'F' if item.auction.last_buyer is not None else 'C'
            item.auction.save()
    return [item.id for item in items]
