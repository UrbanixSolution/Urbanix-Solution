"""
Celery application configuration for Urbanix Solution.

This module sets up Celery with Redis as the message broker,
ready for AI-powered background task automation.
"""

import os
from celery import Celery

# Set the default Django settings module for Celery
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

app = Celery('core')

# Use Django's settings file for Celery configuration
app.config_from_object('django.conf:settings', namespace='CELERY')

# Auto-discover tasks from all installed apps
app.autodiscover_tasks()


# ---------------------------------------------------------------------------
# Placeholder Tasks — Future AI Automation
# ---------------------------------------------------------------------------

@app.task(bind=True, ignore_result=True)
def debug_task(self):
    """Debug task for testing Celery connectivity."""
    print(f'Request: {self.request!r}')


# TODO: AI Task Placeholders
# ---------------------------------------------------------
# @app.task
# def generate_project_description_ai(project_id: int):
#     """
#     Use an LLM (e.g., Gemini API) to auto-generate a polished
#     project description based on tech stack and title.
#     """
#     pass
#
# @app.task
# def send_lead_notification_whatsapp(lead_id: int):
#     """
#     Send a WhatsApp notification via Twilio/Meta API
#     when a new lead is captured.
#     """
#     pass
#
# @app.task
# def analyze_portfolio_performance(project_id: int):
#     """
#     Use pgvector embeddings to find similar projects and
#     suggest improvements for portfolio positioning.
#     """
#     pass
