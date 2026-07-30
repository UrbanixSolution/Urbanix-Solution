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
    role_applied = models.CharField(max_length=200, blank=False, default='Full-Stack Developer', help_text='Primary skill or role applied for.')

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
    team_category = models.CharField(
        max_length=50,
        choices=[
            ('Core Team', 'Core Team'),
            ('Freelancer Team', 'Freelancer Team'),
        ],
        null=True,
        blank=True,
        help_text="Select which team this hired applicant will join."
    )
    assigned_services = models.ManyToManyField(
        'Service',
        blank=True,
        help_text="Select services this applicant will have access to (mainly for Freelancers)."
    )
    send_hired_email = models.BooleanField(
        default=False,
        help_text="Check this box and save to generate credentials and send the official Hired email to the applicant."
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
    is_call_partner = models.BooleanField(
        default=False,
        help_text="If True, user is an approved Call Partner who can submit client leads for commission."
    )
    is_agency_partner = models.BooleanField(
        default=False,
        help_text="If True, user is an approved B2B Agency Partner."
    )



    send_update_email = models.BooleanField(
        default=False,
        help_text="Check this to generate a new password and email the user with their updated role and new credentials."
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

    STATUS_CHOICES = [
        ('Pending',  'Pending'),
        ('Accepted', 'Accepted'),
        ('Rejected', 'Rejected'),
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
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Pending',
        help_text="Application approval status. Changing to 'Accepted' automatically creates a User account and dispatches welcome email."
    )
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


# ===========================================================================
# Agency CRM Portal — Assigned Work Models
# ===========================================================================
# These models store the real project/task/payout records that the Core Team
# assigns to specific team members via Django Admin. The DashboardDataView
# queries these tables filtered by request.user instead of returning
# hardcoded dummy data.
# ===========================================================================

class AssignedProject(models.Model):
    """
    A client project assigned to a specific team member in the CRM portal.
    Core Team creates these in Admin and links them to the relevant User.
    """

    STATUS_CHOICES = [
        ('In Progress',   'In Progress'),
        ('Under Review',  'Under Review'),
        ('Completed',     'Completed'),
        ('Upcoming',      'Upcoming'),
        ('On Hold',       'On Hold'),
    ]

    PRIORITY_CHOICES = [
        ('High',   'High'),
        ('Medium', 'Medium'),
        ('Low',    'Low'),
    ]

    # ── Core assignment ────────────────────────────────────────────────────
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='assigned_projects',
        help_text='Team member responsible for this project.',
    )

    # ── Project details (mirror the frontend Project interface) ────────────
    title = models.CharField(max_length=300, help_text='Project title shown in the portal.')
    client_name = models.CharField(max_length=200, help_text='Client or company name.')
    category = models.CharField(max_length=150, blank=True, help_text='Work category e.g. VFX & Motion Graphics.')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='In Progress')
    progress_percent = models.PositiveSmallIntegerField(
        default=0,
        help_text='Completion percentage 0–100.',
    )
    deadline = models.CharField(max_length=50, blank=True, help_text='Display deadline e.g. 04 Aug 2026.')
    deliverable_type = models.CharField(max_length=250, blank=True, help_text='e.g. 4K Cinematic Reel & UI Animations.')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='High')
    payout_est = models.PositiveIntegerField(
        default=0,
        help_text='Estimated payout for this project in INR (shown only if finance permissions are granted).',
    )
    # JSON list of team member display names e.g. ["Gaurav S.", "Rohan K."]
    team_members = models.JSONField(
        default=list,
        blank=True,
        help_text='JSON list of team member display names sharing this project e.g. ["Gaurav S.", "Rohan K."].',
    )

    # ── Timestamps ────────────────────────────────────────────────────────
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Assigned Project'
        verbose_name_plural = 'Assigned Projects'

    def __str__(self):
        return f'{self.title} → {self.assigned_to.username} [{self.status}]'


