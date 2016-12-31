#= require_directory ./gridster


Dashing.gridsterLayout = (positions) ->
  Dashing.customGridsterLayout = true
  positions = positions.replace(/^"|"$/g, '')
  positions = $.parseJSON(positions)
  widgets = $("[data-row^=]")
  for widget, index in widgets
    $(widget).attr('data-row', positions[index].row)
    $(widget).attr('data-col', positions[index].col)

Dashing.getWidgetPositions = ->
  $(".gridster ul:first").gridster().data('gridster').serialize()

Dashing.showGridsterInstructions = ->
  newWidgetPositions = Dashing.getWidgetPositions()

  unless JSON.stringify(newWidgetPositions) == JSON.stringify(Dashing.currentWidgetPositions)
    Dashing.currentWidgetPositions = newWidgetPositions
    $('#save-gridster').slideDown()
    $('#gridster-code').text("
      <script type='text/javascript'>\n
      $(function() {\n
      \ \ Dashing.gridsterLayout('#{JSON.stringify(Dashing.currentWidgetPositions)}')\n
      });\n</script>")

$ ->
  $('#save-gridster').leanModal()

  $('#save-gridster').click ->
    $('#save-gridster').slideUp()
