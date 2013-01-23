# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.utils.translation import ugettext as _
from django.core.urlresolvers import reverse
from django.db import models

from main.models import CommonObject
from main.utils import build_obj_from_dict
from komoo_map.models import POLYGON, LINESTRING, POINT


RESOURCE_TYPE = (
    ('computer', _('Computer Lab')),
    ('park', _('Park')),
    ('sports', _('Sports Club')),
    ('social', _('Social Service')),
    ('equipment', _('Equipment')),
    ('others', _('Others')),
)


class Resource(CommonObject):
    """
    Resources

    Inherits from CommonObject (common_object_type=resource)
    Extra Data:
        resource_type: which kind of resource it represents. Default: others
    """
    common_object_type = 'resource'

    resource_type = models.CharField(max_length=100, null=True, blank=True,
                                     choices=RESOURCE_TYPE, default='others')

    class Map:
        title = _('Resource')
        editable = True
        background_color = '#28CB05'
        border_color = '#1D9104'
        geometries = (POLYGON, LINESTRING, POINT)
        zindex = 15

    @property
    def url(self):
        return reverse('resource_view', kwargs={'id_': self.id})

    # ================== utils =============================
    def from_dict(self, data):
        super(Resource, self).from_dict(data)
        keys = ['resource_type', ]
        build_obj_from_dict(self, data, keys)

    def to_dict(self):
        dict_ = super(Resource, self).to_dict()
        dict_.update({
            'resource_type': self.resource_type,
        })
        return dict_

    def is_valid(self):
        return super(Resource, self).is_valid()


