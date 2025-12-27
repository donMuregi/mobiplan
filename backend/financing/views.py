from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.conf import settings
from .models import Sacco, PaymentTimeline, FinancingRequest
from .serializers import (
    SaccoSerializer, PaymentTimelineSerializer,
    FinancingRequestSerializer, CreateFinancingRequestSerializer
)
from .google_sheets import sync_financing_request_to_sheets
from store.models import Product, ProductVariation


class SaccoViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for Saccos"""
    queryset = Sacco.objects.filter(is_active=True)
    serializer_class = SaccoSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


class PaymentTimelineListView(ListAPIView):
    """API endpoint for payment timelines"""
    queryset = PaymentTimeline.objects.filter(is_active=True)
    serializer_class = PaymentTimelineSerializer
    permission_classes = [AllowAny]


class FinancingRequestViewSet(viewsets.ModelViewSet):
    """API endpoint for financing requests"""
    serializer_class = FinancingRequestSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return FinancingRequest.objects.filter(
                user=self.request.user
            ).select_related('product', 'sacco', 'payment_timeline')
        return FinancingRequest.objects.none()

    def create(self, request, *args, **kwargs):
        serializer = CreateFinancingRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        # Get related objects from validated_data (they're already model instances from FK fields)
        product = data['product']
        sacco = data['sacco']
        timeline = data['payment_timeline']
        
        # Verify they are active
        if not product.is_active:
            return Response({'error': 'Product is not available'}, status=status.HTTP_400_BAD_REQUEST)
        if not sacco.is_active:
            return Response({'error': 'Sacco is not available'}, status=status.HTTP_400_BAD_REQUEST)
        if not timeline.is_active:
            return Response({'error': 'Payment timeline is not available'}, status=status.HTTP_400_BAD_REQUEST)
        
        variation = data.get('variation')
        variation_details = ''
        if variation:
            variation_details = variation.variation_name

        # Determine price
        price = variation.price if variation else product.current_price

        # Create financing request
        financing_request = FinancingRequest.objects.create(
            user=request.user if request.user.is_authenticated else None,
            first_name=data['first_name'],
            last_name=data['last_name'],
            phone_number=data['phone_number'],
            email=data['email'],
            national_id=data['national_id'],
            town_of_residence=data['town_of_residence'],
            product=product,
            variation=variation,
            product_name=product.name,
            product_price=price,
            variation_details=variation_details,
            sacco=sacco,
            sacco_name=sacco.name,
            payment_timeline=timeline,
            payment_months=timeline.months,
            customer_notes=data.get('customer_notes', ''),
        )

        # Send email notifications
        self._send_customer_email(financing_request)
        self._send_admin_email(financing_request)
        
        # Sync to Google Sheets (based on selected Sacco)
        try:
            sync_financing_request_to_sheets(financing_request)
        except Exception as e:
            # Log error but don't fail the request
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Failed to sync to Google Sheets: {e}")

        return Response({
            'message': 'Financing request submitted successfully',
            'request': FinancingRequestSerializer(financing_request).data
        }, status=status.HTTP_201_CREATED)

    def _send_customer_email(self, financing_request):
        """Send confirmation email to customer"""
        try:
            subject = f'MobiPlan Financing Request Confirmation - {financing_request.request_number}'
            message = f"""
Dear {financing_request.full_name},

Thank you for your financing request with MobiPlan!

Request Details:
- Request Number: {financing_request.request_number}
- Product: {financing_request.product_name}
- Price: KES {financing_request.product_price:,.2f}
- Sacco: {financing_request.sacco_name}
- Payment Timeline: {financing_request.payment_months} Months

We have forwarded your request to {financing_request.sacco_name}. They will contact you soon to proceed with the financing process.

If you have any questions, please don't hesitate to contact us.

Best regards,
MobiPlan Team
            """
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [financing_request.email],
                fail_silently=True,
            )
            financing_request.customer_email_sent = True
            financing_request.save()
        except Exception as e:
            print(f"Error sending customer email: {e}")

    def _send_admin_email(self, financing_request):
        """Send notification email to admin"""
        try:
            subject = f'New Financing Request - {financing_request.request_number}'
            message = f"""
New financing request received:

Customer Information:
- Name: {financing_request.full_name}
- Phone: {financing_request.phone_number}
- Email: {financing_request.email}
- National ID: {financing_request.national_id}
- Town: {financing_request.town_of_residence}

Product Information:
- Product: {financing_request.product_name}
- Variation: {financing_request.variation_details or 'N/A'}
- Price: KES {financing_request.product_price:,.2f}

Financing Details:
- Sacco: {financing_request.sacco_name}
- Payment Timeline: {financing_request.payment_months} Months

Request Number: {financing_request.request_number}
            """
            # Get admin emails from settings or use default
            admin_email = getattr(settings, 'ADMIN_EMAIL', settings.DEFAULT_FROM_EMAIL)
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [admin_email],
                fail_silently=True,
            )
            financing_request.admin_email_sent = True
            financing_request.save()
        except Exception as e:
            print(f"Error sending admin email: {e}")
