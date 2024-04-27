# Código fonte - Cliente

## Pré-requisitos

Crie um arquivo .config.json na raiz do cliente com as variáveis de ambiente:

```bash
cp .config.json.example .config.json
```

Preencha as variáveis de ambiente com os valores desejados:

```json
"MASTER_URL": "Url do core",
"API_ROUTE": `${MASTER_URL}:port/api`
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
    cd code/client
    npm install
    ```

## Execução em desenvolvimento

```bash
./scripts/run-client.sh
```

Para acessar a aplicação, abra o navegador e acesse o endereço `http://localhost:8081` ou instale o app Expo no seu celular e escaneie o QR Code.
