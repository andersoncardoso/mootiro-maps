from django_assets import Bundle

markitup_js = Bundle(
    # 'markitup/ajax_csrf.js',
    'markitup/jquery.markitup.js',
    'markitup/sets/markdown_pt_BR/set.js',
    'js/widgets/markitup.js',
)

markitup_css = Bundle(
    'markitup/skins/simple/style.css',
    'markitup/sets/markdown_pt_BR/style.css',
)
