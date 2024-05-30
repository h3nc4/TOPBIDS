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
from python_ipware import IpWare
from datetime import datetime
from datetime import timedelta
import threading

active_guards = {}  # Active guards and their last ping time
index_router = Router()
ipw = IpWare()


@index_router.get("/status/")
def status(request):
    ip, trusted_route = ipw.get_client_ip(request.META)
    if ip:  # Add or Update the guard to the active guards list
        active_guards[ip] = datetime.now()
        print('Active guards:\n', active_guards)
        return JsonResponse({"status": "ok"})
    return JsonResponse({"error": "Couldnt get ip"}, status=500)


@index_router.get("/get/")
def get(request): # Get the list of active guards and only return their IPs
    guards = [str(ip) for ip in active_guards.keys()]
    print(guards)
    return JsonResponse({"guards": guards})

def remove_inactive_guards():
    inactive_threshold = datetime.now() - timedelta(minutes=12) # 12 minutes threshold
    for ip, last_ping_time in list(active_guards.items()):  # Using list() to avoid 'dictionary changed size during iteration' error
        if last_ping_time < inactive_threshold:
            del active_guards[ip]


def check_inactive_guards_periodically():
    while True:
        remove_inactive_guards()
        threading.Event().wait(60)  # Sleep for 1 minute before checking again


inactive_guards_thread = threading.Thread(
    target=check_inactive_guards_periodically)
inactive_guards_thread.daemon = True
inactive_guards_thread.start()
