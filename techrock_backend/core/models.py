# from django.db import models

# class BotClient(models.Model):
#     # --- Basic Info ---
#     name = models.CharField(max_length=255)
#     # The unique ID for your CRM/Sheet data (e.g., SM-001)
#     crm_id = models.CharField(max_length=100, unique=True)
#     whatsapp_number = models.CharField(max_length=20, unique=True)
    
#     # --- Status & Tracking ---
#     # Your Kill Switch
#     is_active = models.BooleanField(default=True)
#     created_at = models.DateTimeField(auto_now_add=True)
    
#     # --- Inventory Features ---
#     # Defaulting to 0 for new signups
#     stock_remaining = models.IntegerField(default=0)
#     stock_sold = models.IntegerField(default=0)
    
#     # --- Financial Features ---
#     # To track payments and balances
#     wallet_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
#     payment_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
#     advanced_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

#     def __str__(self):
#         status = 'ACTIVE' if self.is_active else 'KILLED'
#         return f"{self.name} ({self.crm_id}) - {status}"


# from django.db import models

# class ClientProfile(models.Model):
#     # --- Purani fields (Inhe rehne dena) ---
#     crm_id = models.CharField(max_length=100, unique=True)
#     name = models.CharField(max_length=255)
#     business_name = models.CharField(max_length=255, blank=True, null=True)
#     is_active = models.BooleanField(default=True)
#     subscription_fee = models.FloatField(default=0.0)

#     # --- Nayi fields (Jo aapke Dashboard ko bharengi) ---
#     stock_remaining = models.IntegerField(default=0) #
#     total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0.00) #
#     wallet_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00) #
#     payment_pending = models.DecimalField(max_digits=10, decimal_places=2, default=0.00) #
    
#     def __str__(self):
#         return f"{self.business_name} ({self.crm_id})"


# from django.db import models

# class ClientProfile(models.Model):
#     # Basic Info
#     crm_id = models.CharField(max_length=50, unique=True)
#     name = models.CharField(max_length=255)
#     business_name = models.CharField(max_length=255)
#     is_active = models.BooleanField(default=True)
#     subscription_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    
#     # Dashboard Features (Jo aapko chahiye)
#     total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
#     stock_remaining = models.IntegerField(default=0)
#     wallet_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
#     payment_pending = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)

#     def __str__(self):
#         return f"{self.business_name} ({self.crm_id})"

# class Lead(models.Model):
#     client = models.ForeignKey(ClientProfile, on_delete=models.CASCADE, related_name='leads')
#     phone_number = models.CharField(max_length=15)
#     full_name = models.CharField(max_length=255)
#     status = models.CharField(max_length=50, default='New')
#     last_message = models.TextField(blank=True, null=True)

#     def __str__(self):
#         return f"{self.full_name} - {self.client.business_name}"

# class SaleRecord(models.Model):
#     client = models.ForeignKey(ClientProfile, on_delete=models.CASCADE, related_name='sales')
#     product_name = models.CharField(max_length=255)
#     price = models.DecimalField(max_digits=10, decimal_places=2)
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.product_name} - {self.price}"



from django.db import models

class ClientProfile(models.Model):
    # Basic Information
    crm_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=255)
    business_name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    subscription_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    
    # Dashboard Fields (Inhe Dynamic banane ke liye)
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    stock_remaining = models.IntegerField(default=0)
    wallet_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    payment_pending = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)

    def __str__(self):
        return f"{self.business_name} ({self.crm_id})"

class Lead(models.Model):
    client = models.ForeignKey(ClientProfile, on_delete=models.CASCADE, related_name='leads')
    phone_number = models.CharField(max_length=15)
    full_name = models.CharField(max_length=255)
    status = models.CharField(max_length=50, default='New')
    last_message = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.full_name} - {self.client.business_name}"

class SaleRecord(models.Model):
    client = models.ForeignKey(ClientProfile, on_delete=models.CASCADE, related_name='sales')
    product_name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product_name} - {self.price}"