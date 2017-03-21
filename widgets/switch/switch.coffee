class Dashing.Switch extends Dashing.ClickableWidget
  constructor: ->
    super
    @queryState()

  @accessor 'state',
    get: -> @_state ? 'Unknown'
    set: (key, value) -> @_state = value

  @accessor 'icon',
    get: -> if @['icon'] then @['icon'] else
      if @get('state') == 'on' then @get('iconon') else @get('iconoff')
    set: Batman.Property.defaultAccessor.set

  @accessor 'iconon',
    get: -> @get('icon') ? 'connectdevelop'
    set: Batman.Property.defaultAccessor.set

  @accessor 'iconoff',
    get: -> @get('icon') ? 'connectdevelop'
    set: Batman.Property.defaultAccessor.set

  @accessor 'icon-style', ->
    if @get('state') == 'on' then 'switch-icon-on' else 'switch-icon-off' 


  toggleState: ->
    newState = if @get('state') == 'on' then 'off' else 'on'
    @set 'state', newState
    return newState   


  queryState: ->
    path = '/switch/' + @get('device') + '/'
    $.post path,
      deviceType: 'Switch',
      device: @get('device'),
      command: 'q',
      (data) ->
        @set 'state', data.state


  postState: ->
    @toggleState()
    path = '/switch/' + @get('device') + '/'
    $.post path,
      deviceType: 'Switch',
      device: @get('device'),
      command: 't',
      state: @get('state'),


  ready: ->

  onData: (data) ->
    @set 'state', data.state

  onTouchStart: (event) ->
    @postState()

  #onClick: (event) ->
  #  @postState()
