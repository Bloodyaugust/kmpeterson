$(function () {
  var galleryImages = [],
    collaborationImages = [],
    metalworkingImages = [],
    navItems = [];

  fetch('/images?tag=kmp')
  .then(function (resp) {
    return resp.json();
  })
  .then(function (json) {
    galleryImages = json.images;
  });

  fetch('/images?tag=kmp-metalworking')
  .then(function (resp) {
    return resp.json();
  })
  .then(function (json) {
    metalworkingImages = json.images;
  });

  fetch('/images?tag=kmp-collaboration')
  .then(function (resp) {
    return resp.json();
  })
  .then(function (json) {
    collaborationImages = json.images;
  });

  navItems = $('.nav-item');

  $('header').addClass('show');

  $('.nav-item[data-template="about"]').click(function () {
    setView('about');
  });
  $('.nav-item[data-template="collaborations"]').click(function () {
    setView('collaborations', {images: collaborationImages});
  });
  $('.nav-item[data-template="contact"]').click(function () {
    setView('contact');
  });
  $('.nav-item[data-template="gallery"]').click(function () {
    setView('gallery', {images: galleryImages});
  });
  $('.nav-item[data-template="home"]').click(function () {
    setView('home');
  });
  $('.nav-item[data-template="metalworking"]').click(function () {
    setView('metalworking', {images: metalworkingImages});
  });

  setTimeout(function () {
    /* jshint loopfunc: true */
    for (var i = 0; i < navItems.length; i++) {
      (function (item, index) {
        setTimeout(function () {
          $(item).addClass('show');
        }, index * 250);
      })(navItems[i], i);
    }
  }, 1000);
});

viewCallbacks = {
  collaborations: function () {
    var currentImageIndex = 0,
      imageElements = $('.image-container img');

    var bricklayer = new Bricklayer(document.querySelector('.bricklayer'));

    showNextImage = function () {
      $(imageElements[currentImageIndex]).addClass('show');

      if (currentImageIndex + 1 !== imageElements.length) {
        currentImageIndex++;

        setTimeout(function () {
          showNextImage();
        }, 250);
      }
    };

    showNextImage();
  },
  gallery: function () {
    var currentImageIndex = 0,
      imageElements = $('.image-container img');

    var bricklayer = new Bricklayer(document.querySelector('.bricklayer'));

    showNextImage = function () {
      $(imageElements[currentImageIndex]).addClass('show');

      if (currentImageIndex + 1 !== imageElements.length) {
        currentImageIndex++;

        setTimeout(function () {
          showNextImage();
        }, 250);
      }
    };

    showNextImage();
  },
  metalworking: function () {
    var currentImageIndex = 0,
      imageElements = $('.image-container img');

    var bricklayer = new Bricklayer(document.querySelector('.bricklayer'));

    showNextImage = function () {
      $(imageElements[currentImageIndex]).addClass('show');

      if (currentImageIndex + 1 !== imageElements.length) {
        currentImageIndex++;

        setTimeout(function () {
          showNextImage();
        }, 250);
      }
    };

    showNextImage();
  }
};

function setView(view, data) {
  var $content = $('.content'),
    $navItems = $('nav .nav-item'),
    currentNavItem;

  for (var i = 0; i < $navItems.length; i++) {
    currentNavItem = $($navItems[i]);
    if (currentNavItem.data().template === view) {
      currentNavItem.addClass('active');
    } else {
      currentNavItem.removeClass('active');
    }
  }

  $content.removeClass('show');
  setTimeout(function () {
    $content.addClass('show');
    $content.html(Mustache.render($('script[id="templates/' + view + '.html"]').html(), data));

    if (viewCallbacks[view]) {
      viewCallbacks[view]();
    }
  }, 500);
}
