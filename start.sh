#!/bin/bash

ENV_FILE=".env"
ENV_EXAMPLE=".env.example"

# Cores ANSI - Paleta mais rica
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
MAGENTA='\033[1;35m'
CYAN='\033[1;36m'
RED='\033[0;31m'
WHITE='\033[1;37m'
GRAY='\033[0;37m'
BOLD='\033[1m'
DIM='\033[2m'
RESET='\033[0m'

# Emojis para melhor visualização
ROCKET="🚀"
CHECK="✅"
CROSS="❌"
WARNING="⚠️"
INFO="ℹ️"
GEAR="⚙️"
STAR="⭐"
FIRE="🔥"
PACKAGE="📦"
LOCK="🔐"
GLOBE="🌐"
FOLDER="📁"

# Função para mostrar um separador bonito
show_separator() {
    echo -e "${CYAN}════════════════════════════════════════════════════════════════${RESET}"
}

# Função para mostrar um cabeçalho bonito
show_header() {
    local title="$1"
    echo -e "\n${BOLD}${WHITE}┌─────────────────────────────────────────────────────────────────┐${RESET}"
    echo -e "${BOLD}${WHITE}│${RESET} ${CYAN}${BOLD}$title${RESET}${BOLD}${WHITE} │${RESET}"
    echo -e "${BOLD}${WHITE}└─────────────────────────────────────────────────────────────────┘${RESET}\n"
}

# Função para pausar com estilo
pause() {
    echo -e "\n${DIM}${GRAY}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
    echo -e "${YELLOW}${BOLD}$1${RESET}"
    echo -e "${DIM}${GRAY}Pressione ${WHITE}Enter${GRAY} para continuar...${RESET}"
    read -r
    echo -e "${DIM}${GRAY}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n"
}

# Animação de loading
show_loading() {
    local message="$1"
    local duration=3
    
    echo -ne "${CYAN}${message}${RESET}"
    
    for ((i=0; i<duration; i++)); do
        for spinner in '⠋' '⠙' '⠹' '⠸' '⠼' '⠴' '⠦' '⠧' '⠇' '⠏'; do
            echo -ne "\r${CYAN}${message} ${spinner}${RESET}"
            sleep 0.1
        done
    done
    echo -ne "\r${GREEN}${message} ${CHECK}${RESET}\n"
}

# Função para verificar comandos com estilo
check_command() {
    local cmd="$1"
    local url="$2"
    
    echo -ne "${BLUE}${GEAR} Verificando ${BOLD}$cmd${RESET}${BLUE}...${RESET}"
    
    if command -v "$cmd" &>/dev/null; then
        echo -e "\r${GREEN}${CHECK} ${BOLD}$cmd${RESET}${GREEN} encontrado!${RESET}                    "
        return 0
    else
        echo -e "\r${RED}${CROSS} ${BOLD}$cmd${RESET}${RED} não está instalado.${RESET}             "
        echo -e "${YELLOW}${WARNING} Por favor, instale ${BOLD}$cmd${RESET}${YELLOW} em: ${BLUE}$url${RESET}"
        exit 1
    fi
}

# Função para explicar e pedir dados com validação melhorada
explain_and_ask() {
    local name="$1"
    local message="$2"
    local default="$3"
    local validate="$4"
    local input=""
    local icon=""

    # Escolher ícone baseado no tipo de dado
    case "$name" in
        *"USER"*|*"ADMIN"*) icon="${LOCK}" ;;
        *"PASSWORD"*) icon="${LOCK}" ;;
        *"HOST"*|*"URL"*) icon="${GLOBE}" ;;
        *"PORT"*) icon="${GEAR}" ;;
        *"DB"*) icon="${FOLDER}" ;;
        *"SECRET"*|*"KEY"*) icon="${LOCK}" ;;
        *) icon="${INFO}" ;;
    esac

    echo -e "\n${BOLD}${WHITE}┌─ ${icon} ${CYAN}$name${RESET}${BOLD}${WHITE} ─┐${RESET}"
    echo -e "${WHITE}│${RESET} ${DIM}$message${RESET}"
    echo -e "${WHITE}│${RESET}"
    echo -ne "${WHITE}│${RESET} ${YELLOW}Digite o valor${RESET} ${DIM}[padrão: ${BOLD}$default${RESET}${DIM}]:${RESET} "
    
    read -r input
    input="${input:-$default}"

    # Validação com feedback visual
    if [ "$validate" == "number" ]; then
        while ! [[ "$input" =~ ^[0-9]+$ ]]; do
            echo -e "${WHITE}│${RESET} ${RED}${WARNING} Por favor, digite um número válido.${RESET}"
            echo -ne "${WHITE}│${RESET} ${YELLOW}Tente novamente:${RESET} "
            read -r input
        done
    fi

    if [ "$validate" == "boolean" ]; then
        while ! [[ "$input" =~ ^(true|false)$ ]]; do
            echo -e "${WHITE}│${RESET} ${RED}${WARNING} Digite 'true' ou 'false'.${RESET}"
            echo -ne "${WHITE}│${RESET} ${YELLOW}Tente novamente:${RESET} "
            read -r input
        done
    fi

    echo -e "${WHITE}│${RESET} ${GREEN}${CHECK} Valor definido: ${BOLD}$input${RESET}"
    echo -e "${WHITE}└────────────────────────────────────────────────────────────────┘${RESET}"
    
    echo "$name=$input" >> "$ENV_FILE"
}

