from src.config import env
import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "src.app.main:app",
        port=env.serve_config["PORT"],
        host=env.serve_config["HOST"],
        reload=env.database["START_DEV"],
    )
