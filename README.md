# 🍦 Picolynne Store

### 📌 Descrição da Aplicação

**Picolynne Store** é um sistema de ponto de venda (PDV) voltado para uso interno por operadores de caixa da picoleteria/gelateria **Picolynne**. O objetivo é registrar vendas de produtos agrupados por **categorias**, facilitando o processo de atendimento e controle. Este aplicativo **não é destinado ao cliente final**.

---

### 🛠️ Principais Tecnologias Usadas

#### Frontend (interface do caixa)

* React 19
* TypeScript
* Tailwind CSS 4
* React Router DOM 7
* Lucide React
* Vite

#### Backend (API)

* FastAPI
* SQLAlchemy
* Pydantic
* PostgreSQL
* Psycopg2
* Passlib (autenticação)
* JWT
* Uvicorn
* Python-dotenv

---

### 🚀 Como Iniciar a Aplicação

#### Pré-requisitos

* Git
* Docker e Docker Compose instalados

#### Passos

1. **Clone o repositório**:

   ```bash
   git clone https://github.com/seu-usuario/picolynne-store.git
   cd picolynne-store
   ```

2. **Execute o script de inicialização**:

   ```bash
   ./start.sh
   ```

   O script irá:

   * Verificar dependências (Docker, Docker Compose)
   * Criar um arquivo `.env` baseado no `.env.example`
   * Solicitar valores personalizados (DB, JWT, portas etc.)
   * Iniciar os containers com Docker Compose

   A aplicação ficará disponível em:

   * Frontend: [http://localhost:3000](http://localhost:3000)
   * Backend: [http://localhost:8000](http://localhost:8000)

---

### 📐 Regras de Negócio

* Cada **produto** pertence a **uma única categoria**.
* O **preço** é definido **pela categoria**, **não pelo produto individual**.
* A **faixa de preço aplicável** é determinada pela **quantidade total de todos os produtos vendidos** (independente da categoria), mas cada categoria mantém seus próprios valores de preço dentro dessa faixa:

#### Exemplo de Escalonamento (categoria "Normal"):

| Quantidade Total | Preço Unitário |
| ---------------- | -------------- |
| Até 19           | R\$ 3,00       |
| 20 a 49          | R\$ 2,70       |
| 50 ou mais       | R\$ 2,50       |

#### Exemplo de Escalonamento (categoria "Gourmet"):

| Quantidade Total | Preço Unitário |
| ---------------- | -------------- |
| Até 19           | R\$ 4,50       |
| 20 a 39          | R\$ 4,20       |
| 40 ou mais       | R\$ 3,90       |

* A contagem de quatidade é feita **com o total de produtos (independente da categoria)**, e não por produto individual.

---

### 🧾 Exemplo de Fluxo de Venda

**Carrinho de Venda:**

* 10x Picolé de Chocolate (categoria: "Normal")
* 15x Picolé de Morango (categoria: "Normal")
* 8x Picolé de Açaí (categoria: "Gourmet")
* 5x Picolé de Pistache (categoria: "Gourmet")

**Cálculo:**

**Quantidade total**
* Normal (25) + Gourmet (13) = 38 Unidades
* Preço aplicável será faixa de 20 a 39 unidades

**Preços aplicados:**
* Normal: 25 x R$ 2,70 = R$ 67,50
* Gourmet: 13 x R$ 4,20 = R$ 54,60

**Total da venda: R$ 67,50 + R$ 54,60 = R$ 122,10**

Esse cálculo é feito automaticamente no sistema com base nas regras definidas por cada categoria.

---

### 📜 Licença

Este projeto está licenciado sob a **Apache 2.0 License**.
