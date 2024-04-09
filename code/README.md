# Código fonte - Servidor

## Pré-requisitos

Crie um arquivo .env na raiz do projeto com as variáveis de ambiente:

```bash
cp .env.example .env
```

Preencha as variáveis de ambiente com os valores desejados:

```bash
SECRET_KEY = 'Chave secreta do django'
DEBUG = 'Modo de depuração'
DATABASE_HOST = 'IP do banco de dados'
DATABASE_PORT = 'Porta do banco de dados'
DATABASE_NAME = 'Nome do banco de dados'
DATABASE_USER = 'Usuário do banco de dados'
DATABASE_PASSWORD = 'Senha do banco de dados'
EMAIL_USER = 'Usuário do email de envio'
EMAIL_PASSWORD = 'Senha do email de envio'
EMAIL_HOST = 'Servidor de email de envio'
```

Para gerar uma chave do django, use o seguinte comando:

```bash
python3 code/core/manage.py shell -c 'from django.core.management import utils; print(utils.get_random_secret_key())'
```

Caso não deseje usar postgresql, altere o arquivo code/core/app/settings.py para usar sqlite3.

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'db.sqlite3',
    }
}
```

## Instalação

1. Instale os pacotes necessários:

    ```bash
    sudo apt install -y python3 python3-pip python3-venv libpq-dev
    ```

2. [Instale docker](https://docs.docker.com/engine/install/)

3. Crie um ambiente virtual, instale as dependências do pip e migre o banco de dados:

    ```bash
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -U pip wheel setuptools
    pip install -r code/core/requirements.txt
    python3 code/core/manage.py makemigrations
    python3 code/core/manage.py migrate
    ```

Use `deactivate` para sair do ambiente virtual.

Use `source .venv/bin/activate` antes de executar qualquer dos seguintes comandos.

## Execução em desenvolvimento

```bash
docker run -d -p 5432:5432 --name postgres -e POSTGRES_USER=user -e POSTGRES_PASSWORD=senha postgres
python3 code/core/manage.py runserver
```

## Gerar modelo ER

```bash
./scripts/db.sh
```
