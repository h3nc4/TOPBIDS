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
from ninja import Router
import json


auction_router = Router()


@auction_router.post("/update/")
def update(request):
    print(json.loads(request.body.decode("utf-8")))
    body = json.loads(request.body.decode("utf-8"))
    auction = Item.objects.get(id=body['item']).auction
    auction.current_price = float(body['updated_value'])
    auction.last_buyer = User.objects.get(username=body['user'])
    auction.save()
