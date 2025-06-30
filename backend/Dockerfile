# Imagem base oficial do Python
FROM python:3.12.9-slim

# Define o diretório de trabalho
WORKDIR /app

# Copia e instala dependências
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copia o restante do código
COPY . .

# Expondo a porta do backend
EXPOSE 8000

# Inicia o servidor FastAPI com seu script
CMD ["python3", "-u", "start_app.py"]
