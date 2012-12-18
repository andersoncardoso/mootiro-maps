# -*- coding: utf-8 -*-
from __future__ import unicode_literals

# from markdown import markdown
import requests
import simplejson
import dateutil
import datetime
from string import letters, digits
from random import choice
from celery.decorators import task

from django import forms
from django.conf import settings
from django.core.mail import send_mail as django_send_mail
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.db.models.query_utils import Q
from django.http import Http404, HttpResponseNotAllowed, HttpResponse
from django.shortcuts import get_object_or_404
from django.utils.translation import ugettext_lazy as _


def datetime_to_iso(datetime_obj):
    """ parses a python datetime object to a ISO-8601 string """
    if datetime_obj is None:
        return None
    return datetime_obj.isoformat()


def iso_to_datetime(iso_string):
    """ parses a ISO-8601 string into a python datetime object """
    if iso_string is None:
        return None
    return dateutil.parser.parse(iso_string)


def create_geojson(objects, type_='FeatureCollection', convert=True,
                   discard_empty=False):
    if type_ == 'FeatureCollection':
        geojson = {
            'type': 'FeatureCollection',
            'features': []
        }

        for obj in objects:
            type_ = obj.__class__.__name__
            if not hasattr(obj, 'geometry'):
                continue
            geometry_json = simplejson.loads(obj.geometry.geojson)
            geometries = geometry_json['geometries']
            geometry = None

            if geometries:
                if len(geometries) == 1:
                    geometry = geometries[0]
                else:
                    geometry = {}
                    geometry_type = geometries[0]['type']
                    geometry['type'] = 'Multi{}'.format(geometry_type)
                    coord = []
                    for geom in geometries:
                        if geom['type'] == geometry_type:
                            coord.append(geom['coordinates'])
                    geometry['coordinates'] = coord

            if discard_empty and not geometry:
                return {}

            name = getattr(obj, 'name', getattr(obj, 'title', ''))
            last_update = obj.last_update.isoformat(b' ') if hasattr(obj,
                    'last_update') else ''

            feature = {
                'type': 'Feature',
                'geometry': geometry,
                'properties': {
                    'type': type_,
                    'name': name,
                    'id': obj.id,
                    'lastUpdate': last_update
                }
            }
            if hasattr(obj, 'categories'):
                feature['properties']['categories'] = [
                        {'name': c.name, 'image': c.image}
                        for c in obj.categories.all()]
            if hasattr(obj, 'population'):
                feature['properties']['population'] = obj.population

            if type_ == 'OrganizationBranch':
                feature['properties']['organization_name'
                        ] = obj.organization.name
                feature['properties']['last_update'
                        ] = obj.organization.last_update.isoformat(b' ')

            geojson['features'].append(feature)

    if convert:
        return simplejson.dumps(geojson)

    return geojson


def paginated_query(query, request=None, page=None, size=None):
    """
    Do the boring/repetitive pagination routine.
    Expects a request with page and size attributes
    params:
        query: any queryset objects
        request:  a django HttpRequest (GET)
           page: page attr on request.GET (default: 1)
           size: size attr on request.GET (default: 10)
        size: size of each page
        page: number of the current page
    """
    page = page or request.GET.get('page', '')
    size = size or request.GET.get('size', 10)

    paginator = Paginator(query, size)
    try:
        _paginated_query = paginator.page(page)
    except PageNotAnInteger:  # If page is not an integer, deliver first page.
        _paginated_query = paginator.page(1)
    except EmptyPage:  # If page is out of range, deliver last page
        _paginated_query = paginator.page(paginator.num_pages)
    return _paginated_query


date_order_map = {
    'desc': '-',
    'asc': ''
}


def sorted_query(query_set, sort_fields, request, default_order='name'):
    """
    Used for handle listing sorters
    params:
        query_set: any query set object or manager
        request: the HttpRequest obejct
    """
    query_set = query_set.all()
    sort_order = {k: i for i, k in enumerate(sort_fields)}
    sorters = request.GET.get('sorters', '')
    if sorters:
        sorters = sorted(sorters.split(','), key=lambda val: sort_order[val])

    for i, sorter in enumerate(sorters[:]):
        if 'date' in sorter:
            date_order = request.GET.get(sorter, '-')
            sorters[i] = date_order_map[date_order] + sorter

    if sorters:
        return query_set.order_by(*sorters)
    else:
        return query_set.order_by(default_order)


