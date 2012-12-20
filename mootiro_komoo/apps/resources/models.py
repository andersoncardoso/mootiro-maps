# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from django.utils.translation import ugettext as _

from main.models import CommonObject, CommonDataMixin
from jsonfield import JSONField
from komoo_map.models import POLYGON, LINESTRING, POINT


# class ResourceKind(models.Model):
#     """Kind of Resources"""
#     name = models.CharField(max_length=128)
#
#     def __unicode__(self):
#         return self.name
#
#     @classmethod
#     def favorites(cls, number=10):
#         return ResourceKind.objects.all(
#             ).exclude(name='').annotate(count=models.Count('resource__id')
#             ).order_by('-count', 'slug')[:number]


class Resource(CommonObject, CommonDataMixin):
    common_object_type = 'resource'

    # kind still makes sense? new global 'area' tags?
    # kind = models.ForeignKey(ResourceKind, null=True, blank=True)

    contact = JSONField(null=True, blank=True)

    class Map:
        title = _('Resource')
        editable = True
        background_color = '#28CB05'
        border_color = '#1D9104'
        geometries = (POLYGON, LINESTRING, POINT)
        form_view_name = 'new_resource_from_map'
        zindex = 15

    @property
    def url(self):
        return '/resource/%s' % self.id

    # ================== utils =============================
    def from_dict(self):
        pass

    def to_dict(self):
        dict_ = super(Resource, self).to_dict()
        dict_.update({
            'contact': self.contact or {},
        })
        return dict_

    def is_valid(self):
        return False


