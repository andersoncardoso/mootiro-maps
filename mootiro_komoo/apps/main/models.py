# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from lib.taggit.managers import TaggableManager

from authentication.models import User
from komoo_map.models import GeoRefModel

from .utils import datetime_to_iso


class CreationDataMixin(models.Model):
    """Mixin for creation/editing metadata"""
    # creation/editing info
    creator = models.ForeignKey(User, editable=False, null=True,
                            related_name='created_%(class)s')
    creation_date = models.DateTimeField(auto_now_add=True)
    last_editor = models.ForeignKey(User, editable=False, null=True,
                            blank=True, related_name='last_editor_of_%(class)s')
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


class TagsMixin(models.Model):
    tags = TaggableManager()

    class Meta:
        abstract = True


class CommonDataMixin(CreationDataMixin, TagsMixin):
    name = models.CharField(max_length=256, blank=False)
    description = models.TextField(null=True, blank=True)

    def __unicode__(self):
        return unicode("[{}] - {}".format(self.type, self.name))

    class Meta:
        abstract = True


class CommonObject(GeoRefModel, CreationDataMixin, TagsMixin):
    """Common Base Object model"""
    type = models.CharField(max_length=512, db_index=True)

    def to_dict(self):
        data = super(CommonObject, self).to_dict()
        data.update({
            'type': self.type,
        })
        return data

    def save(self, *args, **kwargs):
        if self.common_object__type:
            self.type = self.common_object__type
        super(CommonObject, self).save(*args, **kwargs)





