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
from django.shortcuts import redirect, render
from datetime import datetime


def index(request):
    return render(request, 'index.html')


def novo_item(request):
    if request.method != 'POST':
        return render(request, 'vendedor/novo.html')
    nome = request.POST.get('nome')
    descricao = request.POST.get('descricao')
    preco = request.POST.get('preco')
    imagem = request.FILES.get('imagem')
    data = request.POST.get('data')
    if imagem is None:
        return render(request, 'vendedor/novo.html', {'erro': 'Selecione uma imagem.'})
    if not nome or not descricao or not preco:
        return render(request, 'vendedor/novo.html', {'erro': 'Preencha todos os campos.'})
    if not preco.replace('.', '').replace(',', '').isdigit():
        return render(request, 'vendedor/novo.html', {'erro': 'Preço inválido.'})
    preco = preco.replace(',', '.')
    if float(preco) <= 0:
        return render(request, 'vendedor/novo.html', {'erro': 'Preço inválido.'})
    if float(preco) > 99999999.99:
        return render(request, 'vendedor/novo.html', {'erro': 'Preço inválido.'})
    if len(nome) > 50 or len(descricao) > 1000:
        return render(request, 'vendedor/novo.html', {'erro': 'Nome ou descrição muito longos.'})
    if imagem.size > 10485760:
        return render(request, 'vendedor/novo.html', {'erro': 'Imagem muito grande.'})
    if not data:
        return render(request, 'vendedor/novo.html', {'erro': 'Selecione uma data. Não se preocupe, você poderá alterá-la depois.'})
    try:
        data_hora = datetime.strptime(data, '%Y-%m-%dT%H:%M')
    except ValueError:
        return render(request, 'vendedor/novo.html', {'erro': 'Formato de data e hora inválido.'})
    Auction.objects.create(
        item=Item.objects.create(name=nome, description=descricao,
                                 price=preco, image=imagem.read(),
                                 vendor=User.objects.get(id=request.user.id)),
        date_and_time=data_hora,
        starting_price=preco
    )
    return redirect('itens')


def itens(request):
    return render(request, 'vendedor/itens.html', {
        'auctions': Auction.objects.filter(item__vendor=request.user, status__in=['P', 'O']),
        'completed_auctions': Auction.objects.filter(item__vendor=request.user, status='F'),
        'cancelled_auctions': Auction.objects.filter(item__vendor=request.user, status='C'),
    })



def change_auction_date(request, auction_id):
    if request.method != 'POST':
        return render(request, 'error.html', {'error': 'Método de requisição inválido.'})
    new_date = request.POST.get('new_date')
    try:
        new_date_time = datetime.strptime(new_date, '%Y-%m-%dT%H:%M')
        auction = Auction.objects.get(pk=auction_id)
        auction.reschedule()
        Auction.objects.create(
            item=auction.item,
            date_and_time=new_date_time,
            starting_price=auction.starting_price
        )
        return redirect('itens')
    except ValueError:
        return render(request, 'error.html', {'error': 'Formato de data e hora inválido.'})


def delete_auction(request, auction_id):
    Auction.objects.get(pk=auction_id).cancel()
    return redirect('itens')
