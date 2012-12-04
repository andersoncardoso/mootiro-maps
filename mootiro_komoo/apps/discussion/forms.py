#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals  # unicode by default

from django import forms
from django.utils.translation import ugettext_lazy as _
from markitup.widgets import MarkItUpWidget
from fileupload.forms import FileuploadField
from fileupload.models import UploadedFile

from main.widgets import TaggitWidget
from .models import Discussion
from signatures.signals import notify_on_update


class DiscussionForm(forms.ModelForm):
    class Meta:
        model = Discussion
        fields = ('text',)

    _field_labels = {
        'text': _('Text'),
    }

    text = forms.CharField(widget=MarkItUpWidget(), required=True)

