# -*- coding: utf-8 -*-
from __future__ import unicode_literals  # unicode by default

from django.db import models
from django.utils.translation import ugettext as _
from django.core.urlresolvers import reverse

from main.utils import build_obj_from_dict, get_model_from_table_ref
from main.models import BaseModel, CommonObject

from organizations.models import Organization


INVESTOR_TYPE = (
        ('ORG', _('Organization')),
        ('PER', _('Person')),
)

INVESTMENT_TYPE = (
    ('donation', _('Donation')),
    ('goods', _('Goods')),
    ('volunteering', _('Volunteering')),
    ('public', _('Public Investment')),
)

CURRENCIES_CHOICES = (
    ('BRL', _('Real')),
    ('USD', _('Dollar')),
    ('EUR', _('Euro')),
)


class Investor(BaseModel):
    """
    Investor for the investments model.
    A Investor can be of two kinds. An organization registered on our system
    which has a reference, or an non-registered 'person' (can be a
    organization or anything else), which only has a name.
    The Investor also can be anonymous. A anonymous investor is a 'Person'
    without a  name.
    Fields:
        investor_type: kind of investor. Person (PER) or Organization (ORG)
        person_name: name of the person, if the type is the same.
        organization_id: reference for organization if the type is org.

        name: property for easily retrieving a presentation name for the
              investor in despite of its kind.
    """
    investor_type = models.CharField(max_length=3, choices=INVESTOR_TYPE,
                                     default='PER')
    person_name = models.CharField(max_length=512, blank=True, null=True)
    organization_id = models.IntegerField(null=True, blank=True)

    @property
    def name(self):
        if self.investor_type == 'ORG':
            return Organization.get_by_id(self.organization_id).name
        elif self.investor_type == 'PER':
            return self.person_name or _('Anonymous')

    # ======================= Utils =============================

    def to_dict(self):
        return {
            'investor_type': self.investor_type,
            'name': self.name,
            'person_name': self.person_name,
            'organization_id': self.organization_id
        }

    def from_dict(self, data):
        keys = ['investor_type', 'person_name', 'organization_id']
        build_obj_from_dict(self, data, keys)

    def is_valid(self):
        self.errors = {}
        validates = True
        if not getattr(self, 'investor_type', None):
            validates = False
            self.errors['investor_type'] = ('Required field')

        # If its a Org should have a valid reference
        if getattr(self, 'investor_type', None) == 'ORG' and \
           (not self.organization_id or not Organization.get_by_id(
               self.organization_id)):

            validates = False
            self.errors['organization_id'] = _('Invalid Organization')

        return validates


class Investment(CommonObject):
    """
    A donation of money (or any other stuff) for any object in the system.
    Fields:
        investment_type: specific kind of investment.
        value: donated amount
        currency: type of currency for the value
        stard_date: start date for the donation.
        end_date: end date for the time range of the donation. If the donation
                  dont have a time range, you can use only the start_date
        investor: reference for the Investor table. Can be a Org or a person
        invested_object_table: table ref for the invested object
        invested_object_id: id for the invested obj.

    You can easily set the invested type using the method
    `set_invested_object(obj)`
    """
    common_object_type = 'investment'

    investment_type = models.CharField(max_length=100, choices=INVESTMENT_TYPE,
                default='donation')
    value = models.DecimalField(decimal_places=2, max_digits=14, null=True,
                blank=True)
    currency = models.CharField(max_length=3, choices=CURRENCIES_CHOICES,
                default='BRL', null=True, blank=True)

    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    investor = models.ForeignKey(Investor)

    invested_object_table = models.CharField(max_length=512)
    invested_object_id = models.IntegerField()

    @property
    def url(self):
        return reverse('investment_view', kwargs={'id_': self.id})

    def _set_invested_object(self, obj):
        self.invested_object_table = obj.table_ref
        self.invested_object_id = obj.id

    def _get_invested_object(self):
        model = get_model_from_table_ref(self.invested_object_table)
        obj = models.get_by_id(self.invested_object_id)
        return obj

    invested_object = property(_get_invested_object, _set_invested_object)

    # ======================= Utils =============================

    def from_dict(self, data):
        super(Investment, self).from_dict(data)
        keys = ['investment_type', 'value', 'currency', 'start_date',
                'end_date', 'investor', 'invested_object_table',
                'invested_object_id']
        date_keys = ['start_date', 'end_date']
        build_obj_from_dict(self, data, keys, date_keys)

    def to_dict(self):
        data = super(Investment, self).to_dict()
        data.update({
            'investment_type': self.investment_type,
            'value': self.value,
            'currency': self.currency,
            'start_date': self.start_date,
            'end_date': self.end_date,
            'investor': self.investor,
            'invested_object_table': self.invested_object_table,
            'invested_object_id': self.invested_object_id,
        })
        return data

    def is_valid(self):
        self.errors = {}
        validates = super(Investment, self).is_valid()
        # custom validations here
        return validates


