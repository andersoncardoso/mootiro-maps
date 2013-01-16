# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.utils.translation import ugettext as _
from django.core.urlresolvers import reverse

from main.models import BaseModel, CommonObject
from komoo_map.models import POLYGON, POINT
from tags.models import TagField


LOGO_CHOICES = (
    ('UP', 'Uploaded'),
    ('CAT', 'Category'),
)


class Organization(CommonObject):
    # logo = models.ForeignKey(UploadedFile, null=True, blank=True)
    # logo_category = models.ForeignKey('OrganizationCategory', null=True,
    #                    blank=True, related_name='organization_category_logo')
    # logo_choice = models.CharField(max_length=3, choices=LOGO_CHOICES,
    #                     null=True, blank=True)

    categories = models.ManyToManyField('OrganizationCategory', null=True,
                        blank=True)
    target_audience = TagField(namespace='target_audience')

    class Map:
        editable = True
        title = _('Organization')
        tooltip = _('Add Organization')
        background_color = '#3a61d6'
        border_color = '#1f49b2'
        geometries = (POLYGON, POINT)
        form_view_name = 'new_organization_from_map'

    @property
    def url(self):
        return reverse('organization_view', kwargs={'id_': self.id})

    # ================== utils ============================
    def from_json(self):
        pass

    def to_json(self):
        return {}


class OrganizationCategory(BaseModel):
    name = models.CharField(max_length=320, unique=True)

    def __unicode__(self):
        return unicode(self.name)

    # "culture-and-arts.png",
    # "education.png",
    # "environment.png",
    # "health.png",
    # "housing.png",
    # "research.png",
    # "self-help.png",
    # "social-services.png",
    # "sports-and-recreation.png",
    # "emergency-aid-disaster-relief.png",
    # "animal-protection.png",
    # "community-development.png",
    # "income-generation.png",
    # "human-rights-promotion.png",
    # "law-and-legal-services.png",
    # "voluntarism-promotion.png",
    # "promotion-of-civil-society-organizations.png",
    # "fundraising-and-grant-making-organization.png",
    # "peace-promotion.png",
    # "cultural-exchange.png",
    # "development-assistance.png",


