from django.db import models
from django.conf import settings


class UnitedSign(models.Model):
    STATUS_CHOICES = [
        ('new', 'Новый'),
        ('updated', 'Обновлен'),
        ('removed', 'Удален'),
        (None, 'Нет статуса'),
    ]

    SOURCE_CHOICES = [
        ('gibdd', 'ГИБДД'),
        ('commerce', 'Коммерция'),
        ('both', 'ГИБДД и Коммерция'),
    ]

    gibdd_unical_id = models.BigIntegerField(unique=False, null=True, blank=True)
    commerce_internal_id = models.CharField(unique=False, max_length=255, null=True, blank=True)
    name = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=8, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    gibdd_description = models.TextField(null=True, blank=True)
    commerce_description = models.TextField(null=True, blank=True)
    source = models.CharField(
        max_length=10,
        choices=SOURCE_CHOICES,
        null=True,
        default=None
    )
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        null=True,
        default=None
    )

    def __str__(self):
        return f"{self.name} ({self.gibdd_unical_id}, {self.commerce_internal_id})"

    class Meta:
        indexes = [
            models.Index(fields=['gibdd_unical_id']),
            models.Index(fields=['commerce_internal_id']),
        ]
        unique_together = ['gibdd_unical_id', 'commerce_internal_id']


class GibddSign(models.Model):
    unical_id = models.IntegerField()
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
