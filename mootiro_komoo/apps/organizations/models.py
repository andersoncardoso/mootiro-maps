# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.utils.translation import ugettext as _
from django.core.urlresolvers import reverse

from main.models import CommonObject
from main.utils import build_obj_from_dict
from komoo_map.models import POLYGON, POINT


ORGANIZATION_TYPES = (
    ('school', _('School')),
    ('ong', _('ONG')),
    ('health', _('Health Service')),
    ('culture', _('Cultural Institution')),
    ('public', _('Public Institution')),
    ('enterprise', _('Enterprise')),
    ('others', _('Others'))
)


class Organization(CommonObject):
    """
    Organizations

    Inherits from CommonObject (common_object_type=organization)
    Extra data:
        organizatoin_type: identification for which kind of organization it
                           represents. Default: ong
    """
    common_object_type = 'organization'

    organization_type = models.CharField(
            max_length=100, null=True, blank=True, choices=ORGANIZATION_TYPES,
            default='ong')

    class Map:
        editable = True
        title = _('Organization')
        tooltip = _('Add Organization')
        background_color = '#3a61d6'
        border_color = '#1f49b2'
        geometries = (POLYGON, POINT)

    @property
    def url(self):
        return reverse('organization_view', kwargs={'id_': self.id})

    # ================== utils ============================
    def from_dict(self, data):
        super(Organization, self).from_json(data)
        keys = ['organization_type', ]
        build_obj_from_dict(self, data, keys)

    def to_dict(self):
        data = super(Organization, self).to_dict()
        data.update({
            'organization_type': self.organization_type
        })
        return data

    def is_valid(self):
        return super(Organization, self).is_valid()



# Old categories to be used as alternative logos:
#
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


