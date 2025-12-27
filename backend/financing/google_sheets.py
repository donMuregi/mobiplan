"""
Google Sheets integration for financing requests.

This module handles syncing financing request data to Google Sheets.
Each Sacco can have its own Google Sheet configured via the google_sheet_id field.

Setup Instructions:
1. Create a Google Cloud project: https://console.cloud.google.com
2. Enable the Google Sheets API
3. Create a Service Account and download the JSON key file
4. Share your Google Sheets with the service account email (with Editor access)
5. Save the JSON key file as 'google_sheets_credentials.json' in the backend folder
   OR set the GOOGLE_SHEETS_CREDENTIALS environment variable with the JSON content
"""

import os
import json
import logging
from datetime import datetime
from django.conf import settings

logger = logging.getLogger(__name__)

# Try to import google-api-python-client (optional dependency)
try:
    from google.oauth2.service_account import Credentials
    from googleapiclient.discovery import build
    from googleapiclient.errors import HttpError
    GOOGLE_SHEETS_AVAILABLE = True
except ImportError:
    GOOGLE_SHEETS_AVAILABLE = False
    logger.warning("Google Sheets API not available. Install google-api-python-client and google-auth")


# Scopes required for Google Sheets API
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']


def get_google_credentials():
    """
    Get Google service account credentials.
    Tries to load from:
    1. GOOGLE_SHEETS_CREDENTIALS_FILE setting (path to JSON file)
    2. GOOGLE_SHEETS_CREDENTIALS environment variable (JSON string)
    3. Default file 'google_sheets_credentials.json' in backend folder
    """
    if not GOOGLE_SHEETS_AVAILABLE:
        return None
    
    # Try file path from settings
    creds_file = getattr(settings, 'GOOGLE_SHEETS_CREDENTIALS_FILE', None)
    if creds_file and os.path.exists(creds_file):
        return Credentials.from_service_account_file(creds_file, scopes=SCOPES)
    
    # Try environment variable (JSON string)
    creds_json = os.environ.get('GOOGLE_SHEETS_CREDENTIALS')
    if creds_json:
        try:
            creds_info = json.loads(creds_json)
            return Credentials.from_service_account_info(creds_info, scopes=SCOPES)
        except json.JSONDecodeError:
            logger.error("Invalid JSON in GOOGLE_SHEETS_CREDENTIALS environment variable")
    
    # Try default file location
    default_file = os.path.join(settings.BASE_DIR, 'google_sheets_credentials.json')
    if os.path.exists(default_file):
        return Credentials.from_service_account_file(default_file, scopes=SCOPES)
    
    logger.warning("No Google Sheets credentials found")
    return None


def get_sheets_service():
    """Get Google Sheets API service instance."""
    credentials = get_google_credentials()
    if not credentials:
        return None
    
    try:
        service = build('sheets', 'v4', credentials=credentials)
        return service
    except Exception as e:
        logger.error(f"Error building Sheets service: {e}")
        return None


def ensure_headers_exist(service, spreadsheet_id, sheet_name, headers):
    """
    Ensure the sheet has headers in the first row.
    If empty, adds the headers.
    """
    try:
        range_name = f"{sheet_name}!A1:Z1"
        result = service.spreadsheets().values().get(
            spreadsheetId=spreadsheet_id,
            range=range_name
        ).execute()
        
        values = result.get('values', [])
        
        # If no headers exist, add them
        if not values or not values[0]:
            service.spreadsheets().values().update(
                spreadsheetId=spreadsheet_id,
                range=f"{sheet_name}!A1",
                valueInputOption='RAW',
                body={'values': [headers]}
            ).execute()
            logger.info(f"Added headers to sheet: {sheet_name}")
            return True
        
        return True
    except HttpError as e:
        logger.error(f"Error checking/adding headers: {e}")
        return False


def sync_financing_request_to_sheets(financing_request):
    """
    Sync a financing request to the corresponding Sacco's Google Sheet.
    
    Args:
        financing_request: FinancingRequest model instance
    
    Returns:
        bool: True if sync was successful, False otherwise
    """
    if not GOOGLE_SHEETS_AVAILABLE:
        logger.warning("Google Sheets API not available - skipping sync")
        return False
    
    sacco = financing_request.sacco
    if not sacco or not sacco.google_sheet_id:
        logger.info(f"No Google Sheet configured for Sacco: {sacco.name if sacco else 'None'}")
        return False
    
    service = get_sheets_service()
    if not service:
        logger.error("Could not get Google Sheets service")
        return False
    
    spreadsheet_id = sacco.google_sheet_id
    sheet_name = sacco.google_sheet_name or 'Sheet1'
    
    # Define headers (column names)
    headers = [
        'Request Number',
        'Date Submitted',
        'Customer Name',
        'Phone Number',
        'Email',
        'National ID',
        'Town',
        'Product Name',
        'Product Variation',
        'Product Price (KES)',
        'Payment Months',
        'Monthly Payment (KES)',
        'Status',
        'Customer Notes',
    ]
    
    # Ensure headers exist
    if not ensure_headers_exist(service, spreadsheet_id, sheet_name, headers):
        logger.error("Failed to ensure headers exist")
        return False
    
    # Calculate monthly payment (simple division)
    monthly_payment = float(financing_request.product_price) / financing_request.payment_months
    
    # Prepare row data
    row_data = [
        financing_request.request_number,
        financing_request.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        financing_request.full_name,
        financing_request.phone_number,
        financing_request.email,
        financing_request.national_id,
        financing_request.town_of_residence,
        financing_request.product_name,
        financing_request.variation_details or 'N/A',
        float(financing_request.product_price),
        financing_request.payment_months,
        round(monthly_payment, 2),
        financing_request.get_status_display(),
        financing_request.customer_notes or '',
    ]
    
    try:
        # Append data to the sheet
        range_name = f"{sheet_name}!A:N"
        body = {'values': [row_data]}
        
        result = service.spreadsheets().values().append(
            spreadsheetId=spreadsheet_id,
            range=range_name,
            valueInputOption='USER_ENTERED',
            insertDataOption='INSERT_ROWS',
            body=body
        ).execute()
        
        updated_range = result.get('updates', {}).get('updatedRange', '')
        logger.info(f"Successfully synced request {financing_request.request_number} to {sheet_name}: {updated_range}")
        
        # Update the financing request to mark as synced
        financing_request.synced_to_sheet = True
        financing_request.save(update_fields=['synced_to_sheet'])
        
        return True
        
    except HttpError as e:
        error_details = json.loads(e.content.decode('utf-8')).get('error', {})
        logger.error(f"Google Sheets API error: {error_details.get('message', str(e))}")
        return False
    except Exception as e:
        logger.error(f"Error syncing to Google Sheets: {e}")
        return False


def sync_all_pending_requests():
    """
    Sync all financing requests that haven't been synced to sheets yet.
    Useful for batch processing or recovery.
    """
    from .models import FinancingRequest
    
    pending = FinancingRequest.objects.filter(synced_to_sheet=False)
    success_count = 0
    fail_count = 0
    
    for request in pending:
        if sync_financing_request_to_sheets(request):
            success_count += 1
        else:
            fail_count += 1
    
    return success_count, fail_count
