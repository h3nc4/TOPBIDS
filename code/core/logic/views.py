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

from django.shortcuts import render
from .models import *
from django.contrib.auth import authenticate, logout as logoff, login as logon
from django.contrib.auth.hashers import make_password

estados = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
           'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']


def index(request):
    return render(request, 'index.html')


def cadastro(request):
    if request.method != 'POST':
        return render(request, 'conta/cadastro.html', {'estados': estados})
    nome = request.POST.get('nome')
    email = request.POST.get('email')
    senha = request.POST.get('senha')
    senha2 = request.POST.get('senha2')
    cpf = request.POST.get('cpf')
    telefone = request.POST.get('telefone')
    endereco = request.POST.get('endereco')
    cidade = request.POST.get('cidade')
    estado = request.POST.get('estado')
    cep = request.POST.get('cep')
    if not nome or not email or not senha or not senha2 or not cpf or not telefone or not endereco or not cidade or not estado or not cep:
        return render(request, 'conta/cadastro.html', {'erro': 'Preencha todos os campos.', 'estados': estados})
    if len(nome) > 50 or len(email) > 50 or len(cpf) != 11 or len(telefone) != 11 or len(endereco) > 100 or len(cidade) > 50 or len(estado) != 2 or len(cep) != 8:
        return render(request, 'conta/cadastro.html', {'erro': 'Dados inválidos.', 'estados': estados})
    if '@' not in email:
        return render(request, 'conta/cadastro.html', {'erro': 'Email inválido.', 'estados': estados})
    if senha != senha2:
        return render(request, 'conta/cadastro.html', {'erro': 'As senhas não coincidem.', 'estados': estados})
    if User.objects.filter(email=email).exists():
        return render(request, 'conta/cadastro.html', {'erro': 'Este email já está cadastrado.', 'estados': estados})
    logon(request, User.objects.create(username=nome, email=email, password=make_password(
        senha), cpf=cpf, phone=telefone, address=endereco, city=cidade, state=estado, zip_code=cep))
    return render(request, 'index.html')


def login(request):
    if request.method != 'POST':
        return render(request, 'conta/login.html')
    usuario = request.POST.get('usuario')
    senha = request.POST.get('senha')
    user = authenticate(request, username=usuario, password=senha) or authenticate(
        request, email=usuario, password=senha)
    if user is None:
        return render(request, 'conta/login.html', {'erro': 'Login ou senha incorretos.'})
    logon(request, user)
    return render(request, 'index.html')


def logout(request):
    logoff(request)
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
    Item.objects.create(name=nome, description=descricao, price=preco, image=imagem.read(), vendor=User.objects.get(id=request.user.id))
    return render(request, 'index.html')

def itens(request):
    return render(request, 'vendedor/itens.html', {'itens': User.objects.get(id=request.user.id).item_set.all()})
