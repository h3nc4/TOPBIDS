# Código fonte - Guard

## Pré-requisitos

Crie um arquivo .config.js na raiz do projeto com as variáveis de ambiente:

```bash
cp .config.js.example .config.js
```

Preencha as variáveis de ambiente com os valores desejados:

```json
"MQ_CONNECTION_URL": "amqp://localhost",
"EXCHANGE_NAME": "exchangeName",
"WS_PORT": 3000
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
cd code/guard
npm start
```

## Suíte de teste de WS e MQ

Este script inicia duas instâncias do guard e de um cliente em portas diferentes para testar a comunicação entre guardas e clientes

```bash
./test/testWSMQ.sh
```
