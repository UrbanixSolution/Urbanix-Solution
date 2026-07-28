from django.db import models
from django.utils.text import slugify


class Service(models.Model):
    """
    Agency Service model (e.g. Business Websites, E-Commerce Setup, Local SEO).
    """
    title = models.CharField(max_length=200, help_text="Service title shown on Navbar and Services page")
    slug = models.SlugField(max_length=220, unique=True, blank=True, help_text="URL slug e.g. business-websites")
    short_description = models.TextField(help_text="One-to-two sentence summary description")
    full_description = models.TextField(blank=True, help_text="Detailed long description for the service detail page")
    pricing_text = models.CharField(max_length=150, blank=True, help_text="Pricing highlight for frontend display e.g. Starting at ₹15,000/mo")
    base_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Numeric base price in INR (e.g. 15000.00) — used for sorting and calculations"
    )
    features = models.JSONField(default=list, blank=True, help_text="JSON list of features e.g. ['Custom Design', 'SEO Optimized']")
    icon_name = models.CharField(
        max_length=100,
        blank=True,
        help_text="Lucide icon name (e.g. Globe, ShoppingCart, Video, Target, MapPin, ShieldCheck)"
    )
    order = models.PositiveSmallIntegerField(default=0, help_text="Display order in dropdowns and lists")
    is_active = models.BooleanField(default=True, help_text="Active status toggle")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'title']
        verbose_name = "Service"
        verbose_name_plural = "Services"

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class PricingTier(models.Model):
    """
    Tiered pricing packages per service (e.g. Single Page, 4-5 Pages, Custom E-Commerce).
    Add/edit tiers directly inside the Service admin via TabularInline.
    """
    service = models.ForeignKey(
        Service,
        related_name='pricing_tiers',
        on_delete=models.CASCADE,
        help_text="Parent service this pricing tier belongs to"
    )
    name = models.CharField(max_length=200, help_text="Tier name e.g. Single Page Website")
    price = models.CharField(max_length=100, help_text="Display price e.g. ₹3,999")
    delivery_time = models.CharField(max_length=150, blank=True, help_text="e.g. Delivered in 3 Days")
    features = models.JSONField(
        default=list,
        blank=True,
        help_text="JSON list of features for this tier e.g. [\"1 Page\", \"Mobile Responsive\", \"WhatsApp Button\"]"
    )
    is_popular = models.BooleanField(default=False, help_text="Highlight as the most popular / recommended tier")
    order = models.PositiveSmallIntegerField(default=0, help_text="Display order within the service")

    class Meta:
        ordering = ['order', 'id']
        verbose_name = "Pricing Tier"
        verbose_name_plural = "Pricing Tiers"

    def __str__(self):
        return f"{self.service.title} — {self.name} ({self.price})"


class Category(models.Model):
    """
    Work Category taxonomy model (e.g. Local Business, Education & Communities, Personal Portfolios).
    """
    name = models.CharField(max_length=100, unique=True, help_text="Category name e.g. Local Business")
    slug = models.SlugField(max_length=110, unique=True, blank=True, help_text="URL slug e.g. local-business")
    description = models.CharField(max_length=300, blank=True, help_text="Short description shown in tooltips/dropdowns")
    icon_name = models.CharField(
        max_length=100,
        blank=True,
        help_text="Lucide icon name (e.g. Store, GraduationCap, User)"
    )
    order = models.PositiveSmallIntegerField(default=0, help_text="Display order")

    class Meta:
        ordering = ['order', 'name']
        verbose_name = "Category"
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class PortfolioProject(models.Model):
    SECTOR_CHOICES = [
        ('local-business', 'Local Business'),
        ('education', 'Education & Communities'),
        ('portfolios', 'Personal Portfolios'),
    ]

    title = models.CharField(max_length=250, help_text="Title of the project")
    short_description = models.TextField(help_text="Short summary shown on cards")
    category = models.ForeignKey(
        Category,
        related_name='projects',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="Linked Category model for dynamic portfolio mapping"
    )
    sector = models.CharField(
        max_length=50,
        choices=SECTOR_CHOICES,
        default='local-business',
        help_text="Industry sector category fallback"
    )
    image = models.ImageField(upload_to='portfolio/', blank=True, null=True, help_text="Uploaded project screenshot")
    tech_tags = models.JSONField(default=list, blank=True, help_text="JSON list of tech stack tags e.g. ['Next.js', 'Django']")
    live_link = models.URLField(max_length=500, blank=True, help_text="External URL to live site")
    results_highlight = models.CharField(max_length=250, blank=True, help_text="e.g. Result: Automated WhatsApp Lead Funnel")
    is_featured = models.BooleanField(default=True, help_text="Feature this project in portfolio lists")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_featured', '-created_at']
        verbose_name = "Portfolio Project"
        verbose_name_plural = "Portfolio Projects"

    def __str__(self):
        return f"{self.title} ({self.category.name if self.category else self.get_sector_display()})"


