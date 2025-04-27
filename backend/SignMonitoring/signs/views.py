from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from signs.models import UnitedSign, GibddSign, CommerceSign
from signs.serializers import UnitedSignSerializer
from rest_framework.generics import ListAPIView

from signs.utils import force_update_signs


class UnitedSignListView(ListAPIView):
    queryset = UnitedSign.objects.all()
    serializer_class = UnitedSignSerializer


class ForceLoadSignsView(APIView):
    def get(self, request):
        created, updated = force_update_signs()  # возвращаем кортеж
        if created:
            return Response({'detail': 'Созданы новые знаки'}, status=status.HTTP_201_CREATED)
        elif updated:
            return Response({'detail': 'Знаки обновлены'}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Новых данных нет'}, status=status.HTTP_200_OK)
