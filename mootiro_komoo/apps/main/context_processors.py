from django.conf import settings  # import the settings file
from django.middleware.csrf import get_token


def komoo_namespace(request):
    user_dict = request.user.to_dict()
    user = {
        'id': user_dict.get('id', None),
        'name': user_dict.get('name', 'Anonymous'),
        'email': user_dict.get('email', None),
        'url': user_dict.get('url', ''),
    }
    return {
        'KomooNS': {
            'isAuthenticated': request.user.is_authenticated(),
            'user': user,
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
