# Import FastAPI
from fastapi import FastAPI

# Import database initialization
from ..database.init_db import init_database

# Import routers
from ..controller.tag_controller import router as tag_router
from ..controller.category_controller import router as category_router
from ..controller.product_controller import router as product_router
from ..controller.customer_controller import router as customer_router

app = FastAPI()

# Initialize database
init_database()

# Include routers
app.include_router(tag_router)
app.include_router(category_router)
app.include_router(product_router)
app.include_router(customer_router)


@app.get("/")
def read_root():
    return {"message": "Bem-vindo à Picolynne Store Backend!"}
