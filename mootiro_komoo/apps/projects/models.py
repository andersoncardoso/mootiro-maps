# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from jsonfield import JSONField

from main.models import CommonDataMixin
from authentication.models import User


# OBS: relations should take care of this now
# class ProjectRelatedObject(models.Model):
#     project = models.ForeignKey('Project')
#
#     # dynamic ref


class Project(CommonDataMixin):

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
        return '/projects/%s' % self.id

    @property
    def related_objects(self):
        """Returns a queryset for the objects for a given project"""
        pass

    def save_related_object(self, related_object):
        pass


