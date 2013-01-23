# -*- coding: utf-8 -*-
from __future__ import unicode_literals  # unicode by default

from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.core.urlresolvers import reverse


from main.models import BaseModel, CommonObject

INVESTOR_TYPE = (
        ('ORG', _('Organization')),
        ('PER', _('Person')),
)

INVESTMENT_TYPE = (
    ('', _('')),
)

CURRENCIES_CHOICES = (
    ('BRL', _('Real')),
    ('USD', _('Dollar')),
    ('EUR', _('Euro')),
)


class Investor(BaseModel):
    """ The giver part on an investment. """
    investor_type = models.CharField(max_length=3, choices=INVESTOR_TYPE,
                                     default='PER')
    name = models.CharField(max_length=512, blank=True, null=True)
    organization = models.IntegerField()

    # TODO fix-me


class Investment(CommonObject):
    """
    A donation of money (or any other stuff) for either an Organization, a
    Proposal or a Resource in the system.
    """
    common_object_type = 'investment'

    investment_type = models.CharField(max_length=100, choices=INVESTMENT_TYPE)
    value = models.DecimalField(decimal_places=2, max_digits=14, null=True,
                blank=True)
    currency = models.CharField(max_length=3, choices=CURRENCIES_CHOICES,
                null=True, blank=True)

    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)


