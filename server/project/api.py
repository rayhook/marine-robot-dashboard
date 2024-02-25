from ninja import NinjaAPI, Schema
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model

from ninja_jwt.controller import NinjaJWTDefaultController


api = NinjaAPI()


class UserCreateSchema(Schema):
    username: str
    email: str
    password: str


@api.post("/user/")
def create_user(request, payload: UserCreateSchema):
    User = get_user_model()
    user = User.objects.create(
        username=payload.username,
        email=payload.email,
        password=make_password(payload.password),
    )
    return {"id": user.id, "username": user.username, "email": user.email}

@api.login