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
