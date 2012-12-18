#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib.gis.db import models
from django.contrib.gis.measure import Distance
from django.core.urlresolvers import reverse
from django.utils.translation import ugettext as _
from django.template.defaultfilters import slugify

from main.models import CommonObject, CommonDataMixin
from komoo_map.models import GeoRefModel, POLYGON
from authentication.models import User


class Community(CommonObject, CommonDataMixin):
    """ Common Object inherited Community"""
    common_object_type = 'community'

    population = models.IntegerField(null=True, blank=True)


    class Map:
        title = _('Community')
        editable = True
        background_color = '#ffc166'
        border_color = '#ff2e2e'
        geometries = (POLYGON, )
        form_view_name = 'new_community'
        min_zoom_geometry = 10
        max_zoom_geometry = 100
        min_zoom_point = 0
        max_zoom_point = 0
        min_zoom_icon = 0
        max_zoom_icon = 0
        zindex = 5

    @property
    def url(self):
        return '/community/%s' % self.id

    # ================= Utils ===========================
    def from_dict(self):
        pass

    def to_dict(self):
        dict_ = super(Community, self).to_dict()
        dict_.update({
            'population': self.population,
        })
        return dict_

    def is_valid(self):
        return False

    # TODO: order communities from the database
    # def closest_communities(self, max=3, radius=Distance(km=25)):
    #     center = self.geometry.centroid
    #     unordered = Community.objects.filter(
    #                     polys__distance_lte=(center, radius))
    #     closest = sorted(unordered, key=lambda c: c.geometry.distance(center))
    #     return closest[1:(max + 1)]
