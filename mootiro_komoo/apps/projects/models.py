# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.core.urlresolvers import reverse
from jsonfield import JSONField

from main.models import BaseModel
from main.models import CommonDataMixin
from main.utils import get_model_from_table_ref
from authentication.models import User


class ProjectRelatedObject(models.Model):
    project = models.ForeignKey('Project')

    object_table = models.CharField(max_length=100)
    object_id = models.IntegerField()

    def _set_object(self, obj):
        self.object_id = obj.id
        self.object_table = obj.table_ref

    def _get_object(self):
        model = get_model_from_table_ref(self.object_table)
        obj = model.get_by_id(self.object_id)
        return obj

    object = property(_get_object, _set_object)

    @classmethod
    def get_for_project(cls, project):
        return cls.objects.filter(project=project)


class Project(BaseModel, CommonDataMixin):

    contributors = models.ManyToManyField(User, null=True, blank=True,
            related_name='project_contributors')
    contact = JSONField(null=True, blank=True)
    public = models.BooleanField(default=True)
    public_discussion = models.BooleanField(default=True)

    # logo = models.ForeignKey(UploadedFile, null=True, blank=True)

    # def partners_logo(self):
    #     """ pseudo-reverse query for retrieving the partners logo"""
     #     return UploadedFile.get_files_for(self)

    # def user_can_edit(self, user):
    #     return self.public or \
    #            user == self.creator or \
    #            user in self.contributors.all()

    # def user_can_discuss(self, user):
    #     return self.public_discussion or \
    #            user == self.creator or \
    #            user in self.contributors.all()

    @property
    def url(self):
        return reverse('project_view', kwargs={'id_': self.id})

    @property
    def related_objects(self):
        """Returns a queryset for the objects for a given project"""
        return ProjectRelatedObject.get_for_project(self)

    def save_related_object(self, related_object):
        pass


