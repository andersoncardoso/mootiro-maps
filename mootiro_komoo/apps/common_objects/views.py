# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import logging
from django.shortcuts import get_object_or_404
from annoying.decorators import render_to
from main.utils import paginated_query, sorted_query, filtered_query
from authentication.utils import login_required
from .utils import get_accessor
from .models import GeoRefObject

logger = logging.getLogger(__name__)


@render_to('common_objects/list.html')
def list(request):
    accessor, err = get_accessor(request, method="GET", allow_generic=True)
    if err:
        return err
    else:
        sort_order = ['creation_date', 'name']
        query_set = filtered_query(accessor.objects, request)
        objects = sorted_query(query_set, sort_order, request)
        objects = paginated_query(objects, request)
        return {'objects': objects, 'type': accessor.__name__.lower()}


@render_to('common_objects/show.html')
def show(request, id):
    obj = get_object_or_404(GeoRefObject, pk=id)
    return {'object': obj}


@login_required
@render_to('common_objects/edit.html')
def edit(request, id=None):
    obj = GeoRefObject.get_by_id(id)
    data = {'object': obj.to_dict()} if obj else {}
    type_ = request.GET.get('type', None) if not obj else obj.otype

    if type_:
        data['type'] = type_
    return {
        'KomooNS_data': data,
        'geojson': obj.geojson if obj else '{}'
    }