def filtered_query(query_set, request):
    filters = request.GET.get('filters', '')
    for f in filters.split(','):
        if f == 'tags':
            request.encoding = 'latin-1'
            tags = request.GET.get('tags', '')

            if tags:
                tags = tags.split(',')
                for tag in tags:
                    query_set = query_set.filter(tags__name=tag)
        if f == 'community':
            community = request.GET.get('community', '')
            if community:
                query_set = query_set.filter(community=community)
        if f == 'need_categories':
            need_categories = request.GET.get('need_categories', '')
            if need_categories:
                need_categories = need_categories.split(',')
                for nc in need_categories:
                    query_set = query_set.filter(categories=nc)
        if f == 'target_audiences':
            request.encoding = 'latin-1'
            target_audiences = request.GET.get('target_audiences', '')
            if target_audiences:
                target_audiences = target_audiences.split(',')
                for ta in target_audiences:
                    query_set = query_set.filter(target_audiences__name=ta)

    return query_set


def templatetag_args_parser(*args):
    """
    Keyword-arguments like function parser. Designed to be used in templatetags
    Usage:
    def mytemplatetag(..., arg1='', arg2='', arg3=''):
      parsed_args = templatetag_args_parser(arg1, arg2, arg3)

      label = parsed_args.get('label', 'Default')
      use_border = parsed_args.get('use_border', False)
      zoom = parsed_args.get('zoom', 16)

    And in the template...
      {% mytemplatetag 'zoom=12' 'label=Your name' %}

    """
    parsed_args = {}
    for arg in args:
        if arg:
            a = arg.split('=')
            parsed_args[a[0]] = a[1]
    return parsed_args


def clean_autocomplete_field(field_data, model):
    try:
        if not field_data or field_data == 'None':
            return model()
        else:
            return model.objects.get(pk=field_data)
    except:
        raise forms.ValidationError(_('invalid field data'))


# def render_markup(text):
#     return markdown(text, safe_mode=True) if text else ''


def send_mail(title='', message='', sender='', receivers=[]):
    '''
    function for sending mails. If we are on debug (development) se will be
    sent by django mailer else will use the mailgun api.
    mailer.
    '''
    if settings.DEBUG:
        django_send_mail(title, message, sender, receivers,
                            fail_silently=False)
    else:
        requests.post(
            settings.MAILGUN_API_URL,
            auth=('api', settings.MAILGUN_API_KEY),
            data={
                'from': 'MootiroMaps <no-reply@it3s.mailgun.org>',
                'to': receivers,
                'subject': title,
                'text': message})


@task
def _send_mail_task(title='', message='', sender='', receivers=[]):
    """ celery taks for the async function below """
    send_mail(title, message, sender, receivers)


def send_mail_async(title='', message='', sender='', receivers=[]):
    ''' send mails asynchronously '''
    _send_mail_task.delay(title, message, sender, receivers)


def parse_accept_header(request):
    """Parse the Accept header *accept*, returning a list with pairs of
    (media_type, q_value), ordered by q values.
    ref: http://djangosnippets.org/snippets/1042/
    """
    accept = request.META.get('HTTP_ACCEPT', '')
    result = []
    for media_range in accept.split(','):
        parts = media_range.split(';')
        media_type = parts.pop(0)
        media_params = []
        q = 1.0
        for part in parts:
            (key, value) = part.lstrip().split('=', 1)
            if key == 'q':
                q = float(value)
            else:
                media_params.append((key, value))
        result.append((media_type, tuple(media_params), q))
    result.sort(lambda x, y: -cmp(x[2], y[2]))
    return result


class ResourceHandler:
    """
    Base class for REST-like resources.
    usage:

      on views.py
      class SomeResource(ResourceHandler):

        def get(self, request, document_id):
          # your view code for GET requests go here

        def post(self, request, document_id):
          # your viewcode for POST request go here

      on urls.py
        url('^my_resource/$', views.SomeResource.dispatch, name='resource')
    """
    http_methods = ['GET', 'POST', 'HEAD', 'PUT', 'DELETE', 'OPTIONS', 'TRACE']

    @classmethod
    def as_view(cls, *args, **kwargs):
        # Keeps compatibility with Django's class-view interface
        return cls.dispatch

    def _get_handler_method(self, request_handler, http_method):
        """ Utility function for the Resource Class dispacther."""
        try:
            handler_method = getattr(request_handler, http_method.lower())
            if callable(handler_method):
                return handler_method
        except AttributeError:
            pass

    @classmethod
    def dispatch(cls, request, *args, **kwargs):
        req_handler = cls()

        req_handler.accept = parse_accept_header(request)
        req_handler.accept_type = req_handler.accept[0][0]

        if request.method in cls.http_methods:
            handler_method = req_handler._get_handler_method(req_handler,
                                                             request.method)
            if handler_method:
                return handler_method(request, *args, **kwargs)

        methods = [method for method in req_handler.http_methods if
                req_handler._get_handler_method(req_handler, method)]
        if len(methods) > 0:
            # http 405: method not allowed
            return HttpResponseNotAllowed(methods)
        else:
            raise Http404


