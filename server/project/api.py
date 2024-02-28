from ninja import NinjaAPI, Schema
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model
from marine_robot.models import Device, Trip, Datapoint
from decimal import Decimal
from typing_extensions import Annotated
from pydantic import Field
from django.shortcuts import get_object_or_404
from typing import List

api = NinjaAPI()


class UserCreateSchema(Schema):
    username: str
    email: str
    password: str


class DeviceCreateSchema(Schema):
    total_distance: int
    serial_number: str
    time_since_last_grease: int
    user_id: int


class DeviceOutSchema(Schema):
    id: int
    total_distance: int
    serial_number: str
    time_since_last_grease: int
    user_id: int


class TripCreateSchema(Schema):
    device_id: int
    distance: int
    duration: int


class TripOutSchema(Schema):
    id: int
    device_id: int
    distance: int
    duration: int


class DatapointCreateSchema(Schema):
    trip_id: int
    lat: Annotated[
        Decimal,
        Field(strict=False, allow_inf_nan=False, decimal_places=6, max_digits=9),
    ]
    long: Annotated[
        Decimal,
        Field(strict=False, allow_inf_nan=False, decimal_places=6, max_digits=9),
    ]
    depth: Annotated[
        Decimal,
        Field(strict=False, allow_inf_nan=False, decimal_places=2, max_digits=6),
    ]
    temp: Annotated[
        Decimal,
        Field(strict=False, allow_inf_nan=False, decimal_places=2, max_digits=5),
    ]


class DatapointOutchema(Schema):
    id: int
    trip_id: int
    lat: Annotated[
        Decimal,
        Field(strict=False, allow_inf_nan=False, decimal_places=6, max_digits=9),
    ]
    long: Annotated[
        Decimal,
        Field(strict=False, allow_inf_nan=False, decimal_places=6, max_digits=9),
    ]
    depth: Annotated[
        Decimal,
        Field(strict=False, allow_inf_nan=False, decimal_places=2, max_digits=6),
    ]
    temp: Annotated[
        Decimal,
        Field(strict=False, allow_inf_nan=False, decimal_places=2, max_digits=5),
    ]


class CombinedSchema(DeviceOutSchema):
    trips: List[TripOutSchema]


@api.post("/user/")
def create_user(request, payload: UserCreateSchema):
    User = get_user_model()
    user = User.objects.create(
        username=payload.username,
        email=payload.email,
        password=make_password(payload.password),
    )
    return {"id": user.id, "username": user.username, "email": user.email}


@api.post("/device/")
def create_device(request, payload: DeviceCreateSchema):
    device = Device.objects.create(
        total_distance=payload.total_distance,
        serial_number=payload.serial_number,
        time_since_last_grease=payload.time_since_last_grease,
        user_id=1,
    )
    return {"id": device.id, "total_distance": device.total_distance}


@api.post("/trip/")
def create_trip(request, payload: TripCreateSchema):
    trip = Trip.objects.create(
        device_id=payload.device_id,
        distance=payload.distance,
        duration=payload.duration,
    )

    return {"id": trip.id, "device_id": trip.device_id}


@api.post("/datapoint/")
def create_trip(request, payload: DatapointCreateSchema):
    datapoint = Datapoint.objects.create(
        trip_id=payload.trip_id,
        lat=payload.lat,
        long=payload.long,
        depth=payload.depth,
        temp=payload.temp,
    )

    return {"id": datapoint.id, "device_id": datapoint.trip_id}


@api.get("/comdata/{device_id}", response=CombinedSchema)
def aggData(request, device_id: int):
    device = get_object_or_404(Device, id=device_id)
    trips_queryset = Trip.objects.filter(device_id=device.id)

    device_data = DeviceOutSchema(
        id=device.id,
        total_distance=device.total_distance,
        serial_number=device.serial_number,
        time_since_last_grease=device.time_since_last_grease,
        user_id=device.user_id,
    )

    trips_data = [
        TripOutSchema(
            id=trip.id,
            device_id=trip.device_id,
            distance=trip.distance,
            duration=trip.duration,
        )
        for trip in trips_queryset
    ]
    response_data = CombinedSchema(**device_data.dict(), trips=trips_data)

    return response_data


@api.get("/trips/{trip_id}", response=List[DatapointOutchema])
def data_points(request, trip_id: int):
    data_points_queryset = Datapoint.objects.filter(trip_id=2)

    return data_points_queryset
