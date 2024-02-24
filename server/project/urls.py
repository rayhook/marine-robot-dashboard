from django.contrib import admin
from django.urls import path
from ninja import NinjaAPI
from ninja.security import django_auth

api = NinjaAPI()


@api.get("/add")
def add(request, a: int, b: int):
    return {"result": a + b}


@api.get("pets", auth=django_auth)
def pets(request):
    return f"Autherization {request.auth}"


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", api.urls),
]
