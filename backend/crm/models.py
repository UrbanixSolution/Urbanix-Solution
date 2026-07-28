"""
CRM & ERP models for the Agency.

Tracks team performance, client revenue, project profitability,
inbound contact leads, and career applications.
"""

from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


# ---------------------------------------------------------------------------
# Team
# ---------------------------------------------------------------------------

class TeamMember(models.Model):
    """An internal employee or freelancer on the agency roster."""

    name = models.CharField(max_length=200)
    role = models.CharField(max_length=100, help_text='e.g. "Frontend Developer", "Designer"')
    is_freelancer = models.BooleanField(
        default=False,
        help_text='Tick if this person is a freelancer rather than a full-time employee.'
    )
    standard_charge = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text='Standard per-task or per-hour charge paid to this member (in your base currency).'
    )
    average_rating = models.FloatField(
        default=0.0,
        validators=[MinValueValidator(0.0), MaxValueValidator(5.0)],
        help_text='Computed average performance rating across all tasks (0.0 – 5.0).'
    )
    total_tasks_completed = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text='Running count of tasks marked Completed and assigned to this member.'
    )
    send_update_email = models.BooleanField(
        default=False,
        help_text="Check this to generate a new password and email the user with their updated role and new credentials."
    )

    class Meta:
        ordering = ['name']
        verbose_name = 'Freelancer'
        verbose_name_plural = 'Freelance Team'

    def __str__(self):
        tag = 'Freelancer' if self.is_freelancer else 'Employee'
        return f'{self.name} - {self.role} ({tag})'


# ---------------------------------------------------------------------------
# Clients
# ---------------------------------------------------------------------------

class Client(models.Model):
    """A client (company) that the agency has worked with."""

    company_name = models.CharField(max_length=255)
    client_name = models.CharField(max_length=200, help_text='Primary point-of-contact name.')
    total_revenue_generated = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0)],
        help_text='Cumulative revenue billed to this client (auto-updated or managed manually).'
    )

    class Meta:
        ordering = ['company_name']
        verbose_name = 'Client'
        verbose_name_plural = 'Clients'

    def __str__(self):
        return f'{self.company_name} ({self.client_name})'


# ---------------------------------------------------------------------------
# Projects & Tasks
# ---------------------------------------------------------------------------

class ProjectTask(models.Model):
    """A billable task or deliverable linked to a client and a team member."""

    STATUS_CHOICES = [
        ('Pending',   'Pending'),
        ('Completed', 'Completed'),
    ]

    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name='tasks',
    )
    assigned_to = models.ForeignKey(
        TeamMember,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tasks',
        help_text='Team member responsible for this task.'
    )
    task_name = models.CharField(max_length=255)
    client_charged_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text='Amount billed to the client for this task.'
    )
    freelancer_paid_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0)],
        help_text='Amount paid to the assigned freelancer/employee for this task.'
    )
    performance_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text='Performance rating for this task (1 = Poor, 5 = Excellent).'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Pending',
    )

    class Meta:
        ordering = ['-id']
        verbose_name = 'Project Task'
        verbose_name_plural = 'Project Tasks'

    def __str__(self):
        return f'{self.task_name} -> {self.client.company_name} [{self.status}]'

    @property
    def profit(self):
        """Net profit for this task: amount charged to client minus amount paid to freelancer."""
        return self.client_charged_amount - self.freelancer_paid_amount


# ---------------------------------------------------------------------------
# Inbound Leads
# ---------------------------------------------------------------------------

class ContactLead(models.Model):
    """An inbound enquiry captured from the public contact / enquiry form."""

    name = models.CharField(max_length=200)
    email = models.EmailField()
    service_interested = models.CharField(
        max_length=200,
        help_text='The service the prospect is enquiring about.'
    )
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-submitted_at']
        verbose_name = 'Contact Lead'
        verbose_name_plural = 'Contact Leads'

    def __str__(self):
        return f'{self.name} <{self.email}> - {self.service_interested} ({self.submitted_at.date()})'


# ---------------------------------------------------------------------------
# Career Applications
# ---------------------------------------------------------------------------

class CareerApplication(models.Model):
    """A job / internship application submitted through the careers page."""

    applicant_name = models.CharField(max_length=200)
    role_applied_for = models.CharField(max_length=200)
    portfolio_link = models.URLField(
        null=True,
        blank=True,
        help_text='Optional link to the applicant\'s portfolio or GitHub profile.'
    )
    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-applied_at']
        verbose_name = 'Career Application'
        verbose_name_plural = 'Career Applications'

    def __str__(self):
        return f'{self.applicant_name} - {self.role_applied_for} ({self.applied_at.date()})'
