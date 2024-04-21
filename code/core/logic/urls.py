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

from django.urls import path, include
from .controllers import views, auth
from ninja import NinjaAPI
from .api import api_router

api = NinjaAPI()
api.add_router('', api_router)

auth_patterns = [
    path('cadastro/', auth.cadastro, name='cadastro'),
    path('login/', auth.login, name='login'),
    path('logout/', auth.logout, name='logout'),
    path('ativar_conta/', auth.ativar_conta, name='ativar_conta'),
    path('efetuar_ativacao/<uidb64>/<token>', auth.efetuar_ativacao, name='efetuar_ativacao'),
    path('recuperar_senha/', auth.recuperar_senha, name='recuperar_senha'),
    path('redefinir_senha/<uidb64>/<token>', auth.redefinir_senha, name='redefinir_senha'),
]

urlpatterns = [
    path('api/', api.urls),
    path('auth/', include(auth_patterns)),
    path('', views.index, name='index'),
    path('itens/', views.itens, name='itens'),
    path('novo_item/', views.novo_item, name='novo_item'),
    path('change_auction_date/<int:auction_id>/', views.change_auction_date, name='change_auction_date'),
    path('delete_auction/<int:auction_id>/', views.delete_auction, name='delete_auction'),
]
