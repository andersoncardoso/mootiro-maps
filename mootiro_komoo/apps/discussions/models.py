# -*- coding: utf-8 -*-
from __future__ import unicode_literals  # unicode by default
from django.db import models

from authentication.models import User
from main.models import BaseModel


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

    def set_object(self, obj):
        self.object_table = obj.table_ref
        self.object_id = obj.id

    @classmethod
    def get_discussion_for(cls, obj):
        return cls.objects.filter(
                object_table=obj.table_ref, object_id=obj.id)

    @classmethod
    def discussion_count_for(cls, obj):
        return cls.objects \
                    .filter(object_table=obj.table_red, object_id=obj.id) \
                    .count()