class AssignedTask(models.Model):
    """
    A task assigned to a specific team member, optionally linked to an AssignedProject.
    """

    PRIORITY_CHOICES = [
        ('Urgent', 'Urgent'),
        ('High',   'High'),
        ('Medium', 'Medium'),
        ('Normal', 'Normal'),
    ]

    STATUS_CHOICES = [
        ('todo',        'To Do'),
        ('in_progress', 'In Progress'),
        ('in_review',   'In Review'),
        ('done',        'Done'),
    ]

    # ── Core assignment ────────────────────────────────────────────────────
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='assigned_tasks',
        help_text='Team member this task is assigned to.',
    )
    project = models.ForeignKey(
        AssignedProject,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tasks',
        help_text='Parent project this task belongs to (optional).',
    )

    # ── Task details ───────────────────────────────────────────────────────
    title = models.CharField(max_length=400, help_text='Task description shown in the task board.')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='Normal')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='todo')
    due_date = models.CharField(max_length=50, blank=True, help_text='Display due date e.g. 02 Aug 2026.')
    estimated_hours = models.PositiveSmallIntegerField(
        default=1,
        help_text='Estimated hours to complete this task.',
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Assigned Task'
        verbose_name_plural = 'Assigned Tasks'

    def __str__(self):
        project_name = self.project.title if self.project else 'No Project'
        return f'[{self.get_priority_display()}] {self.title[:60]} ({project_name})'


class AssignedPayout(models.Model):
    """
    A payout record for a specific team member.
    Visible in the portal only if the user has can_view_finance or
    can_view_financials_and_payouts permission.
    """

    STATUS_CHOICES = [
        ('Pending Approval', 'Pending Approval'),
        ('Processing',       'Processing'),
        ('Paid',             'Paid'),
        ('Completed',        'Completed'),
        ('On Hold',          'On Hold'),
    ]


    # ── Core assignment ────────────────────────────────────────────────────
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='assigned_payouts',
        help_text='Team member this payout belongs to.',
    )

    # ── Payout details ─────────────────────────────────────────────────────
    invoice_no = models.CharField(max_length=100, blank=True, help_text='Invoice number e.g. URB-INV-2026-088.')
    month = models.CharField(max_length=80, help_text='Display month e.g. July 2026.')
    project_title = models.CharField(max_length=300, blank=True, help_text='Project(s) this payout covers.')
    base_amount = models.PositiveIntegerField(default=0, help_text='Base payout amount in INR.')
    bonus_amount = models.PositiveIntegerField(default=0, help_text='Bonus / performance incentive in INR.')
    total_amount = models.PositiveIntegerField(
        default=0,
        help_text='Total payout in INR. Auto-calculated as base + bonus if left at 0.',
    )
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Pending Approval')
    due_date = models.CharField(max_length=50, blank=True, help_text='Display due date e.g. 05 Aug 2026.')
    paid_date = models.CharField(max_length=50, blank=True, help_text='Display paid date e.g. 04 Jul 2026 (fill when status=Paid).')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Assigned Payout'
        verbose_name_plural = 'Assigned Payouts'

    def save(self, *args, **kwargs):
        # Auto-calculate total_amount if admin left it at 0
        if self.total_amount == 0:
            self.total_amount = self.base_amount + self.bonus_amount
        super().save(*args, **kwargs)

    def __str__(self):
        label = self.invoice_no or self.month
        return f'{label} → {self.assigned_to.username} — ₹{self.total_amount:,} [{self.status}]'


# ===========================================================================
# Call Partner Program Models
# ===========================================================================

class CallPartnerApplication(models.Model):
    """
    Public application from non-technical referral partners who want to bring client leads for commission.
    """
    STATUS_CHOICES = [
        ('Pending',  'Pending'),
        ('Accepted', 'Accepted'),
        ('Rejected', 'Rejected'),
    ]

    full_name = models.CharField(max_length=200, help_text="Full Name of the Call Partner applicant")
    email = models.EmailField(help_text="Official / Personal Email Address")
    whatsapp_number = models.CharField(max_length=30, help_text="WhatsApp Phone Number for communication")
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Pending',
        help_text="Application approval status. Changing to 'Accepted' automatically creates a User account and dispatches welcome email."
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Call Partner Application'
        verbose_name_plural = 'Call Partner Applications'

    def __str__(self):
        return f"{self.full_name} ({self.email}) — [{self.status}]"


class ClientLead(models.Model):
    """
    Client leads submitted by Call Partners for agency projects.
    """
    STATUS_CHOICES = [
        ('Under Review',                 'Under Review'),
        ('Approved',                     'Approved'),
        ('Payment Processed - 48 Hours', 'Payment Processed - 48 Hours'),
        ('Rejected',                     'Rejected'),
    ]

    partner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='submitted_client_leads',
        help_text="Call Partner user who referred/submitted this lead."
    )
    client_name = models.CharField(max_length=200, help_text="Client Name or Business Name")
    client_phone = models.CharField(max_length=30, help_text="Client Phone or WhatsApp number")
    project_type = models.CharField(
        max_length=150,
        help_text="Type of project e.g. Business Website, E-Commerce, Video Editing, Ads"
    )
    discussed_price = models.CharField(
        max_length=100,
        blank=True,
        help_text="Deal / Discussed Amount e.g. ₹15,000"
    )
    status = models.CharField(
        max_length=50,
        choices=STATUS_CHOICES,
        default='Under Review',
        help_text="Pipeline status for this referred client lead."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Client Lead'
        verbose_name_plural = 'Client Leads'

    def __str__(self):
        return f"{self.client_name} ({self.project_type}) — Referred by {self.partner.username} [{self.status}]"





