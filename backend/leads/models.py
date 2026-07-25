"""Leads app models — captures inbound client leads."""

from django.db import models


class Lead(models.Model):
    """
    Represents an inbound lead from the contact form.
    WhatsApp number is stored as a string to support international formats.
    """

    SERVICE_CHOICES = [
        ('website', 'Website Development'),
        ('webapp', 'Web Application'),
        ('mobile', 'Mobile App'),
        ('saas', 'SaaS Development'),
        ('maintenance', 'Monthly Maintenance'),
        ('consulting', 'Tech Consulting'),
        ('other', 'Other'),
    ]

    STATUS_CHOICES = [
        ('new', 'New'),
        ('contacted', 'Contacted'),
        ('qualified', 'Qualified'),
        ('converted', 'Converted'),
        ('closed', 'Closed'),
    ]

    name = models.CharField(max_length=200)
    whatsapp_number = models.CharField(
        max_length=20,
        help_text='Include country code, e.g. +91 98765 43210'
    )
    service_required = models.CharField(
        max_length=50,
        choices=SERVICE_CHOICES,
        default='other'
    )
    message = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Lead'
        verbose_name_plural = 'Leads'

    def __str__(self):
        return f'{self.name} — {self.get_service_required_display()} ({self.created_at.date()})'
