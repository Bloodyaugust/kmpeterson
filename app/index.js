$(function () {
  var images = [];

  /*fetch('/images')
  .then(function (resp) {
    return resp.json();
  })
  .then(function (json) {
    images = json.images;
  });*/
});

viewCallbacks = {
  gallery: function () {
    $('.gallery-item img').click(function (e) {
      $(e.target).toggleClass('expanded');
    });
  }
};

function setView(view, data) {
  var $content = $('.content');

  $content.removeClass('show');
  setTimeout(function () {
    $content.addClass('show');
    $content.html(Mustache.render($('script[id="templates/' + view + '.html"]').html(), data));

    if (viewCallbacks[view]) {
      viewCallbacks[view]();
    }
  }, 500);
};