class ContactLead(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=30)
    service_interested = models.CharField(max_length=150, blank=True)
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_converted = models.BooleanField(
        default=False,
        help_text='Tick when this lead has been converted to a CRM Client record.'
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Contact Lead"
        verbose_name_plural = "Contact Leads"

    def __str__(self):
        return f"Lead from {self.name} - {self.email} ({self.created_at.strftime('%Y-%m-%d %H:%M')})"


class CareerApplication(models.Model):
    ROLE_CHOICES = [
        ('Frontend Developer (React/Next.js)', 'Frontend Developer (React/Next.js)'),
        ('Backend Developer (Python/Node.js)', 'Backend Developer (Python/Node.js)'),
        ('Full-Stack Developer', 'Full-Stack Developer'),
        ('UI/UX & Web Designer', 'UI/UX & Web Designer'),
        ('WordPress / Shopify Expert', 'WordPress / Shopify Expert'),
        ('App Developer (Flutter/React Native)', 'App Developer (Flutter/React Native)'),
        ('Graphic Designer (Canva/Photoshop)', 'Graphic Designer (Canva/Photoshop)'),
        ('Video Editor (Reels/YouTube)', 'Video Editor (Reels/YouTube)'),
        ('Social Media Manager', 'Social Media Manager'),
        ('Performance Marketer (Meta/Google Ads)', 'Performance Marketer (Meta/Google Ads)'),
        ('SEO Specialist (Local & Global)', 'SEO Specialist (Local & Global)'),
        ('Content Writer / Copywriter', 'Content Writer / Copywriter'),
        ('Telecaller / Lead Generator', 'Telecaller / Lead Generator'),
        ('IoT & Hardware Prototype Engineer', 'IoT & Hardware Prototype Engineer'),
        ('Data Entry / Virtual Assistant', 'Data Entry / Virtual Assistant'),
    ]

    HIRE_STATUS_CHOICES = [
        ('Pending', 'Pending Review'),
        ('Reviewed', 'Reviewed'),
        ('Interviewing', 'Interviewing'),
        ('Hired', 'Hired'),
        ('Rejected', 'Rejected'),
    ]

    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=30)
    role_applied = models.CharField(max_length=200, choices=ROLE_CHOICES, default='Full-Stack Developer')
    state = models.CharField(max_length=100, blank=True, help_text="State")
    district = models.CharField(max_length=100, blank=True, help_text="District")
    town = models.CharField(max_length=100, blank=True, help_text="Town or City")
    portfolio_link = models.URLField(max_length=500, blank=True)
    cover_letter = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    hire_status = models.CharField(
        max_length=30,
        choices=HIRE_STATUS_CHOICES,
        default='Pending',
        help_text="Application hiring pipeline status"
    )
    is_converted = models.BooleanField(
        default=False,
        help_text='Tick when this applicant has been hired and added as a CRM Team Member.'
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Career Application"
        verbose_name_plural = "Career Applications"

    def __str__(self):
        location_str = f" ({self.district}, {self.state})" if self.district and self.state else ""
        return f"Application by {self.name} for {self.role_applied}{location_str} [{self.hire_status}]"


from django.contrib.auth.models import User


class CoreTeam(User):
    """
    Proxy model for User to display as "Core Team" in Django Admin.
    """
    class Meta:
        proxy = True
        verbose_name = "Core Team Member"
        verbose_name_plural = "Core Team"

class UserProfile(models.Model):
    """
    Extended user profile for Agency CRM Team Members containing Employee ID and RBAC permissions.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    employee_id = models.CharField(max_length=50, unique=True, help_text="Assigned Employee ID e.g. URB-DEV-001")
    role = models.CharField(max_length=150, default='Team Member', help_text="e.g. Senior Video Editor, Tech Lead")
    department = models.CharField(max_length=100, default='Production', help_text="e.g. Media Production, Engineering")
    avatar_url = models.URLField(
        max_length=500,
        blank=True,
        null=True,
        default='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
    )
    
    # Dynamic RBAC Permissions
    can_view_finance = models.BooleanField(
        default=False,
        help_text="If True, user can view P&L metrics, financial cards, and payouts ledger."
    )
    can_view_all_projects = models.BooleanField(
        default=False,
        help_text="If True, user sees all agency projects. If False, only assigned projects."
    )
    is_agency_admin = models.BooleanField(
        default=False,
        help_text="If True, user has full agency administrative access."
    )

    class Meta:
        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles"

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} ({self.employee_id}) - {self.role}"


class DashboardPermission(models.Model):
    """
    Granular card-by-card UI display permissions for Agency CRM Dashboard.
    Managed via Django Admin Inline checkboxes.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='dashboard_permissions', null=True, blank=True)
    user_profile = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name='dashboard_permissions', null=True, blank=True)
    can_view_active_projects_card = models.BooleanField(
        default=True,
        help_text="Controls visibility of Active Projects overview card."
    )
    can_view_pending_tasks_card = models.BooleanField(
        default=True,
        help_text="Controls visibility of Pending Tasks overview card."
    )
    can_view_financials_and_payouts = models.BooleanField(
        default=False,
        help_text="Controls visibility of Unbilled / Pending Payouts card (₹) & Payouts Ledger."
    )
    can_view_project_timeline = models.BooleanField(
        default=True,
        help_text="Controls visibility of Active Project Timeline section."
    )
    can_view_priority_queue = models.BooleanField(
        default=True,
        help_text="Controls visibility of Priority Task Queue card."
    )

    class Meta:
        verbose_name = "Dashboard Card Permission"
        verbose_name_plural = "Dashboard Card Permissions"

    def __str__(self):
        username = self.user.username if self.user else (self.user_profile.user.username if self.user_profile else "User")
        return f"Dashboard Card Permissions for {username}"



