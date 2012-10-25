# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models

from authentication.models import User
from komoo_map.models import GeoRefModel

from .utils import datetime_to_iso


class CreationDataMixin(models.Model):
    """Mixin for creation/editing metadata"""
    # creation/editing info
    creator = models.ForeignKey(User, editable=False, null=True,
                            related_name='created_objects')
    creation_date = models.DateTimeField(auto_now_add=True)
    last_editor = models.ForeignKey(User, editable=False, null=True,
                            blank=True, related_name='last_editor_of')
    last_update = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    def to_dict(self):
        return {
            'creator': self.creator.id if self.creator else None,
            'creation_date': datetime_to_iso(self.creation_date),
            'last_editor': self.last_editor.id if self.last_editor else None,
            'last_update': datetime_to_iso(self.last_update),
        }


class BaseObject(GeoRefModel):
    """Common Base Object model"""
    type = models.CharField(max_length=512, db_index=True)

    def set_type(self, _class):
        super(_class, self).__init__()
        self.type = _class.__name__.lower()


    def to_dict(self):
        return {
            'type': self.type,
        }



