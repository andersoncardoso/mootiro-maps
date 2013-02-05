# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import logging

from django.shortcuts import redirect
from django.core.urlresolvers import reverse
from django.http import Http404

from annoying.decorators import render_to
from locker.models import Locker
from .models import User


logger = logging.getLogger(__name__)


@render_to('authentication/user_root.html')
def user_root(request):
        """
        user_root is intended to only load a backbone router that
        renders the diferent login/register pages
        """
        return {}


def user_verification(request, key=''):
    '''
    Displays verification needed message if no key provided, or try to verify
    the user by the given key.
    '''
    user_root_ur = reverse('user_root')
    if not key:
        return redirect(reverse('not_verified'))
    user_id = Locker.withdraw(key=key)
    user = User.get_by_id(user_id)
    if not user:
        # invalid key => invalid link
        raise Http404
    if not user.is_active:
        user.is_active = True
        user.save()
    return redirect(reverse('verified'))


@render_to('global.html')
def user_view(request, id_):
    """
    User page
    """
    user = request.user if id_ == 'me' else User.get_by_id(id_)

    if not user:
        raise Http404

    user_data = user.to_cleaned_dict(user=request.user)
    # filter data
    return {
                'KomooNS_data': {
                    'user': user_data
                }
            }