class WebsiteFeedback(models.Model):
    FEEDBACK_TYPE_CHOICES = [
        ('Bug Report', 'Bug Report'),
        ('Feature Request', 'Feature Request'),
        ('Design/UI Issue', 'Design/UI Issue'),
        ('Other', 'Other'),
    ]

    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Resolved', 'Resolved'),
    ]

    feedback_type = models.CharField(
        max_length=50,
        choices=FEEDBACK_TYPE_CHOICES,
        default='Bug Report'
    )
    message = models.TextField(help_text="Detailed feedback or bug description")
    contact_info = models.CharField(
        max_length=150,
        blank=True,
        null=True,
        help_text="Optional email or phone for follow-up"
    )
    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default='Pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Website Feedback"
        verbose_name_plural = "Website Feedbacks"

    def __str__(self):
        return f"[{self.feedback_type}] {self.message[:40]}... ({self.status})"


class AgencyPartnerLead(models.Model):
    SERVICE_CHOICES = [
        ('Video Editing', 'Video Editing'),
        ('App Development', 'App Development'),
        ('SEO', 'SEO'),
        ('Graphic Design', 'Graphic Design'),
        ('Performance Ads', 'Performance Ads'),
        ('Custom Software', 'Custom Software'),
        ('Other', 'Other'),
    ]

    TEAM_SIZE_CHOICES = [
        ('1-5', '1-5 Members'),
        ('5-15', '5-15 Members'),
        ('15+', '15+ Members'),
    ]

    company_name = models.CharField(max_length=250, help_text="Agency or Company Name")
    contact_person = models.CharField(max_length=200, help_text="Primary Contact Person")
    whatsapp_number = models.CharField(max_length=30, help_text="WhatsApp Number for Project Handover")
    email = models.EmailField(help_text="Official Business Email")
    core_services = models.CharField(max_length=100, choices=SERVICE_CHOICES, default='Video Editing')
    portfolio_link = models.URLField(max_length=500, help_text="Agency Website, Case Studies, or Drive Link")
    team_size = models.CharField(max_length=30, choices=TEAM_SIZE_CHOICES, default='1-5')
    state = models.CharField(max_length=100, blank=True, help_text="State")
    district = models.CharField(max_length=100, blank=True, help_text="District")
    town = models.CharField(max_length=100, blank=True, help_text="Town or City")
    proposal = models.TextField(blank=True, help_text="Brief pitch or overflow capacity details")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Agency Partner Lead"
        verbose_name_plural = "Agency Partner Leads"

    def __str__(self):
        return f"{self.company_name} ({self.get_core_services_display()}) - {self.team_size} members"


class CallbackRequest(models.Model):
    full_name = models.CharField(max_length=200, help_text="Full Name of requestor")
    phone_number = models.CharField(max_length=30, help_text="Phone or WhatsApp number")
    state = models.CharField(max_length=100, blank=True, help_text="State")
    district = models.CharField(max_length=100, blank=True, help_text="District")
    town = models.CharField(max_length=100, blank=True, help_text="Town or City")
    created_at = models.DateTimeField(auto_now_add=True)
    is_completed = models.BooleanField(default=False, help_text="Check when callback has been completed")

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Callback Request"
        verbose_name_plural = "Callback Requests"

    def __str__(self):
        return f"Callback Request from {self.full_name} ({self.phone_number}) - {self.created_at.strftime('%Y-%m-%d %H:%M')}"



