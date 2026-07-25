"""Makes core a Python package and initializes Celery."""
from .celery import app as celery_app

__all__ = ('celery_app',)
