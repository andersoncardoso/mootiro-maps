$ = jQuery


class HelpCenter
    constructor: (btn_selector, questions_ids, tour_id) ->
        @button = $(btn_selector)
        @button.on 'click', @show
        @questions = (@questions_config[cid] for cid in questions_ids)
        @tour = @tours_config[tour_id] if tour_id
        @modal_setup()
        @tour_setup()

    # TODO: put these html templates into an html file
    tour_tpl:
        "
        <!------------ PAGE TOUR ----------->
        <ol id='joyride'>
          <% for (var j = 0; j < tour.slides.length; j++) { %>
          <li data-id='<%= tour.slides[j].target_id %>'
            data-button='Próximo'
            data-options='<%= tour.slides[j].options %>'
            data-offsetX='<%= tour.slides[j].offsetX %>'
            data-offsetY='<%= tour.slides[j].offsetY %>'
          >
            <h2><%= tour.slides[j].title %></h2>
            <p><%= tour.slides[j].body %></p>
          </li>
          <% } %>
        </ol>
        <!--------------------------------->
        "

    modal_tpl:
        "
        <div id='help_center' class='modal hide fade'>
          <div class='modal-header'>
            <button type='button' class='close' data-dismiss='modal'>×</button>
            <h2>Central de Ajuda</h2>
          </div>
          <section class='modal-body'>
            <ul id='questions'>
              <% for (var i = 0; i < questions.length; i++) { %>
              <li class='<%= questions[i].type %>'>
                <!------------ QUESTION ----------->
                <article>
                  <h3><%= questions[i].title %></h3>
                  <p><%= questions[i].body %></p>
                </article>
                <!--------------------------------->
              </li>
              <% } %>
            </ul>

            <button id='tour_button'>Faça o tour desta página</button>
          </section>
        </div>
        "

    modal_setup: =>
        html = _.template @modal_tpl, {questions: @questions}
        @$modal = $(html)
        @$modal.modal {show: true}
        $('body').append @$modal

    tour_setup: =>
        html = _.template @tour_tpl, {tour: @tour}
        @$tour_content = $(html)
        $('body').append @$tour_content

        modal_wrap = @$modal

        $('button#tour_button', @$modal).on 'click', () ->
            modal_wrap.modal 'hide'
            $('#joyride').joyride {
                'afterShowCallback': () ->
                    x  = this.$current_tip.offset().left
                    y  = this.$current_tip.offset().top
                    dx = this.$li.attr('data-offsetX')
                    dy = this.$li.attr('data-offsetY')
                    dx = if dx == 'undefined' then 0 else parseInt dx
                    dy = if dy == 'undefined' then 0 else parseInt dy
                    this.$current_tip.offset({left: x+dx, top: y+dy})

                'postRideCallback': () ->
                    console.log 'FIM'
            }

    show: () =>
        @$modal.modal('show')

    # TODO:use requires and put this json into other file
    questions_config:
        "organization:what_is":
            "title": "What is an organization?"
            "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eu quam odio, ac sagittis nisi. Nam et scelerisque ligula. Ut id velit eu nulla interdum aliquam luctus sed odio. Suspendisse et nunc at ipsum sodales euismod. Vivamus scelerisque rutrum leo id blandit. Maecenas vel risus magna, at pulvinar turpis."

    tours_config:
        "maps:initial_tour":
            "title": "Initial Tour"
            "body": "Take the tour."
            "slides": [
                {
                "title": "MootiroMaps"
                "body": "This is the logo."
                "target_id": "logo"
                "options": "tipLocation:bottom"
                },
                {
                "title": "End"
                "body": "Feel free... stay around..."
                "target_id": ""
                "options": ""
                }
            ]

        "organization:page_tour":
            "slides": [
                # {
                # "title": "MootiroMaps"
                # "body": "Clique no logo do MootiroMaps e você será redirecionado para a página central."
                # "target_id": "logo"
                # "options": ""
                # },
                {
                "title": "Login"
                "body": "Para criar um perfil no MootiroMaps ou logar na plataforma, clique aqui."
                "target_id": "login_button"
                "options": "tipLocation:left;nubPosition:top-right;"
                "offsetX": -230
                },
                {
                "title": "Visualize o mapa"
                "body": "Aqui você encontra no mapa os objetos já mapeados em todo o Brasil. "
                "target_id": ""
                "options": ""
                },
                {
                "title": "Objetos cadastrados"
                "body": "Escolha o tipo de objeto cadastrado e veja as listas correspondentes em ordem alfabética."
                "target_id": ""
                "options": ""
                },
                {
                "title": "Projetos cadastrados"
                "body": "Visualize a lista em ordem alfabética de projetos cadastrados no MootiroMaps."
                "target_id": ""
                "options": ""
                },
                {
                "title": "Blog do IT3S"
                "body": "Em nosso Blog postamos análises e opinões sobre transparência, mobilização social e colaboração. Clique e leia."
                "target_id": ""
                "options": ""
                },
                {
                "title": "Edições recentes"
                "body": "Acompanhe as atualizações feitas pelos usuários do MootiroMaps. Os ícones mostram os tipos de objetos editados. Edite você também."
                "target_id": ""
                "options": ""
                },
                {
                "title": "Página do usuário"
                "body": "Clicando aqui você encontra informações sobre o usuário, contatos e últimas edições feitas."
                "target_id": ""
                "options": ""
                },
            ]


window.HelpCenter = HelpCenter
