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


def index(request):
    return render(request, 'index.html')


def novo_item(request):
    if request.method != 'POST':
        return render(request, 'vendedor/novo.html')
    nome = request.POST.get('nome')
    descricao = request.POST.get('descricao')
    preco = request.POST.get('preco')
    imagem = request.FILES.get('imagem')
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
    if len(imagem) > 10485760:
        return render(request, 'vendedor/novo.html', {'erro': 'Imagem muito grande.'})
    Item.objects.create(name=nome, description=descricao, price=preco,
                        image=imagem.read(), vendor=User.objects.get(id=request.user.id))
    return redirect('itens')


def itens(request):
    return render(request, 'vendedor/itens.html', {'itens': User.objects.get(id=request.user.id).item_set.all()})
