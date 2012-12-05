# #!/usr/bin/env python
# # -*- coding: utf-8 -*-
# from __future__ import unicode_literals  # unicode by default
# 
# from django import forms
# from django.utils.translation import ugettext_lazy as _
# from markitup.widgets import MarkItUpWidget
# from fileupload.forms import FileuploadField
# from fileupload.models import UploadedFile
# 
# from main.widgets import Tagsinput, TaggitWidget, ImageSwitchMultiple
# from need.models import Need, NeedCategory, TargetAudience
# from signatures.signals import notify_on_update
# 
# 
# need_form_fields = ('id', 'title', 'description', 'community', 'categories',
#                     'target_audiences', 'tags', 'files')
# 
# need_form_field_labels = {
#     'community': _('Community'),
#     'title': _('Title'),
#     'description': _('Description'),
#     'categories': _('Need Categories'),
#     'target_audiences': _('Target audiences'),
#     'tags': _('Tags'),
#     'files': _('Images'),
# }
# 
# 
# class NeedForm(forms.ModelForm):
#     class Meta:
#         model = Need
#         fields = need_form_fields
# 
#     _field_labels = need_form_field_labels
# 
#     class Media:
#         js = ('lib/jquery.imagetick-original.js',)
# 
#     description = forms.CharField(widget=MarkItUpWidget())
# 
#     categories = forms.ModelMultipleChoiceField(
#         queryset=NeedCategory.objects.all().order_by('name'),
#         widget=ImageSwitchMultiple(
#             get_image_tick=NeedCategory.get_image,
#             get_image_no_tick=NeedCategory.get_image_off
#         )
#     )
# 
#     target_audiences = forms.Field(
#         widget=Tagsinput(
#             TargetAudience,
#             autocomplete_url="/need/target_audience_search")
#     )
# 
#     tags = forms.Field(
#         widget=TaggitWidget(autocomplete_url="/need/tag_search"),
#         required=False
#     )
# 
#     files = FileuploadField(required=False)
# 
# 
#     @notify_on_update
#     def save(self, *args, **kwargs):
#         need = super(NeedForm, self).save(*args, **kwargs)
#         UploadedFile.bind_files(
#             self.cleaned_data.get('files', '').split('|'), need)
#         return need
# 
# 
# class NeedFormGeoRef(NeedForm):
#     class Meta:
#         model = Need
#         fields = need_form_fields + ('geometry',)
# 
#     _field_labels = need_form_field_labels
# 
#     geometry = forms.CharField(widget=forms.HiddenInput())
