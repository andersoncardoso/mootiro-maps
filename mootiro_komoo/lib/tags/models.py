# -*- coding: utf-8 -*-
from django.db import models


class Tag(models.Model):
    name = models.CharField(max_length=1024)


class TaggedObject(models.Model):
    tag = models.ForeignKey(Tag)
    object_id = models.IntegerField()
    object_table = models.CharField(max_length=512)

    def get_tags_for_object(self):
        return TaggedObject.objects.filter(
            object_id=self.id,
            object_table='{}.{}'.format(self._meta.app_label,
                self.__class__.__name__)
        )


class TagsField(object):

    def __get__(self, obj, objtype):
        tag_list = []
        for tag in TaggedObject.get_tags_for_object(self):
            tag_list.append(tag.name)
        return tag_list


    def __set__(self, obj, val):
        pass

    def add(self, tag):
        if isinstance(tag, basestring):
            pass
        elif isinstance(tag, Tag):
            pass


