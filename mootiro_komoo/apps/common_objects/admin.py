from django.contrib import admin
from .models import Community, Need, Resource, Organization
from .models import Proposal


class CommunityAdmin(admin.ModelAdmin):
    pass


class NeedAdmin(admin.ModelAdmin):
    pass


class ResourceAdmin(admin.ModelAdmin):
    pass


class OrganizationAdmin(admin.ModelAdmin):
    pass


class ProposalAdmin(admin.ModelAdmin):
    pass


admin.site.register(Community, CommunityAdmin)
admin.site.register(Need, NeedAdmin)
admin.site.register(Resource, ResourceAdmin)
admin.site.register(Organization, OrganizationAdmin)
admin.site.register(Proposal, ProposalAdmin)

