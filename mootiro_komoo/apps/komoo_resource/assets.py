from django_assets import Bundle, register

resource_form = Bundle(
    'lib/reForm.js',
    'js/widgets/markitup.js',
    'js/resources/models.js',
    'js/resources/forms.js',
    filters='jsmin',
    output='gen/resource_form.js'
)

register('resource_form', resource_form)
