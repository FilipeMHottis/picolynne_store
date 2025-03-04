import jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from typing import Optional
from ..config.env import security
from ..typings.user_typing import TokenData


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Gera um hash seguro para a senha."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se a senha é válida."""
    return pwd_context.verify(plain_password, hashed_password)


def decode_token(token: str) -> TokenData:
    """Decodifica um token JWT."""
    try:
        payload = jwt.decode(
            token,
            security["SECRET_KEY"],
            algorithms=[security["ALGORITHM"]],
        )
    except jwt.PyJWTError as e:
        raise Exception(f"Error decoding JWT: {str(e)}")

    return TokenData(**payload)


def create_access_token(
    data: TokenData,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """Cria um token de acesso JWT com tempo de expiração.

    Args:
        data: Dados a serem codificados no token.
        expires_delta: Tempo de expiração do token.
            Se não for fornecido, usa o valor padrão.

    Returns:
        str: Token JWT codificado.
    """

    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta
        or timedelta(
            minutes=security["ACCESS_TOKEN_EXPIRE_MINUTES"],
        )
    )
    to_encode.update({"exp": expire})

    try:
        encoded_jwt = jwt.encode(
            to_encode,
            security["SECRET_KEY"],
            algorithm=security["ALGORITHM"],
        )
    except jwt.PyJWTError as e:
        raise Exception(f"Error encoding JWT: {str(e)}")

    return encoded_jwt
