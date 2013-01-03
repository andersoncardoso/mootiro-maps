# -*- coding: utf-8 -*-
from django.db import models
from jsonfield import JSONField

from komoo_map.models import GeoRefModel
from authentication.models import User
from tags.models import TagField

from .utils import BaseDAOMixin


class CommonDataMixin(models.Model):
    """
    Abstract model for common attributes and behavior.

    Fields:
        name: object identifier
        description: longer description of the object
        creator: user who created this content
        creation_date: datetime when the content was created
        last_editor: last user who edited this content
        last_update: datetime for the last edition
        extra_data: utility field which holds a json with extra data (used for
            object conversion. For example: when we change a Organization to a
            Resource, we want to preserve the organization specific data in
            this field)
        tags: tags array for the content (provided by TagsMixin)

    Methods:
        to_dict: return a dict representation for the common attributes
    """
    name = models.CharField(max_length=512)
    description = models.TextField()

    creator = models.ForeignKey(User, editable=False, null=True,
                        related_name='created_%(class)s')
    creation_date = models.DateTimeField(auto_now_add=True)
    last_editor = models.ForeignKey(User, editable=False, null=True,
                        blank=True, related_name='last_edited_%(class)s')
    last_update = models.DateTimeField(auto_now=True)

    extra_data = JSONField(null=True, blank=True)

    tags = TagField()

    def __unicode__(self):
        return unicode(self.name)

    class Meta:
        abstract = True

    def to_dict(self):
        return {
            'name': self.name,
            'description': self.description,
            'creator': self.creator,
            'creation_date': self.creation_date,
            'last_editor': self.last_editor,
            'last_update': self.last_update,
            'tags': self.tags,
        }


class CommonObject(GeoRefModel, BaseDAOMixin):
    """
    Common objects base model.

    All mapped objects inherit from this object so they can be
    inter-changeable. This model holds the 'true PK' for a mapped
    object and all references to them should be made through the
    CommonObject's id.

    It's important to set a `common_object_type` attribute to the class which
    inherits from this. Example:
        class MyClass(CommonObject, CommonDataMixin):
            common_object_type = 'myclass'
            # ...
            # MyClass attributes and methods

    OBS: This Model is not abstract which means we have a implicit relation
         betwen the child class and this class.
    """
    co_type = models.CharField(max_length=256)

    def to_dict(self):
        d = super(CommonObject, self).to_dict()
        d['id'] = self.id
        return d

    def from_dict(self, data):
        # TODO: implement-me
        return None

    def __init__(self, *args, **kwargs):
        super(CommonObject, self).__init__(*args, **kwargs)
        if hasattr(self, 'common_object_type') and self.common_object_type:
            self.co_type = self.common_object_type


class TargetAudience(models.Model):
    """
    Target Audience for different type of contents
    Works like a 'specific type of tag'.
    """
    name = models.CharField(max_length=64, unique=True, blank=False)

    def __unicode__(self):
        return self.name


# class RelationType(models.Model):
#     """ Relation Types """
#     name = models.CharField(max_length=512)
#
#     @property
#     def name(self):
#         if settings.code == 'en-us':
#             return unicode(self.name)
#         else:
#             rel_trans = RelationTypeTranslations.objects.get(
#                     relation_type=self, language_code=settings.code)
#             return unicode(rel_trans.name)
#
#
# class RelationTypeTranslations(models.Model):
#     """ Translations for RelationTypes"""
#     name = models.CharField(max_length=512)
#     language_code = models.CharField(max_length=128)
#     relation_type = models.ForeignKey(RelationType)
#
#     def __unicode__(self):
#         return unicode(self.name)


class GenericRelations(models.Model):
    """ Relations For Common Objects"""
    # TODO: improve this
    obj1_id = models.IntegerField(max_length=512)
    obj1_table = models.CharField(max_length=512)

    obj2_id = models.IntegerField(max_length=512)
    obj2_table = models.CharField(max_length=512)

