# from rest_framework import serializers
# from .models import BotClient

# class BotClientSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = BotClient
#         # This includes all the features we added to your model
#         fields = '__all__'

# from rest_framework import serializers
# from .models import ClientProfile  # BotClient se badal kar ClientProfile karo

# class BotClientSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ClientProfile  # Yahan bhi ClientProfile hona chahiye
#         fields = '__all__'

        

from rest_framework import serializers
from .models import BotClient, Product # Model names match karne chahiye

# Inventory Table ke liye
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

# Main Dashboard aur Payment Center ke liye
class BotClientSerializer(serializers.ModelSerializer):
    # 'products' humne views.py mein use kiya hai table data ke liye
    products = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = BotClient # Models.py wala naya naam
        fields = '__all__'