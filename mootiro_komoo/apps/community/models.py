#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib.gis.db import models
from django.contrib.gis.measure import Distance
from django.core.urlresolvers import reverse

from django.utils.translation import ugettext as _

import reversion
from lib.taggit.managers import TaggableManager
from komoo_map.models import POLYGON
from main.models import BaseObject


class Community(BaseObject):
    baseobject__type = 'community'

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

    image = "img/community.png"
    image_off = "img/community-off.png"

    # TODO: order communities from the database
    def closest_communities(self, max=3, radius=Distance(km=25)):
        center = self.geometry.centroid
        unordered = Community.objects.filter(
                        polys__distance_lte=(center, radius))
        closest = sorted(unordered, key=lambda c: c.geometry.distance(center))
        return closest[1:(max + 1)]

    # url aliases
    @property
    def view_url(self):
        return reverse('view_community', kwargs={'id': self.id})

    @property
    def edit_url(self):
        return reverse('edit_community', kwargs={'id': self.id})

    @property
    def admin_url(self):
        return reverse('admin:{}_{}_change'.format(self._meta.app_label,
            self._meta.module_name), args=[self.id])

    @property
    def perm_id(self):
        return 'c%d' % self.id


if not reversion.is_registered(Community):
    reversion.register(Community)
