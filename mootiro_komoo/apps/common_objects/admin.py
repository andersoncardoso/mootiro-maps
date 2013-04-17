from django.contrib import admin
from .models import Community, Need, Resource


class CommunityAdmin(admin.ModelAdmin):
    pass


class NeedAdmin(admin.ModelAdmin):
    pass


class ResourceAdmin(admin.ModelAdmin):
    pass

admin.site.register(Community, CommunityAdmin)
admin.site.register(Need, NeedAdmin)
admin.site.register(Resource, ResourceAdmin)
