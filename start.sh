#!/bin/bash

ENV_FILE=".env"
ENV_EXAMPLE=".env.example"

# Cores ANSI
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
MAGENTA='\033[1;35m'
CYAN='\033[1;36m'
RED='\033[0;31m'
RESET='\033[0m'

pause() {
  echo -e "${YELLOW}"
  read -p "$1 (pressione Enter para continuar)"
  echo -e "${RESET}"
}

check_command() {
  if ! command -v "$1" &>/dev/null; then
    echo -e "${RED}❌ O comando '$1' não está instalado.${RESET}"
    echo -e "${YELLOW}👉 Acesse ${BLUE}$2${YELLOW} para instalar.${RESET}"
    exit 1
  fi
}

explain_and_ask() {
  local name="$1"
  local message="$2"
  local default="$3"
  local validate="$4"
  local input=""

  echo -e "${CYAN}$name${RESET} - $message"
  read -p "Valor [${default}]: " input
  input="${input:-$default}"

  if [ "$validate" == "number" ]; then
    while ! [[ "$input" =~ ^[0-9]+$ ]]; do
      echo -e "${RED}⚠ Por favor, digite um número válido.${RESET}"
      read -p "$name: " input
    done
  fi

  if [ "$validate" == "boolean" ]; then
    while ! [[ "$input" =~ ^(true|false)$ ]]; do
      echo -e "${RED}⚠ Digite 'true' ou 'false'.${RESET}"
      read -p "$name: " input
    done
  fi

  echo "$name=$input" >> "$ENV_FILE"
}

echo -e "${MAGENTA}"
echo "🚀 Bem-vindo ao inicializador do Picolynne Store!"
echo -e "${RESET}"
pause "Este script vai configurar seu ambiente passo a passo"

# Verificando dependências
echo -e "${YELLOW}🔍 Verificando dependências...${RESET}"
check_command docker "https://docs.docker.com/engine/install/"
check_command docker-compose "https://docs.docker.com/compose/install/"
echo -e "${GREEN}✅ Docker e Docker Compose encontrados.${RESET}"

# Verificando se .env já existe
if [ -f "$ENV_FILE" ]; then
    echo -e "${GREEN}✅ O arquivo .env já existe. Nenhuma ação necessária.${RESET}"

    # Criar o Docker Compose com o arquivo .env existente
    echo -e "${MAGENTA}🎉 Iniciando a aplicação com o docker-compose${RESET}"
    docker-compose --env-file .env up --build -d
    echo -e "${GREEN}✅ Aplicação iniciada com sucesso!${RESET}"
    echo -e "${CYAN}Você pode acessar a aplicação em http://localhost:3000${RESET}"
    echo -e "${YELLOW}Para parar a aplicação, use: docker-compose down${RESET}"
    pause "Pressione Enter para sair"   
    exit 0
fi

# Checando se .env.example existe
if [ ! -f "$ENV_EXAMPLE" ]; then
  echo -e "${RED}❌ Arquivo $ENV_EXAMPLE não encontrado. Abortando.${RESET}"
  exit 1
fi

pause "Vamos agora criar um .env personalizado com base no $ENV_EXAMPLE"

# Começa a escrever o novo .env
echo "" > "$ENV_FILE"

# Variáveis com explicações
explain_and_ask "DB_USER" "Usuário do banco de dados." "picolynne_user"
explain_and_ask "DB_PASSWORD" "Senha do banco de dados." "picolynne_password"
explain_and_ask "DB_HOST" "Host onde o banco de dados está rodando." "localhost"
explain_and_ask "DB_PORT" "Porta usada pelo banco de dados." "5432" "number"
explain_and_ask "DB_NAME" "Nome do banco de dados." "picolynne_store"
explain_and_ask "START_DEV" "Iniciar em modo desenvolvimento?" "false" "boolean"

explain_and_ask "SECRET_KEY" "Chave secreta usada na geração dos tokens JWT." "your_secret_key_here"
explain_and_ask "ALGORITHM" "Algoritmo de criptografia dos tokens." "HS256"
explain_and_ask "ACCESS_TOKEN_EXPIRE_MINUTES" "Tempo de expiração do token em minutos." "1440" "number"
explain_and_ask "ADMIN_USER" "Usuário administrador do sistema." "admin"
explain_and_ask "ADMIN_PASSWORD" "Senha do administrador." "admin123"

explain_and_ask "BACKEND_HOST" "Host em que o backend vai rodar." "0.0.0.0"
explain_and_ask "BACKEND_PORT" "Porta em que o backend vai rodar." "8000" "number"

explain_and_ask "FRONTEND_BACKEND_URL" "URL onde o frontend acessa o backend." "http://localhost:8000"
explain_and_ask "VITE_HOST" "Host em que o frontend (Vite) vai rodar." "0.0.0.0"
explain_and_ask "VITE_PORT" "Porta do frontend (Vite)." "3000" "number"

# Mostra o resumo final
pause "Tudo certo! Vamos exibir o conteúdo gerado"

echo -e "${CYAN}📄 Conteúdo do seu .env:${RESET}"
echo -e "${BLUE}"
cat "$ENV_FILE"
echo -e "${RESET}"

# Finnalizar iniciando o docker-compose
echo -e "${GREEN}\n✅ O arquivo .env foi criado com sucesso.${RESET}"
echo -e "${MAGENTA}🎉 Agora vamos iniciar a aplicação com o docker-compose${RESET}"
pause "Pressione Enter para sair"  
docker-compose --env-file .env up --build -d

# Verifica se o docker-compose foi iniciado corretamente
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ocorreu um erro ao iniciar o docker-compose. Verifique as mensagens acima.${RESET}"
    exit 1
fi

echo -e "${GREEN}✅ Aplicação iniciada com sucesso!${RESET}"
echo -e "${CYAN}Você pode acessar a aplicação em http://localhost:3000${RESET}"
echo -e "${YELLOW}Para parar a aplicação, use: docker-compose down${RESET}"

pause "Pressione Enter para sair"
  