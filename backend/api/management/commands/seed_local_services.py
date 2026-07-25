from django.core.management.base import BaseCommand
from api.models import Service, Category

SERVICES_SEED = [
    {
        'title': 'Business Websites',
        'slug': 'business-websites',
        'icon_name': 'Globe',
        'short_description': 'High-converting landing pages and custom business websites built for maximum conversions.',
        'full_description': 'We build lightning-fast, custom websites tailored specifically for local businesses. Every layout is engineered to turn casual visitors into paying customers with clear calls-to-action, instant WhatsApp integration, and mobile optimization.',
        'pricing_text': 'Starting at ₹14,999 one-time',
        'features': [
            '100% Mobile & Desktop Responsive Design',
            'Direct WhatsApp & Instant Lead Call Buttons',
            'Google Maps & Business Profile Integration',
            'Sub-1 Second Page Load Speed Optimization',
            'On-Page Local SEO Setup',
            'Free SSL Certificate & Security Hardening'
        ],
        'order': 1,
        'is_active': True,
    },
    {
        'title': 'E-Commerce Setup',
        'slug': 'e-commerce',
        'icon_name': 'ShoppingCart',
        'short_description': 'Turnkey digital storefronts with secure payment integrations and inventory sync.',
        'full_description': 'Launch your online store with zero hassle. We handle complete catalog setup, UPI/credit card payment gateway integrations, automated WhatsApp order receipts, and real-time inventory management.',
        'pricing_text': 'Starting at ₹24,999 one-time',
        'features': [
            'Razorpay / Stripe Payment Gateway Integration',
            'Automated WhatsApp Order Confirmation',
            'Product Inventory & Order Tracking Dashboard',
            'Discount Coupon & Promotional Offer Setup',
            'High-converting One-Page Checkout Experience',
            'Sales Analytics & Customer CRM Integration'
        ],
        'order': 2,
        'is_active': True,
    },
    {
        'title': 'Reels & Video Editing',
        'slug': 'video-editing',
        'icon_name': 'Video',
        'short_description': 'High-impact short-form video reels, promotional edits, and brand stories.',
        'order': 3,
        'full_description': 'Capture attention on Instagram Reels, YouTube Shorts, and Facebook. We edit high-engagement short videos with dynamic motion graphics, subtitles, sound design, and viral hooks to build local brand awareness.',
        'pricing_text': 'Starting at ₹9,999/mo (12 Reels)',
        'features': [
            '1080p High Definition Vertical Edits (9:16)',
            'Dynamic Captions & Motion Graphics',
            'Trending Audio & Sound Effects Mix',
            'Custom Thumbnails & Cover Designs',
            'Script Hook & Content Strategy Guidance',
            'Fast 48-Hour Edit Turnaround'
        ],
        'is_active': True,
    },
    {
        'title': 'Performance Ads',
        'slug': 'performance-ads',
        'icon_name': 'Target',
        'short_description': 'Data-driven paid ad campaigns designed to maximize ROI and customer acquisition.',
        'full_description': 'Stop throwing money at unmeasured marketing. Our targeted Google and Meta ad campaigns reach local customers actively searching for your service in your city or neighborhood.',
        'pricing_text': 'Starting at ₹12,500/mo management fee',
        'features': [
            'Hyper-Local Audience Geo-Targeting',
            'High-converting Ad Copy & Visual Design',
            'Direct WhatsApp & Call Lead Campaigns',
            'A/B Creative & Headline Testing',
            'Weekly Performance & ROI Dashboards',
            'Dedicated Campaign Manager'
        ],
        'order': 4,
        'is_active': True,
    },
    {
        'title': 'Local SEO',
        'slug': 'local-seo',
        'icon_name': 'MapPin',
        'short_description': 'Dominate local searches, Google Maps pack, and drive foot traffic to your business.',
        'full_description': 'Rank #1 when customers search for your business near them. We optimize your Google Business Profile, build local citations, manage customer reviews, and drive consistent foot traffic.',
        'pricing_text': 'Starting at ₹8,999/mo',
        'features': [
            'Google Business Profile (GMB) Optimization',
            'Google Maps Top 3 Pack Ranking Strategy',
            'Local Keyword & Competitor Analysis',
            'Review Automation & Customer Feedback Setup',
            'Local Directory & Citation Submissions',
            'Monthly Ranking Growth Reports'
        ],
        'order': 5,
        'is_active': True,
    },
    {
        'title': 'Maintenance & Support',
        'slug': 'maintenance',
        'icon_name': 'ShieldCheck',
        'short_description': 'Ongoing technical updates, security monitoring, performance tuning, and priority support.',
        'full_description': 'Keep your digital asset running flawlessly 24/7. Our monthly retainers include cloud hosting management, daily security backups, framework updates, and instant technical support.',
        'pricing_text': 'Starting at ₹4,999/mo',
        'features': [
            '24/7 Server Uptime & Health Monitoring',
            'Daily Automated Cloud Database Backups',
            'Monthly Security Hardening & Malware Scans',
            'Content & Pricing Update Requests',
            'Priority WhatsApp Technical Support',
            'Zero Downtime Guarantee'
        ],
        'order': 6,
        'is_active': True,
    },
]

CATEGORIES_SEED = [
    {
        'name': 'Local Business',
        'slug': 'local-business',
        'icon_name': 'Store',
        'description': 'High-converting custom websites for local service providers and retail stores.',
        'order': 1,
    },
    {
        'name': 'Education & Communities',
        'slug': 'education',
        'icon_name': 'GraduationCap',
        'description': 'Interactive learning platforms, LMS, and community spaces.',
        'order': 2,
    },
    {
        'name': 'Personal Portfolios',
        'slug': 'portfolios',
        'icon_name': 'User',
        'description': 'Sleek, responsive portfolios for creators, executives, and professionals.',
        'order': 3,
    },
]

VALID_SLUGS = [s['slug'] for s in SERVICES_SEED]


class Command(BaseCommand):
    help = 'Cleans old placeholder services and seeds exact local business services and categories with rich details.'

    def handle(self, *args, **options):
        # 1. Remove old/obsolete services not in the valid list
        deleted_count, _ = Service.objects.exclude(slug__in=VALID_SLUGS).delete()
        if deleted_count > 0:
            self.stdout.write(self.style.WARNING(f"Cleaned up {deleted_count} obsolete services."))

        # 2. Seed/Update Services
        serv_count = 0
        for sdata in SERVICES_SEED:
            obj, created = Service.objects.update_or_create(
                slug=sdata['slug'],
                defaults=sdata
            )
            serv_count += 1
            action = "Created" if created else "Updated"
            self.stdout.write(self.style.SUCCESS(f"{action} service: {obj.title} ({obj.slug})"))

        # 3. Seed/Update Categories
        cat_count = 0
        for cdata in CATEGORIES_SEED:
            obj, created = Category.objects.update_or_create(
                slug=cdata['slug'],
                defaults=cdata
            )
            cat_count += 1
            action = "Created" if created else "Updated"
            self.stdout.write(self.style.SUCCESS(f"{action} category: {obj.name} ({obj.slug})"))

        self.stdout.write(self.style.SUCCESS(f"\nSuccessfully seeded {serv_count} Services and {cat_count} Categories in API app!"))
