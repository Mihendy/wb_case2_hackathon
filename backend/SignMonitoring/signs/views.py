from rest_framework.views import APIView
from rest_framework.response import Response
from signs.models import Sign


class SignListView(APIView):
    def get(self, request):
        signs = Sign.objects.all()
        sign_data = [{"id": sign.id, "name": sign.name} for sign in signs]
        return Response(sign_data)
