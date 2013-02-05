# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from hashlib import sha1

from django.conf import settings
from django.db import models
from django.core.urlresolvers import reverse
from django.utils.translation import ugettext as _
from jsonfield import JSONField

from main.utils import send_mail_async, build_obj_from_dict
from main.mixins import PermissionMixin, BaseDAOMixin
from main.datalog import get_user_updates
from locker.models import Locker
from komoo_map.models import GeoRefModel, POINT


CONFIRMATION_EMAIL_MSG = _('''
Hello, {name}.

Before using our tool, please confirm your e-mail visiting the link below.
{verification_url}

Thanks,
the IT3S team.
''')


class User(GeoRefModel, BaseDAOMixin, PermissionMixin):
    """
    User model. Replaces django.contrib.auth, CAS and social_auth
    with our own unified solution.
    its intended to use with external login providers.

    password: is set only if not created through external providers

    """
    name = models.CharField(max_length=256, null=False)
    email = models.CharField(max_length=512, null=False, unique=True)
    about_me = models.TextField(null=True, blank=True, default='')
    password = models.CharField(max_length=256, null=False)
    contact = JSONField(null=True, blank=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    # last_access = models.DateTimeField(null=True, blank=True)

    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)

    # Attributes used by PermissionMixin
    private_fields = ['email']
    internal_fields = ['password']

    class Map:
        editable = False
        geometries = [POINT]
        categories = ['me', 'user']
        min_zoom_geometry = 0
        max_zoom_geometry = 100
        min_zoom_point = 100
        max_zoom_point = 100
        min_zoom_icon = 100
        max_zoom_icon = 10

    @classmethod
    def calc_hash(self, s, salt=None):
        if not salt:
            salt = settings.USER_PASSWORD_SALT
        return unicode(sha1(salt + s).hexdigest())

    def set_password(self, s, salt=None):
        self.password = self.calc_hash(s, salt=salt)

    def verify_password(self, s, salt=None):
        return self.password == self.calc_hash(s, salt)

    def is_authenticated(self):
        return True

    def is_anonymous(self):
        return False

    def is_superuser(self):
        return self.is_admin

    def __unicode__(self):
        return unicode(self.name)

    @property
    def url(self):
        return reverse('user_view', kwargs={'id_': self.id})

    @property
    def avatar(self):
        return None

    def _social_auth_by_name(self, name):
        """
        Retrieve the SocialAuth entry for this User given a high level
        social provider name.
        """
        credentials = self.socialauth_set.filter(provider=PROVIDERS[name])
        return credentials.get() if credentials.exists() else None

    def google(self):
        return self._social_auth_by_name('google')

    def facebook(self):
        return self._social_auth_by_name('facebook')

    # ==================== Interface for django admin ======================= #
    def is_staff(self):
        return self.is_admin

    def has_module_perms(self, mod):
        return self.is_admin

    def has_perm(self, perm):
        return self.is_admin

    # ====================  utils =========================================== #
    def from_dict(self, data):
        expected_keys = [
            'id', 'name', 'email', 'password', 'contact', 'geojson', 'url',
            'creation_date', 'is_admin', 'is_active', 'avatar', 'about_me',
            'license', 'signin', 'password_confirm']
        datetime_keys = ['creation_date']
        ignore_keys = ['url', 'avatar', 'license', 'signin',
                        'password_confirm']
        build_obj_from_dict(self, data, expected_keys, datetime_keys,
                            ignore_keys)

    def to_dict(self):
        fields_and_defaults = [
            ('id', None), ('name', None), ('email', None), ('contact', {}),
            ('geojson', {}), ('url', ''), ('password', None),
            ('creation_date', None), ('is_admin', False), ('is_active', False),
            ('avatar', None), ('about_me', '')
        ]
        dict_ = {v[0]: getattr(self, v[0], v[1])
                    for v in fields_and_defaults}
        return dict_

    def is_valid(self, ignore=[]):
        self.errors = {}
        valid = True

        # verify required fields
        required = ['name', 'email', 'password']
        for field in required:
            if not field in ignore and not getattr(self, field, None):
                valid, self.errors[field] = False, _('Required field')

        if not self.id:
            # new User
            if SocialAuth.objects.filter(email=self.email).exists():
                valid = False
                self.errors['email'] = _('This email is registered on our '
                    'system. Probably you\'ve logged before with a social '
                    'account (facebook or google). You can skip this step '
                    'and just login.')

            if User.objects.filter(email=self.email).exists():
                valid = False
                self.errors['email'] = _('Email address already in use')

        return valid

    def send_confirmation_mail(self, request):
        """ send async confirmation mail """
        key = Locker.deposit(self.id)
        verification_url = request.build_absolute_uri(
                reverse('user_verification', args=(key,)))
        send_mail_async(
            title=_('Welcome to MootiroMaps'),
            receivers=[self.email],
            message=CONFIRMATION_EMAIL_MSG.format(
                name=self.name,
                verification_url=verification_url))

    def contributions(self, page=1, num=None):
        """ return user's update """
        return get_user_updates(self, page=page, num=num)

    # dummy fix for django weirdness =/
    def get_and_delete_messages(self):
        pass

    @classmethod
    def _table_ref(cls):
        return '{}.{}'.format(cls._meta.app_label, cls.__name__)

    @property
    def table_ref(self):
        return self._table_ref()


