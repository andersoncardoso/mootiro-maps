# -*- coding: utf-8 -*-
from django.db import models
from django.contrib.gis.measure import Distance
from django.utils.translation import ugettext as _
from bson.objectid import ObjectId
from jsonfield import JSONField

from komoo_map.models import POLYGON
from main.models import RelationsField
from authentication.models import User
from komoo_map.models import GeoRefModel
from tags.models import TagField, EMPTY_TAG
from search.signals import index_object_for_search
from fileupload.models import UploadedFile

from main.utils import build_obj_from_dict
from main.mixins import BaseModel

# =============================================================================
# Common Objects
#


class GeoRefObject(GeoRefModel, BaseModel):
    """
    Common objects base model.

    Fields:
        name: object identifier
        description: longer description of the object
        otype: object type (need, resource, etc)
        creator: user who created this content
        creation_date: datetime when the content was created
        last_editor: last user who edited this content
        last_update: datetime for the last edition
        extra_data: utility field which holds a json with extra data (used for
            object conversion. For example: when we change a Organization to a
            Resource, we want to preserve the organization specific data in
            this field)
        tags: tags array for the content (provided by TagsMixin)

    Methods:
        to_dict: return a dict representation for the common attributes

    """
    # bson.objectid.ObjectId
    id = models.CharField(primary_key=True, max_length=24)
    name = models.CharField(max_length=512)
    description = models.TextField()
    short_description = models.CharField(max_length=250, null=True, blank=True)
    otype = models.CharField(max_length=512)  # object type

    creator = models.ForeignKey(User, editable=False, null=True,
                        related_name='created_%(class)s')
    creation_date = models.DateTimeField(auto_now_add=True)
    last_editor = models.ForeignKey(User, editable=False, null=True,
                        blank=True, related_name='last_edited_%(class)s')
    last_update = models.DateTimeField(auto_now=True)

    contact = JSONField(null=True, blank=True)
    extra_data = JSONField(null=True, blank=True)

    tags = TagField()

    relations = RelationsField()

    def __unicode__(self):
        return unicode(self.name)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'otype': self.otype,
            'creator': self.creator,
            'creation_date': self.creation_date,
            'geometry': self.geojson,
            'last_editor': self.last_editor,
            'last_update': self.last_update,
            'tags': self.tags,
            'extra_data': self.extra_data,
            'contact': self.contact,
        }

    def postpone_attr(self, key, val):
        self._postponed = getattr(self, '_postponed', [])
        self._postponed.append((key, val))

    def from_dict(self, data, complete_object=False, *args, **kwargs):
        self._postponed = getattr(self, '_postponed', [])
        attrs = [
            'id', 'name', 'description', 'last_editor', 'creation_date',
            'last_update', 'extra_data', 'creator', 'otype', 'contact']
        update_attrs = [attr for attr in attrs[::] if not attr in
                ['id', 'creator', 'last_update', 'creation_date']]
        insert_attrs = [attr for attr in attrs[::] if not attr in
                ['id', 'last_editor', 'last_update', 'creation_date']]

        if complete_object:
            keys = attrs
        elif getattr(self, 'id', None):
            keys = update_attrs
        else:
            keys = insert_attrs
            if data.get('creation_date', None):
                self.postpone_attr('creation_date', data['creation_date'])

        [
            self.postpone_attr(attr, val) for attr, val in
                [('tags', data.get('tags', EMPTY_TAG)), ]
        ]

        date_keys = ['creation_date', 'last_update']
        build_obj_from_dict(self, data, keys, date_keys)

    def is_valid(self):
        self.errors = {}
        valid = True
        require = ['name', 'creator', 'otype']
        for field in require:
            if not getattr(self, field, None):
                valid, self.errors[field] = False, _('Required field')
        return valid

    def save(self, *args, **kwargs):
        if not getattr(self, 'id', None):
            self.id = str(ObjectId())
        r = super(GeoRefObject, self).save(*args, **kwargs)
        if self.id and hasattr(self, '_postponed'):
            for item in self._postponed:
                setattr(self, item[0], item[1])
        index_object_for_search.send(sender=self, obj=self)
        return r


class CommonObjectManager(models.Manager):

    def get_query_set(self):
        return super(CommonObjectManager, self).get_query_set().filter(
                otype=self.model.commonobject_type)


class CommonObjectMixin(GeoRefObject):

    class Meta:
        proxy = True

    url_root = ''
    commonobject_type = ''
    objects = CommonObjectManager()

    def __init__(self, *args, **kwargs):
        super(CommonObjectMixin, self).__init__(*args, **kwargs)
        if not getattr(self, 'otype', None) == self.commonobject_type:
            self.otype = self.commonobject_type

    @property
    def _url_root(self):
        if not self.url_root.endswith('/'):
            return self.url_root + '/'
        else:
            return self.url_root

    @property
    def url(self):
        return self.view_url

    @property
    def view_url(self):
        return self._url_root + self.id

    @property
    def edit_url(self):
        return self._url_root + self.id + '/edit'

    @property
    def list_url(self):
        return self._url_root

    # @property
    # def admin_url(self):
    #     return reverse('admin:{}_{}_change'.format(self._meta.app_label,
    #         self._meta.module_name), args=[self.id])

    def files_set(self):
        """ pseudo-reverse query for retrieving Resource Files"""
        return UploadedFile.get_files_for(self)

    def save(self, *args, **kwargs):
        if not getattr(self, 'otype', None) == self.commonobject_type:
            self.otype = self.commonobject_type

        r_ = super(CommonObjectMixin, self).save(*args, **kwargs)
        return r_

    @classmethod
    def _table_ref(cls):
        return '{}.{}'.format(cls._meta.app_label, GeoRefObject.__name__)


# =============================================================================
# Common Object Accessors


class Community(CommonObjectMixin):

    url_root = '/community/'
    commonobject_type = 'community'

    class Meta:
        proxy = True

    class Map:
        title = _('Community')
        editable = True
        background_color = '#ffc166'
        border_color = '#ff2e2e'
        geometries = (POLYGON, )
        min_zoom_geometry = 10
        max_zoom_geometry = 100
        min_zoom_point = 0
        max_zoom_point = 0
        min_zoom_icon = 0
        max_zoom_icon = 0
        zindex = 5

    # THIS IS USED ANYWHERE?
    # TODO: order communities from the database
    def closest_communities(self, max=3, radius=Distance(km=25)):
        center = self.geometry.centroid
        unordered = Community.objects.filter(
                        polys__distance_lte=(center, radius))
        closest = sorted(unordered, key=lambda c: c.geometry.distance(center))
        return closest[1:(max + 1)]
