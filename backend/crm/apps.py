"""AppConfig for the crm (Agency CRM & ERP) application."""

from django.apps import AppConfig


class CrmConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'crm'
    verbose_name = 'Agency CRM & ERP'
