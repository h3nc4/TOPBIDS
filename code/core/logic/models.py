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

from django.db import models
from django.contrib.auth.models import AbstractUser


class Vendor(models.Model):
    pix = models.CharField(max_length=36)


class Buyer(models.Model):
    items_to_pay = models.ForeignKey('Auction', on_delete=models.DO_NOTHING)
    bought_items = models.ForeignKey('Item', on_delete=models.DO_NOTHING)
    active = models.BooleanField(default=True)
    def buy_item(self, item):
        self.items_to_pay = item.auction
        self.bought_items = item
        self.save()


class User(AbstractUser):
    email = models.EmailField(unique=True)
    cpf = models.CharField(max_length=11, unique=True)
    phone = models.CharField(max_length=11)
    address = models.CharField(max_length=100)
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=2)
    zip_code = models.CharField(max_length=8)
    vendor = models.OneToOneField(Vendor, on_delete=models.CASCADE, null=True, blank=True)
    buyer = models.OneToOneField(Buyer, on_delete=models.CASCADE, null=True, blank=True)
    is_superuser = None; is_staff = None; first_name = None; last_name = None # Herdados de AbstractUser mas sem uso


class Auction(models.Model):
    date_and_time = models.DateTimeField(null=True, blank=True)
    starting_price = models.DecimalField(max_digits=10, decimal_places=2)
    current_price = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=True, blank=True)
    last_buyer = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=True, blank=True)
    status = models.CharField(max_length=1, choices=[('P', 'Planned'), ('O', 'Ongoing'), ('F', 'Finished'), ('C', 'Cancelled')], default='P')
    def reschedule(self, new_date):
        self.date_and_time = new_date
        self.status = 'P'
        self.save()
    def cancel(self):
        self.date_and_time = None
        self.status = 'C'
        self.save()

class Item(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    vendor = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    image = models.BinaryField()
    auction = models.OneToOneField(Auction, on_delete=models.CASCADE)

class Configs(models.Model):
    emails = models.BooleanField(default=False)
