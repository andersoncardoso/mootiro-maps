# -*- coding: utf-8 -*-
from django.db import models
from tags.models import TagField


class TestTaggedClass(models.Model):
    tags = TagField()
