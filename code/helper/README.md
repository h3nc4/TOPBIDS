# Código fonte - Guard

## Pré-requisitos

Crie um arquivo .env na raiz do guard com as variáveis de ambiente:

```bash
cp .env.example .env
```

Preencha as variáveis de ambiente com os valores desejados:

```bash
MQ_CONNECTION_URL="amqp://localhost"
EXCHANGE_NAME="exchange"
MASTER_URL="http://localhost:8000"
API_ROUTE="/api"
```

## Instalação

1. Instale os pacotes necessários:

    ```bash
    sudo apt install -y nodejs npm
    ```

2. Atualize ambos node e npm:

    ```bash
    sudo npm install -g n
    sudo n stable
    sudo npm install -g npm
    ```

3. Instale as dependências do projeto:

    ```bash
    cd code/guard
    npm install
    ```

## Execução em desenvolvimento

```bash
./scripts/run-helper.sh
```
