#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals  # unicode by default
from django.db import models
from django.core.urlresolvers import reverse
from django.contrib.contenttypes import generic

import reversion

from main.models import CommonObject, CommonDataMixin
from authentication.models import User
from need.models import Need
from investment.models import Investment


class Proposal(CommonDataMixin):
    """A proposed solution for solving a need"""
    type = 'proposal'

    # Relationships
    need = models.ForeignKey(CommonObject, related_name='proposals')

    # TODO: Also: organizations = model.ManyToManyField(Organization)
    cost = models.DecimalField(decimal_places=2, max_digits=14, null=True,
                               blank=True)
    report = models.TextField(null=True, blank=True)

    investments = generic.GenericRelation(Investment,
                        content_type_field='grantee_content_type',
                        object_id_field='grantee_object_id')

    @property
    def community(self):
        return self.need.community

    @property
    def geometry(self):
        return self.need.geometry

    # Url aliases
    @property
    def home_url_params(self):
        return dict(id=self.id)

    @property
    def view_url(self):
        return reverse('view_proposal', kwargs=self.home_url_params)

    @property
    def edit_url(self):
        return reverse('edit_proposal', kwargs=self.home_url_params)

    @property
    def admin_url(self):
        return reverse('admin:{}_{}_change'.format(self._meta.app_label,
            self._meta.module_name), args=[self.id])

    @property
    def new_investment_url(self):
        return reverse('new_investment') + '?type=proposal&obj={id}'.format(
                id=self.id)

    @property
    def perm_id(self):
        return 'p%d' % self.id

    @property
    def title(self):
        return self.name

if not reversion.is_registered(Need):
    reversion.register(Proposal)
