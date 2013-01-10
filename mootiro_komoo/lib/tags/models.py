# -*- coding: utf-8 -*-
from django.db import models


class Tag(models.Model):
    name = models.CharField(max_length=1024)
    namespace = models.CharField(max_length=128, default='tag')

    class Meta:
        unique_together = (("name", "namespace"),)

    @classmethod
    def add(cls, tag, namespace='tag'):
        obj, created = cls.objects.get_or_create(name=tag, namespace=namespace)
        return obj

    @classmethod
    def get_by_name(cls, tag_name, namespace='tag'):
        try:
            tag = Tag.objects.get(name=tag_name, namespace=namespace)
        except Exception:
            tag = None
        return tag


class TaggedObject(models.Model):
    tag = models.ForeignKey(Tag)
    object_id = models.IntegerField()
    object_table = models.CharField(max_length=512)

    @classmethod
    def get_tags_for_object(cls, obj, namespace='tag'):
        return [
            tagged_obj.tag for tagged_obj in TaggedObject.objects.filter(
                object_id=getattr(obj, 'id', None),
                object_table='{}.{}'.format(obj._meta.app_label,
                    obj.__class__.__name__),
                tag__namespace=namespace
        )]

    @classmethod
    def add_tag_to_object(cls, tag, obj):
        obj, created = TaggedObject.objects.get_or_create(
            object_id=getattr(obj, 'id', None),
            object_table='{}.{}'.format(obj._meta.app_label,
                obj.__class__.__name__),
            tag=tag)


class _TagList(list):
    """ utility extended list for tags in TagField descriptor"""
    def __init__(self, descriptor, instance):
        self.descriptor = descriptor
        self.instance = instance

    def add(self, tag):
        return self.descriptor.add_tag(self.instance, tag)

    def remove(self, tag):
        self.descriptor.remove_tag(self.instance, tag)


class TagField(object):
    """
    Tag-like behavior descriptor. It treats the TagField attribute like a
    list, but implictly makes all the necessary database queries.
    usage:
        class MyClass(models.Model):
            tags = TagField()

        obj = MyClass()
        obj.tags
        # returns []

        obj.tags = ['tag A', 'tag B']
        # creates and saves tags to object

        obj.tags
        # returns ['tag A', 'tag B']

        obj.tags.add('tag C')
        obj.tags.remove('tag A')
        obj.tags
        # returns ['tag B', 'tag C']
    """

    def __init__(self, namespace='tag'):
        self.namespace = namespace

    def __get__(self, instance, owner):
        tag_list = _TagList(self, instance)
        for tag in TaggedObject.get_tags_for_object(
                    instance, namespace=self.namespace):

            tag_list.append(tag.name)
        return tag_list

    def __set__(self, instance, new_tags):
        # del old tags
        self.__delete__(instance)

        # create new tags
        for tag in new_tags:
            self.add_tag(instance, tag)

    def __delete__(self, instance):
        tags = [
            tagged_obj for tagged_obj in TaggedObject.objects.filter(
                object_id=getattr(instance, 'id', None),
                object_table='{}.{}'.format(instance._meta.app_label,
                    instance.__class__.__name__),
                tag__namespace=self.namespace
        )]
        for tag in tags:
            tag.delete()

    def add_tag(self, instance, tag):
        tag_obj = Tag.add(tag, namespace=self.namespace)
        TaggedObject.add_tag_to_object(tag_obj, instance)
        return tag_obj

    def remove_tag(self, instance, tag):
        if isinstance(tag, basestring):
            tag = Tag.get_by_name(tag, namespace=self.namespace)
        elif not isinstance(tag, Tag):
            tag = None

        if tag and tag.namespace == self.namespace:
            TaggedObject.objects.filter(
                    object_id=getattr(instance, 'id', None),
                    object_table='{}.{}'.format(instance._meta.app_label,
                        instance.__class__.__name__),
                    tag=tag
            ).delete()

