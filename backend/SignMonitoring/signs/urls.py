from django.urls import path
from signs.views import ForceLoadSignsView, UnitedSignListView

urlpatterns = [
    path('signs/', UnitedSignListView.as_view(), name='signs_list'),
    path('signs/force_load/', ForceLoadSignsView.as_view(), name='signs_force_load'),
]
