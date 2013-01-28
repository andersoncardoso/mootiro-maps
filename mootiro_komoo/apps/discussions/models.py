# -*- coding: utf-8 -*-
from __future__ import unicode_literals  # unicode by default
from django.db import models

from authentication.models import User
from main.models import BaseModel
from main.utils import get_model_from_table_ref


class Comment(BaseModel):
    """
    Simple Threaded discussion model for any object
    """
    author = models.ForeignKey(User, blank=True, null=True)
    comment = models.CharField(max_length=1024)
    parent = models.ForeignKey('Comment', null=True, blank=True,
                related_name="comment_parent")
    # sub_comments = models.IntegerField(blank=True, default=0)
    creation_date = models.DateTimeField(auto_now_add=True)

    object_table = models.CharField(max_length=100)
    object_id = models.IntegerField()

    def _set_object(self, obj):
        self.object_table = obj.table_ref
        self.object_id = obj.id

    def _get_object(self):
        model = get_model_from_table_ref(self.object_table)
        obj = model.get_by_id(self.object_id)
        return obj

    object = property(_get_object, _set_object)

    class Meta:
        ordering = ['creation_date']

    @classmethod
    def get_discussion_for(cls, obj):
        return cls.objects.filter(
                object_table=obj.table_ref, object_id=obj.id)

    @classmethod
    def discussion_count_for(cls, obj):
        return cls.objects \
                    .filter(object_table=obj.table_red, object_id=obj.id) \
                    .count()

    @classmethod
    def nested_discussion_for_object(self, obj, parent=None):
        root_nodes = Comment.objects.filter(
                parent=parent, object_table=obj.table_ref, object_id=obj.id)
        discussion = []
        for root in root_nodes:
            dict_ = root.to_dict()
            dict_['nested_comments'] = self.nested_discussion_for_object(
                    obj, parent=root)
            discussion.append(dict_)
        return discussion

    def to_dict(self):
        return {
            key: getattr(self, key, None) for key in
                ['id', 'author', 'comment', 'parent_id', 'creation_date',
                 'object_table', 'object_id']
        }
