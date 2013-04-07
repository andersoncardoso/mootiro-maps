(function() {
  var trans;

  trans = {
    'send': {
      'pt-br': 'enviar'
    },
    'Edit': {
      'pt-br': 'Editar'
    },
    'Login': {
      'pt-br': 'Entrar'
    },
    'Logout': {
      'pt-br': 'Sair'
    },
    'Help': {
      'pt-br': 'Ajuda'
    },
    'Email': {
      'pt-br': 'E-mail'
    },
    'Password': {
      'pt-br': 'Senha'
    },
    'Name': {
      'pt-br': 'Nome'
    },
    'Classifiers': {
      'pt-br': 'Classificadores'
    },
    'classifier': {
      'pt-br': 'classificador'
    },
    'Keywords': {
      'pt-br': 'Palavras-chave'
    },
    'Password Confirmation': {
      'pt-br': 'Confirmação da Senha'
    },
    'Log In with Google': {
      'pt-br': 'Entre com o Google'
    },
    'Log In with Facebook': {
      'pt-br': 'Entre com o Facebook'
    },
    'Register': {
      'pt-br': 'Registrar'
    },
    'Verification': {
      'pt-br': 'Verificação'
    },
    'Your email was successfully verified.': {
      'pt-br': 'Seu email foi verificado com sucesso.'
    },
    'Please login.': {
      'pt-br': 'Por favor, faça login ao lado.'
    },
    'I\'ve read and accept the <a href="http://mootiro.org/terms">License Terms.</a>': {
      'pt-br': 'Eu li e aceito os <a href="http://mootiro.org/terms">Termos de Uso</a>.'
    },
    'Already has an account? <strong>Sign In</strong>': {
      'pt-br': 'Já possui uma conta? <strong>Entre</strong>'
    },
    'Don\'t have an account? <strong>Sign Up</strong>': {
      'pt-br': 'Não possui uma conta? <strong>Registre-se</strong>'
    },
    'or': {
      'pt-br': 'ou'
    },
    'Your account was created!': {
      'pt-br': 'Sua conta foi criada!'
    },
    'But before using, you have to confirm your email': {
      'pt-br': 'Mas antes de começar a usar, você precisa confirmar seu e-mail'
    },
    'Please go check your mail box': {
      'pt-br': 'Por favor, vá checar sua caixa postal'
    },
    'Search': {
      'pt-br': 'Procurar'
    },
    'See results': {
      'pt-br': 'Ver resultados'
    },
    'More about': {
      'pt-br': 'Saiba mais'
    },
    'About MootiroMaps': {
      'pt-br': 'Sobre o MootiroMaps'
    },
    'About Us': {
      'pt-br': 'Quem somos'
    },
    'Get involved': {
      'pt-br': 'Se envolva'
    },
    'Supporters': {
      'pt-br': 'Apoio institucional'
    },
    'See on map': {
      'pt-br': 'Ver no mapa'
    },
    'Description': {
      'pt-br': 'Descrição'
    },
    'About me': {
      'pt-br': 'Sobre mim'
    },
    'Recent contributions': {
      'pt-br': 'Contribuições recentes'
    },
    'User has not wrote about oneself': {
      'pt-br': 'Usuário ainda não escreveu sobre si'
    },
    'previous %n': {
      'pt-br': '%n anteriores'
    },
    'next %n': {
      'pt-br': 'próximos %n'
    },
    'page': {
      'pt-br': 'página'
    },
    'of': {
      'pt-br': 'de'
    },
    'Contact': {
      'pt-br': 'Contato'
    },
    'Address': {
      'pt-br': 'Endereço'
    },
    'Phone': {
      'pt-br': 'Telefone'
    },
    'Email': {
      'pt-br': 'E-mail'
    },
    'Website': {
      'pt-br': 'Website'
    },
    'Skype': {
      'pt-br': 'Skype'
    },
    'Facebook': {
      'pt-br': 'Facebook'
    },
    'Google Plus': {
      'pt-br': 'Google Plus'
    },
    'Twitter': {
      'pt-br': 'Twitter'
    },
    '+ Add another one': {
      'pt-br': '+ Adicionar outro'
    },
    'Remove': {
      'pt-br': 'Remover'
    },
    'Save': {
      'pt-br': 'Salvar'
    },
    'Cancel': {
      'pt-br': 'Cancelar'
    },
    'Go': {
      'pt-br': 'Ir'
    },
    'Add': {
      'pt-br': 'Adicione'
    },
    'Clean': {
      'pt-br': 'Limpo'
    },
    'Coordinate': {
      'pt-br': 'Coordenada'
    },
    'Latitude': {
      'pt-br': 'Latitude'
    },
    'Longitude': {
      'pt-br': 'Longitude'
    },
    'Loading...': {
      'pt-br': 'Carregando...'
    },
    'Change point position': {
      'pt-br': 'Mudar ponto no mapa'
    },
    'Add classifier type': {
      'pt-br': 'Adicionar tipo de classificador'
    },
    'Define the classifier type': {
      'pt-br': 'Defina o tipo do classificador'
    },
    'Define a set of classifiers for this type': {
      'pt-br': 'Defina um conjunto de classificadores para este tipo'
    },
    'keyword': {
      'pt-br': 'palavra-chave'
    },
    'Classifier Type': {
      'pt-br': 'Tipo de Classificador'
    },
    'A Classifier Type can\'t have an empty Tags list': {
      'pt-br': 'Um tipo de Classificador não pode ter uma lista de palavras-chaves vazia'
    },
    'Classifier Type can\'t be empty': {
      'pt-br': 'Tipo de Classificador não pode ser vazio'
    }
  };

  window.i18n = function(str) {
    var lang, _ref;
    lang = window.KomooNS.lang;
    if ((_ref = trans[str]) != null ? _ref[lang] : void 0) {
      return trans[str][lang];
    } else {
      return str;
    }
  };

}).call(this);