# Banner de boas-vindas mais elaborado
show_welcome_banner() {
    clear
    echo -e "${BOLD}${MAGENTA}"
    echo "╔══════════════════════════════════════════════════════════════════════════════╗"
    echo "║                                                                              ║"
    echo "║                     ${ROCKET} PICOLYNNE STORE CONFIGURATOR ${ROCKET}                       ║"
    echo "║                                                                              ║"
    echo "║                   ${STAR} Bem-vindo ao inicializador automático! ${STAR}               ║"
    echo "║                                                                              ║"
    echo "║     Este script inteligente vai configurar seu ambiente passo a passo        ║"
    echo "║                                                                              ║"
    echo "╚══════════════════════════════════════════════════════════════════════════════╝"
    echo -e "${RESET}"
}

# Início do script principal
show_welcome_banner
pause "${FIRE} Pronto para começar a configuração?"

# Verificação de dependências com estilo
show_header "${PACKAGE} VERIFICAÇÃO DE DEPENDÊNCIAS"
echo -e "${BLUE}Verificando se todas as ferramentas necessárias estão instaladas...${RESET}\n"

check_command docker "https://docs.docker.com/engine/install/"
check_command docker-compose "https://docs.docker.com/compose/install/"

echo -e "\n${GREEN}${FIRE} Todas as dependências foram encontradas com sucesso!${RESET}"
show_loading "Preparando ambiente"

# Verificação de arquivo .env existente
show_header "${GEAR} VERIFICAÇÃO DE CONFIGURAÇÃO"

if [ -f "$ENV_FILE" ]; then
    echo -e "${GREEN}${CHECK} O arquivo ${BOLD}.env${RESET}${GREEN} já existe!${RESET}"
    echo -e "${CYAN}${INFO} Detectamos uma configuração prévia. Vamos usá-la para iniciar a aplicação.${RESET}\n"
    
    show_loading "Carregando configurações existentes"
    
    echo -e "${BOLD}${MAGENTA}${ROCKET} INICIANDO APLICAÇÃO${RESET}"
    echo -e "${CYAN}Executando docker-compose com as configurações existentes...${RESET}\n"
    
    if docker-compose --env-file .env up --build -d; then
        echo -e "\n${GREEN}${FIRE} Aplicação iniciada com sucesso!${RESET}"
        echo -e "${CYAN}${GLOBE} Acesse a aplicação em: ${BOLD}${WHITE}http://localhost:3000${RESET}"
        echo -e "${YELLOW}${INFO} Para parar: ${BOLD}docker-compose down -v${RESET}"
        echo -e "${WHITE}│${RESET} ${YELLOW}Para logs:  ${BOLD}docker-compose logs -f${RESET}"
    else
        echo -e "\n${RED}${CROSS} Erro ao iniciar a aplicação. Verifique os logs acima.${RESET}"
        exit 1
    fi
    
    pause "${STAR} Configuração concluída! Pressione Enter para sair"
    exit 0
fi

# Verificação do arquivo .env.example
if [ ! -f "$ENV_EXAMPLE" ]; then
    echo -e "${RED}${CROSS} Arquivo ${BOLD}$ENV_EXAMPLE${RESET}${RED} não encontrado!${RESET}"
    echo -e "${YELLOW}${WARNING} Este arquivo é necessário como modelo para a configuração.${RESET}"
    exit 1
fi

show_header "${GEAR} CRIAÇÃO DE CONFIGURAÇÃO PERSONALIZADA"
echo -e "${CYAN}${INFO} Vamos criar um arquivo ${BOLD}.env${RESET}${CYAN} personalizado baseado no modelo.${RESET}"
pause "${STAR} Pronto para configurar suas variáveis de ambiente?"

# Inicializa o arquivo .env
echo "# Arquivo de configuração gerado automaticamente pelo Picolynne Store Configurator" > "$ENV_FILE"
echo "# Gerado em: $(date)" >> "$ENV_FILE"
echo "" >> "$ENV_FILE"

# Configuração das variáveis organizadas por categoria
show_header "${FOLDER} CONFIGURAÇÃO DO BANCO DE DADOS"
echo "# === CONFIGURAÇÕES DO BANCO DE DADOS ===" >> "$ENV_FILE"
explain_and_ask "DB_USER" "Nome do usuário que será usado para conectar ao banco de dados" "picolynne_user"
explain_and_ask "DB_PASSWORD" "Senha do usuário do banco de dados (escolha uma senha segura)" "picolynne_password"
explain_and_ask "DB_HOST" "Endereço onde o banco de dados estará rodando" "localhost"
explain_and_ask "DB_PORT" "Porta de conexão do banco de dados PostgreSQL" "5432" "number"
explain_and_ask "DB_NAME" "Nome da base de dados que será criada" "picolynne_store"
explain_and_ask "START_DEV" "Iniciar em modo de desenvolvimento? (true para debug)" "false" "boolean"
echo "" >> "$ENV_FILE"