class AnonymousUser(object):
    '''Dummy Class to integrate with other django apps.'''
    def is_authenticated(self):
        return False

    def is_anonymous(self):
        return True

    def is_superuser(self):
        return False

    id = None

    def to_dict(self):
        return {'id': None}

    def to_cleaned_dict(self, *args, **kwargs):
        return self.to_dict()

    # dummy fix for django weirdness =/
    def get_and_delete_messages(self):
        pass


PROVIDERS = {
    # 'provider label': 'db info'
    'facebook': 'facebook-oauth2',
    'google': 'google-oauth2',
    # 'twitter': 'twitter-oauth2',
}
PROVIDERS_CHOICES = [(t[1], t[0]) for t in PROVIDERS.items()]


class SocialAuth(models.Model):
    """
    User credentials for login on external authentication providers as Google,
    Facebook and Twitter.
    """

    user = models.ForeignKey(User)
    provider = models.CharField(max_length=32, choices=PROVIDERS_CHOICES)
    email = models.CharField(max_length=256)
    data = JSONField()  # provider specific data for user login


class Login(object):
    """
    Dummy Model used only for form validation
    """
    def __init__(self, *args, **kwargs):
        self.email, self.password = None, None
        for k, v in kwargs.iteritems():
            if k in ['email', 'password']:
                setattr(self, k, v)

    def from_dict(self, data):
        for key, val in data.iteritems():
            setattr(self, key, val)

    def to_dict(self):
        return {attr: getattr(self, attr, None) for attr in [
            'email', 'password'
        ]}

    def is_valid(self):
        self.errors = {}
        valid = True

        if not self.email:
            valid, self.errors['email'] = False, _('Email is required')
        if not self.password:
            valid, self.errors['password'] = False, _('Password is required')

        if self.email and self.password:
            self.passwd_hash = User.calc_hash(self.password)

            if not User.objects.filter(email=self.email).exists():
                valid = False
                self.errors['email'] = _('Email not found')
            q = User.objects.filter(
                    email=self.email, password=self.passwd_hash)
            if not q.exists():
                valid = False
                self.errors['password'] = _('Wrong password')
            else:
                self._user = q.get()
                if not self._user.is_active:
                    valid = False
                    self.errors['email'] = _('User not active')

        return valid

    @property
    def user(self):
        if not hasattr(self, 'passwd_hash'):
            self.passwd_hash = User.calc_hash(self.password)
        _user = User.objects.filter(
                    email=self.email, password=self.passwd_hash)
        return _user.get() if _user.exists() else None