def randstr(l=10):
    chars = letters + digits
    s = ''
    for i in range(l):
        s = s + choice(chars)
    return s


def get_fields_to_show(request, default=['all']):
    data = request.GET.get('fields', None)
    return data.split(',') if data else default


def get_json_data(request):
    """
    get raw json data from request.
    Usefull for requests from Backbone.sync
    """
    return simplejson.loads(request.raw_post_data)


def _to_json_default(obj):
    """
    Converts non default objects to json
    usage:
        simplejson.dumps(data, default=to_json)
    """

    # Geometries
    if hasattr(obj, 'geojson'):
        return simplejson.loads(obj.geojson)

    # Datetime
    if isinstance(obj, datetime.datetime):
        return datetime_to_iso(obj)

    raise TypeError(repr(obj) + ' is not JSON serializable')


def to_json(data):
    return simplejson.dumps(data, default=_to_json_default)


class JsonResponse(HttpResponse):
    """
    Creates a Json Response. The Http status code can be changed.
    usage:
        def my_view(request):
            # some code
            return JsonResponse(my_data_dict)

        def my_other_view(request):
            #some code
            return JsonResponse(my_errors_dict, status_code=400)
    """
    def __init__(self, data={}, status_code=None):
        content = to_json(data)
        super(JsonResponse, self).__init__(content=content,
                    mimetype='application/json')
        if status_code:
            self.status_code = status_code


class JsonResponseNotFound(JsonResponse):
    """ Json Response for 404 Not Found error """
    def __init__(self, msg=''):
        err = 'Not found'
        super(JsonResponseNotFound, self).__init__(
                {'error': err if not msg else '{}: {}'.format(err, msg)},
                status_code=404)


class BaseDAOMixin(object):
    """ Common Basic Queries for abstracting the ORM """

    @classmethod
    def get_by_id(cls, id):
        """ Get entry by ID or return None """
        try:
            obj = cls.objects.get(pk=id)
        except Exception:
            obj = None
        return obj

    @classmethod
    def filter_by(cls, **kwargs):
        """ filter by keyword arguments """
        return cls.objects.filter(**kwargs)

    # utility json methods
    def to_json(self):
        if hasattr(self, 'to_dict'):
            return to_json(self.to_dict())
        else:
            raise Exception('No .to_dict() method defined')

    def from_json(self, data):
        if hasattr(self, 'from_dict'):
            self.from_dict(simplejson.loads(data))
        else:
            raise Exception('No .from_dict() method defined')


class PermissionMixin(object):
    """ Mixin to verifie if user have permission to do some actions """

    def can_edit(self, user):
        """ Default edit permissions """
        if not user or not user.is_authenticated():
            return False

        # superusers can edit everything
        if user.is_superuser():
            return True

        # otherwise only the user can edit itself
        if self.__class__.__name__ == 'User':
            # use .__class__.__name__ is ugly, but we don't want circular
            # dependencies
            return user == self

        # active users can edit every content
        return user.is_active

    def can_view_field(self, fieldname, user=None):
        """ Default view permissions """
        # Nobody can view internal fields
        if fieldname in getattr(self, 'internal_fields', []):
            return False

        if self.can_edit(user):
            return True

        return not fieldname in getattr(self, 'private_fields', [])

    def to_cleaned_dict(self, fields=['all'], user=None):
        return {key: val for key, val in self.to_dict().items()
                if (key in fields or 'all' in fields) and
                   self.can_view_field(key, user)}


# class BaseView(ResourceHandler):
#     """ Base class for views
#     usage:
#
#       on views.py
#       class SomeView(BaseView):
#
#         def get(self, request, document_id):
#           # your view code for GET requests for html go here
#         def post(self, request, document_id):
#           # your viewcode for POST request for html go here
#         def get_json(self, request, document_id):
#           # your view code for GET requests for json go here
#         def post(self, request, document_id):
#           # your viewcode for POST request for json go here
#
#       on urls.py
#         url('^my_view/$', views.SomeView.dispatch, name='view')
#     """
#     def _get_handler_method(self, request_handler, http_method):
#         """Utility function for the Resource Class dispacther."""
#         method = http_method
#         if self.accept_type == 'application/json':
#             method = '{}_json'.format(http_method)
#         try:
#             handler_method = getattr(request_handler, method.lower(),
#                              getattr(request_handler, http_method.lower()))
#             if callable(handler_method):
#                 return handler_method
#         except AttributeError:
#             pass


