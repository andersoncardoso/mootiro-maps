# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import json
import logging

from django.shortcuts import redirect, get_object_or_404
from django.core.urlresolvers import reverse
from django.http import Http404
from django.contrib.contenttypes.models import ContentType
from django.utils.translation import ugettext as _
from django.utils import simplejson
from django.forms.models import model_to_dict
from django.utils.decorators import method_decorator

from annoying.decorators import render_to, ajax_request
from annoying.functions import get_object_or_None
from reversion.models import Revision

from signatures.models import Signature, DigestSignature
from ajaxforms import ajax_form
from main.utils import (create_geojson, ResourceHandler,
        JsonResponse, get_json_data)
from lib.locker.models import Locker

from .models import User, Login
from .forms import FormProfile
from .utils import login_required
from .utils import logout as auth_logout
from .utils import login as auth_login


logger = logging.getLogger(__name__)


def _prepare_contrib_data(version, created_date):
    """
    given a django-reversion.Version object we want a dict like:
    contrib = {
        id: object id (in case of comment, the referenced object id)
        name: presentation name
        model_name: name of the model
        app_name: name of the app (the django apps folder name)
        has_geojson: is it has or not a geojson
    }
    """
    data = simplejson.loads(version.serialized_data)[0]

    regular_types = [
        'need.need',
        'resources.resource',
        'community.community',
        'organization.organization',
        'organization.organizationbranch',
    ]
    weird_types = [
        'komoo_comments.comment',
    ]

    contrib = {}

    if data['model'] in regular_types + weird_types:
        if data['model'] in regular_types:
            obj = data['fields']
            contrib['id'] = version.object_id
            contrib['app_name'], contrib['model_name'] = data['model'
                                                            ].split('.')
            contrib['type'] = ['A', 'E', 'D'][version.type]

        elif data['model'] in weird_types:
            ctype = ContentType.objects.get_for_id(
                            data['fields']['content_type'])
            obj = model_to_dict(ctype.get_object_for_this_type(
                    pk=data['fields']['object_id']))
            contrib['id'] = obj.get('id', '') or obj.get('pk', '')
            contrib['app_name'] = ctype.app_label
            contrib['model_name'] = ctype.name
            contrib['type'] = 'C'

        contrib['name'] = obj.get('name', '') or obj.get('title', '')
        contrib['date'] = created_date.strftime('%d/%m/%Y %H:%M')
        contrib['has_geojson'] = not 'EMPTY' in obj.get('geometry', 'EMPTY')
        contrib['permalink'] = "/permalink/{}{}".format(
                                    contrib['model_name'][0]
                if data['model'] != 'organization.organizationbranch' else 'o',
                contrib['id'])

    return contrib


@render_to('authentication/profile.html')
def profile(request, id=''):
    logger.debug('id : {}'.format(id))
    if not id:
        if request.user.is_authenticated():
            user = request.user
        else:
            return redirect(reverse('user') + '#login')
    else:
        user = get_object_or_404(User, id=id)
    contributions = []
    for rev in Revision.objects.filter(user=user
               ).order_by('-date_created')[:20]:
        version = rev.version_set.all()[0]
        contrib = _prepare_contrib_data(version, rev.date_created)
        if contrib:
            contributions.append(contrib)
    geojson = create_geojson([user], convert=False, discard_empty=True)
    if geojson:
        geojson['features'][0]['properties']['image'] = '/static/img/user.png'
        geojson = json.dumps(geojson)

    return dict(user_profile=user, contributions=contributions,
                geojson=geojson)


@render_to('authentication/profile_update.html')
@login_required
def profile_update(request):
    signatures = []
    for sig in Signature.objects.filter(user=request.user):
        try:
            ct = ContentType.objects.get_for_id(sig.content_type_id)
            obj = ct.get_object_for_this_type(pk=sig.object_id)

            signatures.append({
                'signature_id': sig.id,
                'obj_name': getattr(obj, 'name', '') or getattr(
                                    obj, 'title', ''),
                'obj_id': obj.id,
                'model_name': ct.name,
                'app_name': ct.app_label,
                'permalink': obj.view_url,
                'has_geojson': not 'EMPTY' in getattr(
                                    obj, 'geometry', 'EMPTY'),
            })
        except:
            # signature for an object that cannot be found (probably deleted)
            sig.delete()

    digest_obj = DigestSignature.objects.filter(user=request.user)
    digest = digest_obj[0].digest_type if digest_obj.count() \
                  else 'N'
    form_profile = FormProfile(instance=request.user)
    geojson = create_geojson([request.user], convert=False)
    geojson['features'][0]['properties']['image'] = '/static/img/me.png'
    geojson = json.dumps(geojson)
    return dict(signatures=signatures, form_profile=form_profile,
                digest=digest, geojson=geojson)


@login_required
@ajax_form(form_class=FormProfile)
def profile_update_public_settings(request):
    return {}


