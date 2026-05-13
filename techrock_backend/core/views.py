#from django.shortcuts import render#
# import csv
# import io
# from rest_framework import viewsets
# from rest_framework.response import Response
# from rest_framework.decorators import action
# from .models import BotClient
# from .serializers import BotClientSerializer

# class BotClientViewSet(viewsets.ModelViewSet):
#     queryset = BotClient.objects.all()
#     serializer_class = BotClientSerializer

#     # This creates the "Kill Switch" check link
#     @action(detail=False, methods=['get'], url_path='check-status/(?P<phone>[^/.]+)')
#     def check_status(self, request, phone=None):
#         try:
#             client = BotClient.objects.get(whatsapp_number=phone)
#             return Response({"is_active": client.is_active, "name": client.name})
#         except BotClient.DoesNotExist:
#             return Response({"is_active": False, "error": "Client not found"}, status=404)
#     @action(detail=False, methods=['post'], url_path='import-data')
#     def import_data(self, request):
#         if 'file' not in request.FILES:
#             return Response({"error": "Please upload a CSV file"}, status=400)
        
#         file = request.FILES['file']
#         decoded_file = file.read().decode('utf-8')
#         io_string = io.StringIO(decoded_file)
#         reader = csv.DictReader(io_string)
        
#         for row in reader:
#             # This looks for the client in your DB and updates their stock on the spot!
#             BotClient.objects.filter(name=row.get('name')).update(
#                 stock_remaining=row.get('stock_remaining', 0),
#                 stock_sold=row.get('stock_sold', 0)
#             )
            
#         return Response({"status": "Data synced successfully from Sheet!"})
    
# from rest_framework import viewsets, status
# from rest_framework.decorators import action
# from rest_framework.response import Response
# from .models import ClientProfile  # BotClient se change kiya
# from .serializers import BotClientSerializer # Ise check kar lena agar iska naam bhi ClientProfileSerializer hai

# class BotClientViewSet(viewsets.ModelViewSet):
#     # Aapke Admin ke mutabik ClientProfile hi model hai
#     queryset = ClientProfile.objects.all() 
#     serializer_class = BotClientSerializer


#     # URL: /api/clients/get-by-crm/?crm_id=SM-001
#     @action(detail=False, methods=['get'], url_path='get-by-crm')
#     def get_by_crm(self, request):
#         crm_id = request.query_params.get('crm_id')
#         if not crm_id:
#             return Response({"error": "crm_id is required"}, status=400)
            
#         # CRM ID 'SM-001' ko ClientProfile table mein dhoond raha hai
#         client = ClientProfile.objects.filter(crm_id=crm_id).first()
        
#         if client:
#             return Response(BotClientSerializer(client).data)
#         return Response({"error": "Client not found in Django"}, status=404)

#     # Login check logic
#     @action(detail=False, methods=['get'], url_path='check-status')
#     def check_status(self, request):
#         crm_id = request.query_params.get('crm_id')
#         client = ClientProfile.objects.filter(crm_id=crm_id).first()
        
#         if client:
#             return Response(BotClientSerializer(client).data)
#         return Response({"error": "Shop not found"}, status=404)

#     # New Signup logic
#     @action(detail=False, methods=['post'], url_path='signup')
#     def signup(self, request):
#         serializer = self.get_serializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# from rest_framework import viewsets
# from rest_framework.decorators import action
# from rest_framework.response import Response
# from .models import ClientProfile 
# from .serializers import BotClientSerializer

# class BotClientViewSet(viewsets.ModelViewSet):
#     queryset = ClientProfile.objects.all()
#     serializer_class = BotClientSerializer

#     # Ise dhyan se dekho, ye wahi URL banayega jo 404 de raha hai
#     @action(detail=False, methods=['get'], url_path='get-by-crm')
#     def get_by_crm(self, request):
#         crm_id = request.query_params.get('crm_id')
#         client = ClientProfile.objects.filter(crm_id=crm_id).first()
#         if client:
#             return Response(BotClientSerializer(client).data)
#         return Response({"error": "Not found"}, status=404)

#     @action(detail=False, methods=['get'], url_path='check-status')
#     def check_status(self, request):
#         crm_id = request.query_params.get('crm_id')
#         client = ClientProfile.objects.filter(crm_id=crm_id).first()
#         if client:
#             return Response(BotClientSerializer(client).data)
#         return Response({"error": "Shop not found"}, status=404)


from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import BotClient, Product  # Naye model names
from .serializers import BotClientSerializer, ProductSerializer # Product serializer bhi chahiye hoga

class BotClientViewSet(viewsets.ModelViewSet):
    queryset = BotClient.objects.all()
    serializer_class = BotClientSerializer

    # Ye URL: http://127.0.0.1:8000/api/clients/get-by-crm/?crm_id=ramesh4738
    @action(detail=False, methods=['get'], url_path='get-by-crm')
    def get_by_crm(self, request):
        crm_id = request.query_params.get('crm_id')
        if not crm_id:
            return Response({"error": "crm_id is required"}, status=400)
            
        client = BotClient.objects.filter(crm_id=crm_id).first()
        
        if client:
            # Hum extra data bhi bhej rahe hain taaki Dashboard aur Payment cards live ho jayein
            data = BotClientSerializer(client).data
            
            # Inventory products bhi fetch kar lete hain table ke liye
            products = Product.objects.filter(client=client)
            data['products'] = ProductSerializer(products, many=True).data
            
            # Response success ke saath
            data['status'] = 'success'
            return Response(data)
            
        # Agar ramesh4738 admin mein nahi mila toh ye error aayega
        return Response({
            "status": "error", 
            "error": "Client not found in database. Please add it in Django Admin."
        }, status=404)

    # Kill Switch check karne ke liye
    @action(detail=False, methods=['get'], url_path='check-status')
    def check_status(self, request):
        crm_id = request.query_params.get('crm_id')
        client = BotClient.objects.filter(crm_id=crm_id).first()
        
        if client:
            return Response({
                "is_active": client.is_active,
                "business_name": client.business_name
            })
        return Response({"error": "Shop not found"}, status=404)
    
    
    
    
    