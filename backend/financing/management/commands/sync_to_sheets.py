"""
Management command to sync financing requests to Google Sheets.

Usage:
    python manage.py sync_to_sheets          # Sync all pending requests
    python manage.py sync_to_sheets --all    # Force re-sync all requests
"""

from django.core.management.base import BaseCommand
from financing.models import FinancingRequest
from financing.google_sheets import sync_financing_request_to_sheets, GOOGLE_SHEETS_AVAILABLE


class Command(BaseCommand):
    help = 'Sync financing requests to Google Sheets'

    def add_arguments(self, parser):
        parser.add_argument(
            '--all',
            action='store_true',
            help='Sync all requests, not just pending ones',
        )
        parser.add_argument(
            '--request',
            type=str,
            help='Sync a specific request by request number',
        )

    def handle(self, *args, **options):
        if not GOOGLE_SHEETS_AVAILABLE:
            self.stderr.write(self.style.ERROR(
                'Google Sheets API is not available. '
                'Please install google-api-python-client and google-auth'
            ))
            return

        if options['request']:
            # Sync a specific request
            try:
                request = FinancingRequest.objects.get(request_number=options['request'])
                self.stdout.write(f"Syncing request: {request.request_number}")
                
                if sync_financing_request_to_sheets(request):
                    self.stdout.write(self.style.SUCCESS(f'Successfully synced {request.request_number}'))
                else:
                    self.stderr.write(self.style.ERROR(f'Failed to sync {request.request_number}'))
            except FinancingRequest.DoesNotExist:
                self.stderr.write(self.style.ERROR(f'Request not found: {options["request"]}'))
            return

        # Get requests to sync
        if options['all']:
            requests = FinancingRequest.objects.all()
            self.stdout.write(f"Syncing all {requests.count()} requests...")
        else:
            requests = FinancingRequest.objects.filter(synced_to_sheet=False)
            self.stdout.write(f"Syncing {requests.count()} pending requests...")

        success_count = 0
        fail_count = 0

        for request in requests:
            sacco_name = request.sacco.name if request.sacco else 'Unknown'
            self.stdout.write(f"  Processing: {request.request_number} -> {sacco_name}")
            
            if sync_financing_request_to_sheets(request):
                success_count += 1
                self.stdout.write(self.style.SUCCESS(f'    ✓ Synced'))
            else:
                fail_count += 1
                self.stdout.write(self.style.WARNING(f'    ✗ Failed'))

        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS(f'Completed: {success_count} synced, {fail_count} failed'))
