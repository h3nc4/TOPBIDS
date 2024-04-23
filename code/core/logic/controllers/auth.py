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
from ..utils import mail, account_activation_token
from django.contrib.auth import authenticate, logout as logoff, login as logon
from django.contrib.auth.hashers import make_password
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str


estados = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
           'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']


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
    pix = request.POST.get('pix')
    if not nome or not email or not senha or not senha2 or not cpf or not telefone or not endereco or not cidade or not estado or not cep:
        return render(request, 'conta/cadastro.html', {'erro': 'Preencha todos os campos.', 'estados': estados})
    if len(nome) > 50 or len(email) > 50:
        return render(request, 'conta/cadastro.html', {'erro': 'Nome ou email muito longos.', 'estados': estados})
    if len(cpf) != 11:
        return render(request, 'conta/cadastro.html', {'erro': 'CPF inválido.', 'estados': estados})
    if len(telefone) != 11:
        return render(request, 'conta/cadastro.html', {'erro': 'Telefone inválido. Insira o DDD e o 9.', 'estados': estados})
    if len(endereco) > 100 or len(cidade) > 50 or len(estado) != 2 or len(cep) != 8:
        return render(request, 'conta/cadastro.html', {'erro': 'Dados inválidos.', 'estados': estados})
    if '@' not in email:
        return render(request, 'conta/cadastro.html', {'erro': 'Email inválido.', 'estados': estados})
    if senha != senha2:
        return render(request, 'conta/cadastro.html', {'erro': 'As senhas não coincidem.', 'estados': estados})
    if User.objects.filter(email=email).exists():
        return render(request, 'conta/cadastro.html', {'erro': 'Este email já está cadastrado.', 'estados': estados})
    if len(pix) > 36:
        return render(request, 'conta/cadastro.html', {'erro': 'Chave PIX inválida.'})
    usr = User.objects.create(username=nome, email=email,
                              password=make_password(senha), cpf=cpf,
                              phone=telefone, address=endereco, city=cidade,
                              state=estado, zip_code=cep,
                              vendor=Vendor.objects.create(pix=pix))
    if not Configs.objects.first().emails:
        logon(request, usr)
        return redirect('/')
    usr.is_active = False
    usr.save()
    return ativar_conta(request, usr, email)


def ativar_conta(request, usr, email):  # Ativação de conta
    mail("Ative sua conta", "email/ativacao.html", {
        'user': usr.username,
        "protocolo": 'https' if request.is_secure() else 'http',
        'dominio': get_current_site(request).domain,
        'uid': urlsafe_base64_encode(force_bytes(usr.pk)),
        'token': account_activation_token.make_token(usr),
    }, email)
    return render(request, 'conta/ativar_conta.html')


# Ativação de conta após o usuário clicar no link enviado por email
def efetuar_ativacao(request, uidb64, token):
    try:
        user = get_object_or_404(
            User, pk=force_str(urlsafe_base64_decode(uidb64)))
    except:
        return render(request, 'conta/ativar_conta.html', {'erro': 'Usuário não encontrado.'})
    if account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        return render(request, 'conta/ativar_conta.html', {'sucesso': True})
    return render(request, 'conta/ativar_conta.html', {'erro': 'Token inválido.'})


# Redefine a senha de um usuário e o redireciona para a página inicial
def redefinir_senha(request, uidb64, token):
    # Verifica se o token é válido e se o usuário existe
    try:
        user = get_object_or_404(
            User, pk=force_str(urlsafe_base64_decode(uidb64)))
    except:
        return render(request, 'conta/redefinir_senha.html', {'erro': 'Usuário não encontrado.'})
    if request.method != 'POST':
        if account_activation_token.check_token(user, token):
            return render(request, 'conta/redefinir_senha.html', {'uidb64': uidb64, 'token': token})
        else:  # Se o token não for válido, ou o usuário não existir, retorna um erro
            return render(request, 'conta/redefinir_senha.html', {'erro': 'Token inválido.'})
    # Se o método for POST, a senha do usuário é redefinida
    senha_crua = request.POST.get('senha')
    if not senha_crua:
        return render(request, 'conta/redefinir_senha.html', {'erro': 'Preencha todos os campos.'})
    user.password = make_password(senha_crua)
    user.save()
    return render(request, 'conta/redefinir_senha.html', {'sucesso': True})


# Página de redefinição de senha, recebe o email do usuário e manda um email de redefinição
def recuperar_senha(request):
    if request.method != 'POST':
        return render(request, 'conta/recuperar_senha.html')
    email = request.POST.get('email')
    if not email:
        return render(request, 'conta/recuperar_senha.html', {'erro': 'Preencha todos os campos.'})
    try:
        user = User.objects.get(email=email)
    except:
        user = None
    if user is None:
        return render(request, 'conta/recuperar_senha.html', {'erro': 'Usuário não encontrado.'})
    mail("Redefinição de senha", "email/redefinir_senha.html", {
        'user': user.username,
        "protocolo": 'https' if request.is_secure() else 'http',
        'dominio': get_current_site(request).domain,
        'uid': urlsafe_base64_encode(force_bytes(user.pk)),
        'token': account_activation_token.make_token(user),
    }, email)
    return render(request, 'conta/recuperar_senha.html', {'sucesso': True})


def login(request):
    if request.method != 'POST':
        return render(request, 'conta/login.html', {'emails': Configs.objects.first().emails})
    usuario = request.POST.get('usuario')
    senha = request.POST.get('senha')
    user = authenticate(request, username=usuario, password=senha)
    if user is None:
        return render(request, 'conta/login.html', {'erro': 'Login ou senha incorretos ou conta não ativada.'})
    logon(request, user)
    return redirect('/')


def logout(request):
    logoff(request)
    return redirect('/')
