# # -*- coding: utf-8 -*-
# from __future__ import unicode_literals  # unicode by default
# 
# from django.utils.decorators import method_decorator
# 
# from annoying.decorators import render_to
# 
# from main.utils import paginated_query, sorted_query
# from main.utils import BaseView
# from .models import Update, News
# 
# 
# class FrontpageView(BaseView):
#     @method_decorator(render_to("update/frontpage.html"))
#     def get(self, request):
#         filters = request.GET.get('filters', [])
#         if filters:
#             filters = filters.split(',')
# 
#         if filters:
#             query_set = Update.objects.filter(object_type__in=filters)
#         else:
#             query_set = Update.objects.all()
#         sort_order = ['-date', 'comments_count']
#         updates_list = sorted_query(query_set, sort_order, request, default_order='-date')
#         updates = paginated_query(updates_list, request, size=30)
#         news = News.objects.order_by("-date")
# 
#         return dict(updates=updates, news=news)