show_header "${LOCK} CONFIGURAÇÃO DE SEGURANÇA"
echo "# === CONFIGURAÇÕES DE SEGURANÇA JWT ===" >> "$ENV_FILE"
explain_and_ask "SECRET_KEY" "Chave secreta para assinatura dos tokens JWT (mantenha segura!)" "your_secret_key_here"
explain_and_ask "ALGORITHM" "Algoritmo de criptografia para os tokens JWT" "HS256"
explain_and_ask "ACCESS_TOKEN_EXPIRE_MINUTES" "Tempo de expiração dos tokens em minutos" "1440" "number"
explain_and_ask "ADMIN_USER" "Nome do usuário administrador do sistema" "admin"
explain_and_ask "ADMIN_PASSWORD" "Senha do administrador (use uma senha forte!)" "admin123"
echo "" >> "$ENV_FILE"

show_header "${GEAR} CONFIGURAÇÃO DO SERVIDOR BACKEND"
echo "# === CONFIGURAÇÕES DO BACKEND ===" >> "$ENV_FILE"
explain_and_ask "BACKEND_HOST" "Endereço IP onde o backend ficará disponível" "0.0.0.0"
explain_and_ask "BACKEND_PORT" "Porta onde o servidor backend irá escutar" "8000" "number"
echo "" >> "$ENV_FILE"

show_header "${GLOBE} CONFIGURAÇÃO DO FRONTEND"
echo "# === CONFIGURAÇÕES DO FRONTEND ===" >> "$ENV_FILE"
explain_and_ask "FRONTEND_BACKEND_URL" "URL completa para o frontend acessar o backend" "http://localhost:8000"
explain_and_ask "VITE_HOST" "Endereço IP onde o Vite (frontend) ficará disponível" "0.0.0.0"
explain_and_ask "VITE_PORT" "Porta onde o servidor Vite irá escutar" "3000" "number"

# Exibição do resumo final com estilo
show_header "${STAR} RESUMO DA CONFIGURAÇÃO"
echo -e "${CYAN}${INFO} Configuração finalizada! Vamos exibir o arquivo gerado:${RESET}\n"

echo -e "${BOLD}${WHITE}┌─ ${FOLDER} CONTEÚDO DO SEU ARQUIVO .env ─┐${RESET}"
echo -e "${BLUE}"
sed 's/^/│ /' "$ENV_FILE"
echo -e "${RESET}${BOLD}${WHITE}└────────────────────────────────────────────────────────────────┘${RESET}\n"

pause "${CHECK} Configuração salva! Vamos iniciar a aplicação?"

# Finalização com inicialização do docker-compose
show_header "${ROCKET} INICIALIZANDO APLICAÇÃO"
echo -e "${GREEN}${CHECK} Arquivo ${BOLD}.env${RESET}${GREEN} criado com sucesso!${RESET}"
echo -e "${MAGENTA}${FIRE} Iniciando a aplicação com Docker Compose...${RESET}\n"

show_loading "Construindo e iniciando containers"

if docker-compose --env-file .env up --build -d; then
    echo -e "\n${GREEN}${FIRE} Aplicação iniciada com sucesso!${RESET}"
    echo -e "${BOLD}${WHITE}┌─ ${STAR} INFORMAÇÕES DE ACESSO ─┐${RESET}"
    echo -e "${WHITE}│${RESET}"
    echo -e "${WHITE}│${RESET} ${CYAN}${GLOBE} Frontend: ${BOLD}${WHITE}http://localhost:3000${RESET}"
    echo -e "${WHITE}│${RESET} ${BLUE}${GEAR} Backend:  ${BOLD}${WHITE}http://localhost:8000${RESET}"
    echo -e "${WHITE}│${RESET}"
    echo -e "${WHITE}│${RESET} ${YELLOW}${INFO} Para parar: ${BOLD}docker-compose down -v${RESET}"
    echo -e "${WHITE}│${RESET} ${YELLOW}${INFO} Para logs:  ${BOLD}docker-compose logs -f${RESET}"
    echo -e "${WHITE}│${RESET}"
    echo -e "${BOLD}${WHITE}└────────────────────────────────────────────────────────────────┘${RESET}"
else
    echo -e "\n${RED}${CROSS} Erro ao iniciar a aplicação!${RESET}"
    echo -e "${YELLOW}${WARNING} Verifique as mensagens de erro acima e tente novamente.${RESET}"
    exit 1
fi

pause "${STAR} Configuração concluída com sucesso! Pressione Enter para sair"
  