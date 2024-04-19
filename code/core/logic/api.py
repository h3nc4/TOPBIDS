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
from django.db.models import Max
from ninja import Router
from ninja import Schema
from .models import *
from typing import List
import base64


api_router = Router()


class ItemSchema(Schema):
    name: str
    description: str
    price: float
    vendor: str
    date: str
    image: str


@api_router.get("/status/")
def status(request):
    return JsonResponse({"status": "ok"})


@api_router.get("/items/", response=List[ItemSchema])
def get_items(request):
    items = Item.objects.filter(
        auction__status__in=['P', 'O']).distinct().order_by('auction__date_and_time')
    response_data = []
    for item in items:
        latest_auction = Auction.objects.filter(item=item, status__in=['P', 'O']).aggregate(
            Max('date_and_time'))['date_and_time__max']
        auction_date = latest_auction.strftime(
            '%Y-%m-%d %H:%M:%S') if latest_auction else None
        if not auction_date:
            continue

        item_data = {
            "name": item.name,
            "description": item.description,
            "price": item.price,
            "vendor": item.vendor.username,
            "date": auction_date,
            "image": base64.b64encode(item.image).decode('utf-8'),
        }
        response_data.append(item_data)
    return response_data
