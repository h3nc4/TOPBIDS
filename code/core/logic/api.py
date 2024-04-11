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

from ninja import Router
from ninja import ModelSchema
from .models import *
from typing import List
from django.http import StreamingHttpResponse, JsonResponse


api_router = Router()


class ItemSchema(ModelSchema):
    class Meta:
        model = Item
        fields = '__all__'


@api_router.get("/status/")
def status(request):
    return JsonResponse({"status": "ok"})


@api_router.get("/items/", response=List[ItemSchema])
def get_items(request):
    items = Item.objects.all()
    response_data = []
    for item in items:
        item_data = {
            "name": item.name,
            "description": item.description,
            "price": item.price,
            "vendor": item.vendor.id,
            "image": item.image.tobytes(),
        }
        response_data.append(item_data)
    return StreamingHttpResponse(response_data, content_type="application/octet-stream")
