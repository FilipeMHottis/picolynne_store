from fastapi import FastAPI
from ..database.init_db import init_database
from ..controller.tag_controller import router as tag_router
from ..controller.category_controller import router as category_router
from ..controller.product_controller import router as product_router

app = FastAPI()

# Initialize database
init_database()

# Include routers
app.include_router(tag_router)
app.include_router(category_router)
app.include_router(product_router)


@app.get("/")
def read_root():
    return {"message": "Bem-vindo à Picolynne Store Backend!"}
