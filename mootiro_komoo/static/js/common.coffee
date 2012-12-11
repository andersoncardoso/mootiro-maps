define ->
  requirejs.onError = (err) ->
    if err.requireType == 'timeout'
      # TODO: i18n me
      alert 'Timeout', "Ocorreu uma falha ao carregar alguns serviços externos. Partes do Mootiro Maps poderão não funcionar corretamente."
      console?.error err
    else
      throw err
