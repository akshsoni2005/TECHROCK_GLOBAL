#from django.urls import path, include
##from .views import BotClientViewSet

#outer = DefaultRouter()
# We use 'bot-clients' here so it matches your React code exactly
#router.register(r'clients', BotClientViewSet) # This must be 'clients'
#urlpatterns = [
#    path('', include(router.urls)),
#]

# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from .views import BotClientViewSet

# router = DefaultRouter()
# router.register(r'clients', BotClientViewSet, basename='botclient') # Space bilkul nahi hona chahiye

# urlpatterns = [
#     path('', include(router.urls)),
# ]

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BotClientViewSet

router = DefaultRouter()
# Yahan 'clients' ke aage ya piche koi space nahi hona chahiye
router.register(r'clients', BotClientViewSet, basename='botclient')

urlpatterns = [
    path('', include(router.urls)),
]