from django.conf import settings  # import the settings file
from django.middleware.csrf import get_token


def komoo_namespace(request):
    return {
        'KomooNS': {
            'isAuthenticated': request.user.is_authenticated(),
            'user': getattr(request.user, 'to_dict', lambda fields, user: {})(
                        fields=['id', 'name', 'email', 'url'],
                        user=request.user),
            'lang': getattr(request, 'LANGUAGE_CODE', None) or
                    settings.LANGUAGE_CODE,
            'facebookAppId': settings.FACEBOOK_APP_ID,
            'require_baseUrl': settings.STATIC_URL + ('js'
                                    if settings.DEBUG else 'js.build'),
            'csrf_token': get_token(request),
            'staticUrl': settings.STATIC_URL
        }
    }


# def social_keys(context):
#     return {'FACEBOOK_APP_ID': settings.FACEBOOK_APP_ID}
