from django.db import models


class BaseModel(models.Model):
    created_at = models.TimeField(auto_now_add=True)

    class Meta:
        abstract = True


class Device(BaseModel):
    user = models.ForeignKey(
        "auth.User", related_name="device", on_delete=models.CASCADE
    )
    total_distance = models.IntegerField()
    serial_number = models.CharField(max_length=50)
    time_since_last_grease = models.IntegerField()


class Trip(BaseModel):
    device = models.ForeignKey(
        "marine_robot.Device", related_name="trip", on_delete=models.CASCADE
    )
    distance = models.IntegerField()
    duration = models.IntegerField()


class Datapoint(BaseModel):
    trip = models.ForeignKey(
        "marine_robot.Trip", related_name="data_point", on_delete=models.CASCADE
    )
    lat = models.DecimalField(decimal_places=6, max_digits=10)
    long = models.DecimalField(decimal_places=6, max_digits=10)
    depth = models.DecimalField(decimal_places=2, max_digits=6)
    temp = models.DecimalField(decimal_places=2, max_digits=6)
