"""
Management command: seed_services
Usage: python manage.py seed_services

Seeds the database with demo Service + ServiceTier data so the
/services/[slug] frontend pages have content to display immediately.
Safe to re-run — skips if services already exist.
"""

from django.core.management.base import BaseCommand
from portfolio.models import Service, ServiceTier


SEED_DATA = [
    {
        'title': 'Web Development',
        'short_description': (
            'Lightning-fast, SEO-optimised websites built with Next.js and Django. '
            'From landing pages to complex web platforms.'
        ),
        'icon_name': 'Globe',
        'order': 1,
        'tiers': [
            {
                'tier_name': 'Landing Page',
                'price_string': 'Starts at $299',
                'features': [
                    'Single page design',
                    'Mobile responsive',
                    'SEO optimised',
                    'Contact form',
                    '2 revision rounds',
                    '5-day delivery',
                ],
                'delivery_time': '3-5 business days',
                'is_featured': False,
                'order': 1,
            },
            {
                'tier_name': 'Small Business Website',
                'price_string': 'Starts at $599',
                'features': [
                    'Up to 8 pages',
                    'CMS integration',
                    'Mobile responsive',
                    'SEO foundation',
                    'Blog/news section',
                    'Google Analytics',
                    '3 revision rounds',
                ],
                'delivery_time': '1-2 weeks',
                'is_featured': True,
                'order': 2,
            },
            {
                'tier_name': 'E-Commerce Store',
                'price_string': 'Starts at $1,299',
                'features': [
                    'Full product catalogue',
                    'Stripe / PayPal payments',
                    'Inventory management',
                    'Order dashboard',
                    'Mobile-first checkout',
                    'SEO & performance tuning',
                    'Unlimited revisions',
                ],
                'delivery_time': '3-4 weeks',
                'is_featured': False,
                'order': 3,
            },
        ],
    },
    {
        'title': 'UI / UX Design',
        'short_description': (
            'Figma-to-code pixel-perfect interfaces that convert visitors into customers. '
            'Design systems built for scale.'
        ),
        'icon_name': 'Paintbrush2',
        'order': 2,
        'tiers': [
            {
                'tier_name': 'Brand Identity Kit',
                'price_string': 'Starts at $199',
                'features': [
                    'Logo design',
                    'Colour palette',
                    'Typography system',
                    'Brand guidelines PDF',
                    '2 concept directions',
                    '3 revision rounds',
                ],
                'delivery_time': '3-5 business days',
                'is_featured': False,
                'order': 1,
            },
            {
                'tier_name': 'UI Design System',
                'price_string': 'Starts at $499',
                'features': [
                    'Full Figma component library',
                    'Design tokens',
                    'Mobile & desktop screens',
                    'Interactive prototype',
                    'Handoff-ready specs',
                    'Dark mode variant',
                ],
                'delivery_time': '1-2 weeks',
                'is_featured': True,
                'order': 2,
            },
            {
                'tier_name': 'Full Product UX',
                'price_string': 'Starts at $899',
                'features': [
                    'User research & personas',
                    'User journey mapping',
                    'Wireframes + hi-fi mockups',
                    'Usability testing',
                    'Design system',
                    'Developer handoff',
                ],
                'delivery_time': '3-5 weeks',
                'is_featured': False,
                'order': 3,
            },
        ],
    },
    {
        'title': 'SaaS Development',
        'short_description': (
            'End-to-end multi-tenant SaaS platforms with billing, auth, and admin. '
            'Scalable from day one.'
        ),
        'icon_name': 'Layers',
        'order': 3,
        'tiers': [
            {
                'tier_name': 'MVP Launch',
                'price_string': 'Starts at $1,999',
                'features': [
                    'Core feature set',
                    'Auth (email + OAuth)',
                    'Stripe billing integration',
                    'Admin dashboard',
                    'REST API',
                    'Deployment on Vercel + Railway',
                ],
                'delivery_time': '4-6 weeks',
                'is_featured': False,
                'order': 1,
            },
            {
                'tier_name': 'Growth Platform',
                'price_string': 'Starts at $3,499',
                'features': [
                    'Everything in MVP',
                    'Multi-tenancy',
                    'Role-based access control',
                    'Usage-based billing',
                    'Analytics dashboard',
                    'Email notification system',
                    'CI/CD pipeline',
                ],
                'delivery_time': '6-10 weeks',
                'is_featured': True,
                'order': 2,
            },
        ],
    },
    {
        'title': 'AI Integrations',
        'short_description': (
            'LLM APIs, recommendation engines, and AI-powered features woven '
            'seamlessly into your existing product.'
        ),
        'icon_name': 'Cpu',
        'order': 4,
        'tiers': [
            {
                'tier_name': 'AI Feature Add-On',
                'price_string': 'Starts at $499',
                'features': [
                    'Single AI feature (chatbot, summariser, classifier)',
                    'OpenAI / Gemini API integration',
                    'Prompt engineering',
                    'Rate limiting & cost controls',
                    'Streaming responses',
                ],
                'delivery_time': '1-2 weeks',
                'is_featured': False,
                'order': 1,
            },
            {
                'tier_name': 'AI-Powered Product',
                'price_string': 'Starts at $2,499',
                'features': [
                    'Multi-feature AI layer',
                    'RAG pipeline with vector DB',
                    'Fine-tuning consultation',
                    'Custom embedding models',
                    'AI admin monitoring panel',
                    'Cost analytics dashboard',
                ],
                'delivery_time': '4-8 weeks',
                'is_featured': True,
                'order': 2,
            },
        ],
    },
]


class Command(BaseCommand):
    help = 'Seed the database with demo Service + ServiceTier data.'

    def handle(self, *args, **options):
        if Service.objects.exists():
            self.stdout.write(self.style.WARNING(
                'Services already exist in the database — skipping seed.'
            ))
            return

        for svc_data in SEED_DATA:
            tiers_data = svc_data.pop('tiers')
            svc = Service.objects.create(**svc_data)
            for tier_data in tiers_data:
                ServiceTier.objects.create(service=svc, **tier_data)
            self.stdout.write(self.style.SUCCESS(
                f'Created: {svc.title} (slug: {svc.slug}) with {len(tiers_data)} tiers'
            ))

        self.stdout.write(self.style.SUCCESS('\nDone! Visit /admin/portfolio/service/ to manage.'))