@login_required
@ajax_request
def profile_update_personal_settings(request):
    logging.debug('POST: {}'.format(request.POST))
    # email = request.POST.get('email', '')
    current_password = request.POST.get('current_password', '')
    new_password = request.POST.get('password', '')
    confirm_password = request.POST.get('confirm_password', '')
    try:
        # if not email or email != request.user.email:
        #     return {
        #         'success': 'false',
        #         'errors': {
        #             'email': _('Email does not match with current user')}}
        if (not request.user.password or request.user.verify_password(
                                            current_password)):
            if not new_password:
                return {
                    'success': 'false',
                    'errors': {
                        'password': _('You must provide a valid password')}}
            if new_password != confirm_password:
                return {
                    'success': 'false',
                    'errors': {
                        'confirm_password': _('Passwords did not match')}}

            # current password verifies, has new password and
            # confirmation is equal,then saves new pass
            request.user.set_password(new_password)
            request.user.save()
            return {
                'success': 'true',
                'data': {}}

        else:
            # wrong pass (same as: has_passwd and not verify )
            return {
                    'success': 'false',
                    'errors': {
                        'current_password': _('Wrong password!')}}
    except Exception as err:
        logger.error('OPS: ', err)
        return dict(success='false',
                    errors={"__all__": _('Failed to save data')})


@login_required
@ajax_request
def digest_update(request):
    logger.debug('POST: {}'.format(request.POST))
    digest_type = request.POST.get('digest_type', '')

    # update digest
    user_digest = DigestSignature.objects.filter(user=request.user)

    if digest_type and not user_digest.count():
        DigestSignature.objects.create(user=request.user,
                digest_type=digest_type)
    elif user_digest.count() and not digest_type:
        d = DigestSignature.objects.get(user=request.user)
        d.digest_type = 'N'
        d.save()
    elif user_digest.count() and digest_type != user_digest[0].digest_type:
        d = DigestSignature.objects.get(user=request.user)
        d.digest_type = digest_type
        d.save()

    return {'success': 'true'}


@login_required
@ajax_request
def signature_delete(request):
    id_ = request.POST.get('id', '')
    signature = get_object_or_404(Signature, pk=id_)
    if signature.user == request.user:
        signature.delete()
        return dict(success=True)
    return dict(success=False)


#
# ==================== Users ==================================================
#
@render_to('authentication/verification.html')
def user_verification(request, key=''):
    '''
    Displays verification needed message if no key provided, or try to verify
    the user by the given key.
    '''
    if not key:
        return dict(message='check_email')
    user_id = Locker.withdraw(key=key)
    user = get_object_or_None(User, id=user_id)
    if not user:
        # invalid key => invalid link
        raise Http404
    if user.is_active:
        return dict(message='already_verified')
    user.is_active = True
    user.save()
    return dict(message='activated')


#
# ======================== NEW STUFF ===================================== #
#


class UserHandler(ResourceHandler):
    """ /user """

    @method_decorator(render_to('authentication/user_root.html'))
    def get(self, request):
        """
        user_root is intended to only load a backbone router that
        renders the diferent login/register pages
        """
        return {}

    def post(self, request):
        """
        Handles the RegisterForm from LoginView (authentication/views.coffee)
        Responsible for creating a new User account.
        """
        json_data = get_json_data(request)
        user = User()
        user.from_dict(json_data)

        # user model validations
        form_validates = user.is_valid()

        # form specific validations
        if not json_data.get('password_confirm', None):
            form_validates = False
            user.errors['password_confirm'] = _('Required field')

        license = json_data.get('license', '')
        license = True if license == 'agree' else False
        if not license:
            form_validates = False
            user.errors['license'] = _(''
                'You must accept the license agrement')
        if not json_data.get('password') == json_data.get('password_confirm'):
            form_validates = False
            user.errors['password_confirm'] = _(''
                    'Passwords did not match')

        # return errors or save
        if not form_validates:
            return JsonResponse({'errors': user.errors}, status_code=400)
        else:
            user.is_active = False
            user.set_password(json_data.get('password'))
            user.send_confirmation_mail(request)
            user.save()
            redirect_url = reverse('user_check_inbox')
            return JsonResponse({'redirect': redirect_url})


class LoginHandler(ResourceHandler):
    """ /user/login """

    def post(self, request):
        """
        Resposible for handle the LoginForm from LoginView
        (authentication/views.coffee)
        """
        json_data = get_json_data(request)
        email, password = [json_data.get(data, '')
                            for data in ['email', 'password']]

        login = Login()
        login.from_dict({'email': email, 'password': password})
        if not login.is_valid():
            return JsonResponse({'errors': login.errors}, status_code=400)
        else:
            user = login.user
            auth_login(request, user)
            next_page = json_data.get('next', '') or reverse('root')
            if next_page.endswith('#'):
                next_page = next_page[:-1]
            return JsonResponse({'redirect': next_page})


def logout(request):
    next_page = request.GET.get('next', '/')
    auth_logout(request)
    return redirect(next_page)

