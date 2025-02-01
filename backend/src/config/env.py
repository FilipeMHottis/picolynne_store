import os
from dotenv import load_dotenv

load_dotenv()

database = {
    "DB_USER": os.getenv("DB_USER"),
    "DB_PASSWORD": os.getenv("DB_PASSWORD"),
    "DB_HOST": os.getenv("DB_HOST"),
    "DB_PORT": os.getenv("DB_PORT"),
    "DB_NAME": os.getenv("DB_NAME"),
    "START_DEV": os.getenv("START_DEV", "true").lower() == "true"
}
