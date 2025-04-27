from rest_framework import serializers

from signs.models import UnitedSign


class UnitedSignSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnitedSign
        fields = '__all__'