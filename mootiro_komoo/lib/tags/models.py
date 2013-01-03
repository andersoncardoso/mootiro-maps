# -*- coding: utf-8 -*-
from django.db import models


class Tag(models.Model):
    name = models.CharField(max_length=1024)

    @classmethod
    def add(cls, tag):
        obj, created = cls.objects.get_or_create(name=tag)
        return obj


class TaggedObject(models.Model):
    tag = models.ForeignKey(Tag)
    object_id = models.IntegerField()
    object_table = models.CharField(max_length=512)

    @classmethod
    def get_tags_for_object(cls, obj):
        return [
            tagged_obj.tag for tagged_obj in TaggedObject.objects.filter(
                object_id=getattr(obj, 'id', None),
                object_table='{}.{}'.format(obj._meta.app_label,
                    obj.__class__.__name__)
        )]

    @classmethod
    def add_tag_to_object(cls, tag, obj):
        obj, created = TaggedObject.objects.get_or_create(
            object_id=getattr(obj, 'id', None),
            object_table='{}.{}'.format(obj._meta.app_label,
                obj.__class__.__name__),
            tag=tag)


class TagsMixin(object):
    """ Provides easy tags access to any model """

    def _get_tags(self):
        return [tag.name
                for tag in TaggedObject.get_tags_for_object(self)]

    def _set_tags(self, new_tags):
        # del old tags
        self._del_tags()

        # create new tags
        for tag in new_tags:
            tag_obj = self.add_tag(tag)

    def _del_tags(self):
        tags = [
            tagged_obj for tagged_obj in TaggedObject.objects.filter(
                object_id=getattr(self, 'id', None),
                object_table='{}.{}'.format(self._meta.app_label,
                    self.__class__.__name__)
        )]
        for tag in tags:
            tag.delete()

    tags = property(_get_tags, _set_tags, _del_tags, 'tags manager')

    def add_tag(self, tag):
        tag_obj = Tag.add(tag)
        TaggedObject.add_tag_to_object(tag_obj, self)
        return tag_obj
