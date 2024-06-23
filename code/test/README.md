# Código fonte - Testes

## Instalação

1. Instale os pacotes necessários:

    ```bash
    sudo apt install -y python3 python3-pip python3-venv libpq-dev
    ```

2. Crie um ambiente virtual e instale as dependências do pip:

    ```bash
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    ```

Use `deactivate` para sair do ambiente virtual.

Use `source .venv/bin/activate` antes de executar qualquer dos seguintes comandos.

## Execução

Use `python3 ./<nome do arquivo>.py` sendo `<nome do arquivo>` o nome do arquivo de teste.
