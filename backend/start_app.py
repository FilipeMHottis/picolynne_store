from src.config import env
import uvicorn
import socket
import time

def wait_for_db(host: str, port: int, timeout: int = 30):
    """Wait for the database to be available."""
    start_time = time.time()
    while True:
        try:
            with socket.create_connection((host, port), timeout=1):
                print(f"Database at {host}:{port} is available.")
                return
        except (socket.timeout, ConnectionRefusedError):
            if time.time() - start_time > timeout:
                raise TimeoutError(f"Database at {host}:{port} is not available after {timeout} seconds.")
            print(f"Waiting for database at {host}:{port}...")
            time.sleep(1)


if __name__ == "__main__":
    # Wait for the database to be ready before starting the app
    db_host = env.database["DB_HOST"]
    db_port = int(env.database["DB_PORT"])
    
    # Ensure the database is ready
    wait_for_db(db_host, db_port, timeout=30) 
    
    
    # Start the FastAPI application
    print(f"Starting FastAPI app on {env.serve_config['HOST']}:{env.serve_config['PORT']}...")
    uvicorn.run(
        "src.app.main:app",
        port=env.serve_config["PORT"],
        host=env.serve_config["HOST"],
        reload=env.database["START_DEV"],
    )
