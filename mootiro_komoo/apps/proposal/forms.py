# #!/usr/bin/env python
# # -*- coding: utf-8 -*-
# from __future__ import unicode_literals  # unicode by default
# 
# from django import forms
# from django.forms import CharField, HiddenInput
# from django.utils.translation import ugettext_lazy as _
# from annoying.decorators import autostrip
# from markitup.widgets import MarkItUpWidget
# 
# from main.utils import clean_autocomplete_field
# from proposal.models import Proposal
# from need.models import Need
# from signatures.signals import notify_on_update
# 
# 
# @autostrip
# class ProposalForm(forms.ModelForm):
#     description = CharField(widget=MarkItUpWidget())
#     need = CharField(widget=HiddenInput())
# 
#     class Meta:
#         model = Proposal
#         fields = ('title', 'description', 'cost', 'need')
# 
#     _field_labels = {
#         'title': _('Title'),
#         'description': _('Description'),
#         'cost': _('Cost'),
#         'need': ' '
#     }
# 
#     @notify_on_update
#     def save(self, *a, **kw):
#         return super(ProposalForm, self).save(*a, **kw)
# 
#     def clean_need(self):
#         return clean_autocomplete_field(
#             self.cleaned_data['need'], Need)
