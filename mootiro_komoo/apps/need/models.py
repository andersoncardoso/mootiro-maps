#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals  # unicode by default

from django.contrib.gis.db import models
from django.utils.translation import ugettext as _
from django.core.urlresolvers import reverse
from django.template.defaultfilters import slugify
import reversion
from lib.taggit.managers import TaggableManager

from main.models import CommonObject, CommonDataMixin
from authentication.models import User
from community.models import Community
from komoo_map.models import GeoRefModel, POLYGON, LINESTRING, POINT


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

    @classmethod
    def get_image(cls, name):
        return "img/need_categories/%s.png" % slugify(name)

    @classmethod
    def get_image_off(cls, name):
        return "img/need_categories/%s-off.png" % slugify(name)

    @property
    def image(self):
        return self.get_image(self.name)

    @property
    def image_off(self):
        return self.get_image_off(self.name)


class TargetAudience(models.Model):
    name = models.CharField(max_length=64, unique=True, blank=False)

    def __unicode__(self):
        return self.name


class Need(CommonObject, CommonDataMixin):
    """A need of a Community"""
    common_object__type = 'need'

    # Relationships
    community = models.ManyToManyField(CommonObject, related_name="needs",
                    null=True, blank=True)
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

    image = "img/need.png"
    image_off = "img/need-off.png"

    # Url aliases
    @property
    def home_url_params(self):
        return {'id': self.id}

    @property
    def view_url(self):
        return reverse('view_need', kwargs=self.home_url_params)

    @property
    def edit_url(self):
        return reverse('edit_need', kwargs=self.home_url_params)

    @property
    def admin_url(self):
        return reverse('admin:{}_{}_change'.format(self._meta.app_label,
            self._meta.module_name), args=[self.id])

    @property
    def perm_id(self):
        return 'n%d' % self.id

    @property
    def title(self):
        return self.name


if not reversion.is_registered(Need):
    reversion.register(Need)
