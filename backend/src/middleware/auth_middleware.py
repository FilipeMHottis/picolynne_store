from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from src.service.user_service import UserService
from ..database.database import SessionLocal


pages_not_requiring_auth = [
    "/login",
    "/docs",
    "/",
    "/openapi.json",
]


class AuthMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next):
        if request.url.path in pages_not_requiring_auth:
            return await call_next(request)

        if "Authorization" not in request.headers:
            return Response(
                status_code=401,
                content="Authorization header not found.",
            )

        token = request.headers["Authorization"].split(" ")[1]

        try:
            db = SessionLocal()
            user_service = UserService(db)
            user = user_service.decode_token(token)

            if user.code != 200:
                return Response(
                    status_code=user.code,
                    content=user.message,
                )

            request.state.user = user.data
        except Exception as e:
            return Response(
                status_code=401,
                content=f"Invalid token: {str(e)}",
            )

        return await call_next(request)
