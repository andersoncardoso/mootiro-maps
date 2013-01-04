# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import simplejson

from django.db import models
from jsonfield import JSONField

from tags.models import TagField

from .utils import to_json, build_obj_from_dict


class BaseDAOMixin(object):
    """ Common Basic Queries for abstracting the ORM """

    @classmethod
    def get_by_id(cls, id):
        """ Get entry by ID or return None """
        try:
            obj = cls.objects.get(pk=id)
        except Exception:
            obj = None
        return obj

    @classmethod
    def filter_by(cls, **kwargs):
        """ filter by keyword arguments """
        return cls.objects.filter(**kwargs)

    # utility json methods
    def to_json(self):
        if hasattr(self, 'to_dict'):
            return to_json(self.to_dict())
        else:
            raise Exception('No .to_dict() method defined')

    def from_json(self, data):
        if hasattr(self, 'from_dict'):
            self.from_dict(simplejson.loads(data))
        else:
            raise Exception('No .from_dict() method defined')


class PermissionMixin(object):
    """ Mixin to verifie if user have permission to do some actions """

    def can_edit(self, user):
        """ Default edit permissions """
        if not user or not user.is_authenticated():
            return False

        # superusers can edit everything
        if user.is_superuser():
            return True

        # otherwise only the user can edit itself
        if self.__class__.__name__ == 'User':
            # use .__class__.__name__ is ugly, but we don't want circular
            # dependencies
            return user == self

        # active users can edit every content
        return user.is_active

    def can_view_field(self, fieldname, user=None):
        """ Default view permissions """
        # Nobody can view internal fields
        if fieldname in getattr(self, 'internal_fields', []):
            return False

        if self.can_edit(user):
            return True

        return not fieldname in getattr(self, 'private_fields', [])

    def to_cleaned_dict(self, fields=['all'], user=None):
        return {key: val for key, val in self.to_dict().items()
                if (key in fields or 'all' in fields) and
                   self.can_view_field(key, user)}


# ugly fix for circular dependecy
# This MUST stay at the bottom of the script

