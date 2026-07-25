from django.core.management.base import BaseCommand
from api.models import PortfolioProject


PROJECTS_SEED = [
    {
        'title': 'Pristinix Premium Car Care',
        'short_description': 'Transformed Hyderabad doorstep car care with an automated WhatsApp booking engine. Delivered +340% lead conversion growth and 99/100 PageSpeed scores.',
        'results_highlight': 'Result: Automated WhatsApp Lead Funnel',
        'sector': 'local-business',
        'tech_tags': ['WhatsApp Lead Funnel', 'Next.js', 'Local SEO', 'Google Maps API'],
        'live_link': 'https://pristinix.vercel.app',
        'is_featured': True,
    },
    {
        'title': 'CECP Nexus Platform',
        'short_description': 'Multi-team project tracking and workspace system built for an educational technical club.',
        'results_highlight': 'Result: Real-time Multi-Team Workspace',
        'sector': 'education',
        'tech_tags': ['Next.js', 'TypeScript', 'Django REST', 'WebSockets', 'Tailwind CSS'],
        'live_link': 'https://cecp-nexus.edu',
        'is_featured': True,
    },
    {
        'title': 'Creative Developer Portfolio',
        'short_description': 'High-performance interactive portfolio built for a software developer showcasing key projects and skills.',
        'results_highlight': 'Result: 3x Client Inquiries',
        'sector': 'portfolios',
        'tech_tags': ['Next.js', 'Framer Motion', 'Tailwind CSS', 'TypeScript'],
        'live_link': 'https://portfolio-demo.app',
        'is_featured': True,
    },
]


class Command(BaseCommand):
    help = 'Seeds initial portfolio projects into the API database.'

    def handle(self, *args, **options):
        count = 0
        for pdata in PROJECTS_SEED:
            obj, created = PortfolioProject.objects.get_or_create(
                title=pdata['title'],
                defaults=pdata
            )
            if created:
                count += 1
                self.stdout.write(self.style.SUCCESS(f"Created project: {obj.title}"))
            else:
                for key, val in pdata.items():
                    setattr(obj, key, val)
                obj.save()
                self.stdout.write(self.style.SUCCESS(f"Updated existing project: {obj.title}"))

        self.stdout.write(self.style.SUCCESS(f"Seeding complete! Added {count} projects."))