# class SearchTagsBaseView(BaseView):
#     """ Base class for "search tags" views
#     usage:
#
#       on views.py
#       class SearchSomeTagsView(SearchTagsBaseView):
#           model = SomeModel
#     """
#     limit = 10
#
#     def get(self, request):
#         # Import here to prevent a strange issue
#         from lib.taggit.models import TaggedItem
#         term = request.GET['term']
#         qset = TaggedItem.tags_for(self.model
#                 ).filter(name__istartswith=term
#                 ).annotate(count=Count('taggit_taggeditem_items__id')
#                 ).order_by('-count', 'slug')[:self.limit]
#         tags = [t.name for t in qset]
#         return HttpResponse(simplejson.dumps(tags),
#                 mimetype='application/json')


# class SearchByBaseView(BaseView):
#     """ Base class for "search by" views
#     usage:
#
#       on views.py
#       class SearchBySomethingView(SearchByBaseView):
#           model = SomeModel
#     """
#     def get(self, request):
#         term = request.GET.get('term', '')
#         collection = self.model.objects.filter(Q(name__icontains=term) |
#                                                Q(slug__icontains=term))
#         d = [{'value': obj.id, 'label': obj.name} for obj in collection]
#         return HttpResponse(simplejson.dumps(d),
#                 mimetype='application/json')
#

# class AllMethodsMixin(object):
#     """ Mixin to return the same content to any http method
#     usage:
#
#       on views.py
#       class SomeView(BaseView, AllMethodsMixin):
#         def all(self, request, document_id):
#           # your view code go here
#     """
#     def get(self, *args, **kwargs):
#         return self.all(*args, **kwargs)
#
#     def post(self, *args, **kwargs):
#         return self.all(*args, **kwargs)
#
#     def put(self, *args, **kwargs):
#         return self.all(*args, **kwargs)
#
#     def patch(self, *args, **kwargs):
#         return self.all(*args, **kwargs)
#
#     def delete(self, *args, **kwargs):
#         return self.all(*args, **kwargs)


# class ViewObjectMixin(object):
#     def get_object(self, pk):
#         return get_object_or_404(self.model, pk=pk)
#
#     def get_object_name(self):
#         return getattr(self, 'object_name', 'object')


# class ViewDetailsMixin(ViewObjectMixin):
#     def get(self, request, pk, *args, **kwargs):
#         try:
#             context = super(ViewDetailsMixin, self).get(
#                     request, pk, *args, **kwargs)
#         except AttributeError:
#             context = {}
#
#         obj = self.get_object(pk)
#         context['object'] = obj
#         context[self.get_object_name()] = obj
#
#         return context


# class ViewListMixin(object):
#     sort_order = ['creation_date', 'name']
#     default_order = 'name'
#
#     def get_queryset(self, request):
#         return getattr(self, 'queryset',
#                 filtered_query(self.model.objects, request))
#
#     def get_collection(self, request):
#         return sorted_query(self.get_queryset(request), self.sort_order,
#                 request, default_order=self.default_order)
#
#     def get_collection_name(self):
#         return getattr(self, 'collection_name', 'collection')
#
#     def get(self, request, *args, **kwargs):
#         try:
#             context = super(ViewListMixin, self).get(
#                     request, *args, **kwargs)
#         except AttributeError:
#             context = {}
#
#         collection = self.get_collection(request)
#         context['collection'] = collection
#         count = collection.count()
#         context['count'] = count
#         context['{}_count'.format(self.get_collection_name())] = count
#         context[self.get_collection_name()] = collection
#
#         return context


# class ViewPaginatedListMixin(ViewListMixin):
#     def get(self, request, *args, **kwargs):
#         try:
#             context = super(ViewPaginatedListMixin, self).get(
#                     request, *args, **kwargs)
#         except AttributeError:
#             context = {}
#
#         collection = context.get('collection', self.get_collection(request))
#         collection = paginated_query(collection, request)
#         context['collection'] = collection
#         context[self.get_collection_name()] = collection
#
#         return context


# class ViewGeojsonMixin(object):
#     def get(self, request, pk, *args, **kwargs):
#         try:
#             context = super(ViewGeojsonMixin, self).get(
#                     request, pk, *args, **kwargs)
#         except AttributeError:
#             context = {}
#
#         obj = self.get_object(pk)
#         try:
#             geojson = create_geojson(obj)
#         except TypeError:
#             geojson = create_geojson([obj])
#         context['geojson'] = geojson
#
#         return context


