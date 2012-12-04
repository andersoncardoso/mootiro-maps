from django.contrib import admin
from community.models import Community


class CommunityAdmin(admin.ModelAdmin):
    #list_display = ('__unicode__', abuse_reports)
    pass

admin.site.register(Community, CommunityAdmin)
