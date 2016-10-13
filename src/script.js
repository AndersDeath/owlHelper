$(document).ready(function(){
  var i = 0;
  $.each(linksConfig,function(key,value){
    var el = $('<li><a href="'+value.href+'" target="_blank">'+value.name+'</a></li>');
    if(i%2){
      el.addClass('bg2');
    }
    $('#vnbsLinks').append(el);
    i++;
  });
  $.each(linksConfigFast,function(key,value){
    var el = $('<a href="'+value.href+'" target="_blank" class="icon '+value.ico+'" title="'+value.title+'"></a>');
    $('#fastLinks').append(el);
  });
  $('#taskGo').click(function(){
    window.open('https://task.qd.kodeks.ru/task/issues/'+$('#taskNum').val(),'_blank');
  });
  var searchInput = $('<input/>',{
    'id':searchConfig.input.id,
    'placeholder':searchConfig.input.placeholder,
    'type':'text'
  });
  $('.allSearch').append(searchInput);

  $.each(searchConfig.buttons,function(key,value){
    var el = $('<input/>',{
      'type':'button',
      'id':value.id,
      'value':value.value,
      'click':function(){
        var text = $('#searchText').val();
        window.open(value.href+text,'_blank');
      },

    });
    $('.allSearch').append(el);
  });
  var configTabs = {
    'container': '#vnbstudio .tabs',
    'elements': {
        'btns': ['.tab_btn', 'div'],
        'areas': ['.tab_container','div.tabContent'],
    },
    'start': 1
};
OwlLib.tabs(configTabs);


});
