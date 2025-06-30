# Import FastAPI
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import database initialization
from ..database.init_db import init_database

# Import routers
from ..controller.tag_controller import router as tag_router
from ..controller.category_controller import router as category_router
from ..controller.product_controller import router as product_router
from ..controller.customer_controller import router as customer_router
from ..controller.sale_controller import router as sale_router
from ..controller.user_controller import router as user_router
from ..controller.auth_controller import router as auth_router

# Import middleware
from ..middleware.auth_middleware import AuthMiddleware

app = FastAPI()

# Set CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
init_database()

# Add middleware
app.add_middleware(AuthMiddleware)

# Include routers
app.include_router(tag_router)
app.include_router(category_router)
app.include_router(product_router)
app.include_router(customer_router)
app.include_router(sale_router)
app.include_router(user_router)
app.include_router(auth_router)


@app.get("/")
def read_root():
    return {"message": "Bem-vindo à Picolynne Store Backend!"}
