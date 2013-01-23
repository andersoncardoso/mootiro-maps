#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib.gis.db import models
# from django.contrib.gis.measure import Distance
from django.core.urlresolvers import reverse
from django.utils.translation import ugettext as _

from main.models import CommonObject
from main.utils import build_obj_from_dict
from komoo_map.models import POLYGON


REGION_TYPES = (
    ('urban', _('Urban Community | Slum')),
    ('native', _('Native Community')),
    ('rural', _('Rural Community')),
    ('irregular', _('Irregular Settlement')),
    ('social', _('Social Housing')),
    ('district', _('quarter | district')),
    ('others', _('Others')),
)


class Region(CommonObject):
    """
    Organizational regions, like communities, neighborhoods and etc

    Inherits from CommonObject (common_object_type=region).
    Appends the extra_data below:
        population: an extimate of the number of people living in this region
        region_type: an classfications for the region kind. Default: Community
    """
    common_object_type = 'region'

    population = models.IntegerField(null=True, blank=True)
    region_type = models.CharField(max_length=100, choices=REGION_TYPES,
                                   default='urban')

    class Map:
        title = _('Region')
        editable = True
        background_color = '#ffc166'
        border_color = '#ff2e2e'
        geometries = (POLYGON, )
        min_zoom_geometry = 10
        max_zoom_geometry = 100
        min_zoom_point = 0
        max_zoom_point = 0
        min_zoom_icon = 0
        max_zoom_icon = 0
        zindex = 5

    @property
    def url(self):
        return reverse('region_view', kwargs={'id_': self.id})

    # ================= Utils ===========================
    def from_dict(self, data):
        super(Region, self).from_dict(data)
        keys = ['population', 'region_type']
        build_obj_from_dict(self, data, keys)

    def to_dict(self):
        dict_ = super(Region, self).to_dict()
        dict_.update({
            'population': self.population,
            'region_type': self.region_type
        })
        return dict_

    def is_valid(self):
        validates = super(Region, self).is_valid()
        if getattr(self, 'population', None):
            try:
                int(self.population)
            except:
                validates = False
                self.errors['population'] = _('Must be an integer')
        if getattr(self, 'region_type', None):
            if not self.region_type in [reg[0] for reg in REGION_TYPES]:
                validates = False
                self.errors['region_type'] = _('Invalid region type')
        return validates

    # TODO: order communities from the database
    # def closest_communities(self, max=3, radius=Distance(km=25)):
    #     center = self.geometry.centroid
    #     unordered = Community.objects.filter(
    #                     polys__distance_lte=(center, radius))
    #     closest = sorted(unordered,
    #                      key=lambda c: c.geometry.distance(center))
    #     return closest[1:(max + 1)]
