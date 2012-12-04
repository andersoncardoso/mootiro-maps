from django.contrib import admin
from resources.models import Resource


class ResourceAdmin(admin.ModelAdmin):
    pass

admin.site.register(Resource, ResourceAdmin)
