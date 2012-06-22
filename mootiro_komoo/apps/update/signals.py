#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Callback signals that creates new updates (instances of Update class) as users
interacts with the system.

ATTENTION!
Django does not recognize signals.py so this module
must be explicit imported in __init__.py
"""

from __future__ import unicode_literals  # unicode by default

from django.db.models.signals import post_save
from django.dispatch import Signal, receiver

from .models import Update
from community.models import Community
from need.models import Need
from proposal.models import Proposal
from organization.models import Organization
from komoo_resource.models import Resource
from investment.models import Investment
from komoo_comments.models import Comment


create_update = Signal(providing_args=["instance", "type"])


# Community, Need, Organization, Resource
@receiver(create_update, sender=Community)
@receiver(create_update, sender=Need)
@receiver(create_update, sender=Organization)
@receiver(create_update, sender=Resource)
def create_add_edit_update(sender, **kwargs):
    instance = kwargs["instance"]
    data = {
        'title': instance.name,
        'link': instance.view_url,
        'object_type': instance._meta.verbose_name,
        'type': kwargs["type"],
        'users': [instance.creator.username],
    }
    if getattr(instance, 'community', None):
        data['communities'] = instance.community.all()
    
    update = Update(**data)
    update.save()


@receiver(create_update, sender=Comment)
def create_discussion_update(sender, **kwargs):
    comment = kwargs["instance"]
    instance = comment.content_object
    data = {
        'title': instance.name,
        'link': instance.view_url,
        'object_type': instance._meta.verbose_name,
        'type': Update.DISCUSSION,
        'users': [comment.author.username],  # TODO: agreggate discussions
    }
    if getattr(instance, 'community', None):
        data['communities'] = instance.community.all()

    update = Update(**data)
    update.save()
