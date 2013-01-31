# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib.gis.db import models
from django.utils.translation import ugettext as _
from django.core.urlresolvers import reverse

from main.models import CommonObject
from main.utils import build_obj_from_dict
from komoo_map.models import POLYGON, LINESTRING, POINT

ISSUE_TYPES = (
    ('need', _('Need')),
    ('problem', _('Problem')),
    ('challenge', _('Challenge')),
    ('violation', _('Violation')),
    ('others', _('Others')),
)


class Issue(CommonObject):
    common_object_type = 'issue'

    issue_type = models.CharField(max_length=100, null=True, blank=True,
                                    choices=ISSUE_TYPES, default='others')

    class Map:
        title = _('Need')
        editable = True
        background_color = '#f42c5e'
        border_color = '#d31e52'
        geometries = (POLYGON, LINESTRING, POINT)
        categories = []

    @property
    def url(self):
        return reverse('issue_view', kwargs={'id_': self.id})

    # ================== utils =============================
    def from_dict(self, data):
        super(Issue, self).from_dict(data)
        keys = ['issue_type', ]
        build_obj_from_dict(self, data, keys)

    def to_dict(self):
        dict_ = super(Issue, self).to_dict()
        dict_.update({
            'issue_type': self.issue_type,
        })
        return dict_

    def is_valid(self):
        return super(Issue, self).is_valid()
