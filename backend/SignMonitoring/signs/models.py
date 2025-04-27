from django.db import models
from django.conf import settings


class Sign(models.Model):
    unical_id = models.BigIntegerField(unique=True)
    name = models.CharField(max_length=255)
    latitude = models.BigIntegerField()
    longitude = models.BigIntegerField()
    description = models.TextField(null=True, blank=True)
    source = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.name} ({self.unical_id})"

    class Meta:
        indexes = [
            models.Index(fields=['unical_id']),
        ]


class GibddSign(models.Model):
    unical_id = models.IntegerField(unique=True)
    name = models.CharField(max_length=255)
    latitude = models.BigIntegerField()
    longitude = models.BigIntegerField()
    description = models.TextField(null=True, blank=True)

    class Meta:
        managed = False
        db_table = settings.GIBDD_SIGN_TABLE
        app_label = 'signs'


class CommerceSign(models.Model):
    name = models.CharField(max_length=255)
    geo = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    internal_id = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = settings.COMMERCE_SIGN_TABLE
        app_label = 'signs'
