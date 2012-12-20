#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals  # unicode by default

from django.contrib.gis.db import models
from django.utils.translation import ugettext as _
from django.template.defaultfilters import slugify

from main.models import CommonDataMixin, CommonObject, TargetAudience
from komoo_map.models import POLYGON, LINESTRING, POINT


class NeedCategory(models.Model):
    name = models.CharField(max_length=64, blank=False)

    # Adding categories to be translated.
    # Probably there is a better way to do this.
    categories = [
        _('Culture'),
        _('Education'),
        _('Environment'),
        _('Health'),
        _('Housing'),
        _('Local Economy'),
        _('Mobility'),
        _('Social Service'),
        _('Sport'),
        _('Security'),
    ]

    def __unicode__(self):
        return unicode(self.name)

    @property
    def image(self):
        return "img/need_categories/%s.png" % slugify(self.name)

    @property
    def image_off(self):
        return "img/need_categories/%s-off.png" % slugify(self.name)


class Need(CommonObject, CommonDataMixin):
    common_object_type = 'need'

    categories = models.ManyToManyField(NeedCategory)
    target_audiences = models.ManyToManyField(TargetAudience, blank=False)

    class Map:
        title = _('Need')
        editable = True
        background_color = '#f42c5e'
        border_color = '#d31e52'
        geometries = (POLYGON, LINESTRING, POINT)
        categories = [
            ('Culture'),
            ('Education'),
            ('Environment'),
            ('Health'),
            ('Housing'),
            ('Local Economy'),
            ('Mobility'),
            ('Social Service'),
            ('Sport'),
            ('Security'),
        ]
        form_view_name = 'new_need_from_map'
        form_view_kwargs = {}

    @property
    def url(self):
        return '/needs/%s' % self.id


