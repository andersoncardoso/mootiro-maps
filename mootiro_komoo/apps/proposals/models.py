#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals  # unicode by default
from django.db import models
from django.core.urlresolvers import reverse

from main.models import CommonObject
from main.utils import build_obj_from_dict


class Proposal(CommonObject):
    """A proposed solution """
    common_object_type = 'proposal'

    cost = models.DecimalField(null=True, blank=True, decimal_places=2,
                               max_digits=14)
    report = models.TextField(null=True, blank=True)

    @property
    def url(self):
        return reverse('proposal_view', kwargs={'id_': self.id})

    # ================== utils ============================
    def from_dict(self, data):
        keys = ['cost', 'report']
        build_obj_from_dict(self, data, keys)
        super(Proposal, self).from_dict(data)

    def to_dict(self):
        data = super(Proposal, self).to_dict()
        data.update({
            'cost': self.cost,
            'report': self.report
        })
        return data

    def is_valid(self):
        self.errors = {}
        validates = super(Proposal, self).is_valid()
        # if self.cost:
        #     # decimal_places = 2
        #     # max_digits = 14
        #     validates = False
        #     self.errors['cost'] = _('')
        return validates


