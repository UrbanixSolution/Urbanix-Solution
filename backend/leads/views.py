"""DRF ViewSets for the Leads app."""

from rest_framework import viewsets, status
from rest_framework.response import Response

from .models import Lead
from .serializers import LeadSerializer


class LeadViewSet(viewsets.ModelViewSet):
    """
    Full CRUD ViewSet for Leads.

    Endpoints:
        GET    /api/leads/         — List all leads (admin use)
        POST   /api/leads/         — Create a new lead (public form submission)
        GET    /api/leads/{id}/    — Retrieve a lead
        PATCH  /api/leads/{id}/    — Update lead status
        DELETE /api/leads/{id}/    — Delete a lead
    """

    queryset = Lead.objects.all()
    serializer_class = LeadSerializer

    def create(self, request, *args, **kwargs):
        """Override create to return a friendly success message."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(
            {
                'success': True,
                'message': "Thank you! We've received your inquiry and will reach out on WhatsApp shortly.",
                'data': serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )
