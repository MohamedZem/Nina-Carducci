(function($) {
  $.fn.mauGallery = function(options) {
    var options = $.extend($.fn.mauGallery.defaults, options);
    var tagsCollection = [];
    return this.each(function() {
      $.fn.mauGallery.methods.createRowWrapper($(this));
      if (options.lightBox) {
        $.fn.mauGallery.methods.createLightBox(
          $(this),
          options.lightboxId,
          options.navigation
        );
      }
      $.fn.mauGallery.listeners(options);

      $(this)
        .children(".gallery-item")
        .each(function(index) {
          $.fn.mauGallery.methods.responsiveImageItem($(this));
          $.fn.mauGallery.methods.moveItemInRowWrapper($(this));
          $.fn.mauGallery.methods.wrapItemInColumn($(this), options.columns);
          var theTag = $(this).data("gallery-tag");
          if (
            options.showTags &&
            theTag !== undefined &&
            tagsCollection.indexOf(theTag) === -1
          ) {
            tagsCollection.push(theTag);
          }
        });

      if (options.showTags) {
        $.fn.mauGallery.methods.showItemTags(
          $(this),
          options.tagsPosition,
          tagsCollection
        );
      }

      $(this).fadeIn(500);
    });
  };
  $.fn.mauGallery.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: null,
    showTags: true,
    tagsPosition: "bottom",
    navigation: true
  };
  $.fn.mauGallery.listeners = function(options) {

  $(".gallery").on("click", ".gallery-item", function () {
    if (options.lightBox) {
      $.fn.mauGallery.methods.openLightBox($(this), options.lightboxId);
    }
  });

  $(".gallery").on("click", ".nav-link", $.fn.mauGallery.methods.filterByTag);

  $(".gallery").on("click", ".mg-prev", function () {
    $.fn.mauGallery.methods.prevImage();
  });

  $(".gallery").on("click", ".mg-next", function () {
    $.fn.mauGallery.methods.nextImage();
  });

};

  $.fn.mauGallery.methods = {

  createRowWrapper(element) {
    if (!element.children().first().hasClass("row")) {
      element.append('<div class="gallery-items-row row"></div>');
    }
  },

  wrapItemInColumn(element, columns) {
    element.wrap(`<div class="item-column mb-4 col-4"></div>`);
  },

  moveItemInRowWrapper(element) {
    element.appendTo(".gallery-items-row");
  },

  responsiveImageItem(element) {
    if (element.prop("tagName") === "IMG") {
      element.addClass("img-fluid");
    }
  },

  openLightBox(element, lightboxId) {
    $(".lightboxImage").attr("src", element.attr("src"));
    let modalEl = document.getElementById(lightboxId);
let modal = bootstrap.Modal.getOrCreateInstance(modalEl);
modal.show();

  },

  prevImage() {
    let imgs = $(".item-column img");
    let current = $(".lightboxImage").attr("src");
    let index = imgs.index(imgs.filter(`[src="${current}"]`));
    let prev = index === 0 ? imgs.length - 1 : index - 1;
    $(".lightboxImage").attr("src", imgs.eq(prev).attr("src"));
  },

  nextImage() {
    let imgs = $(".item-column img");
    let current = $(".lightboxImage").attr("src");
    let index = imgs.index(imgs.filter(`[src="${current}"]`));
    let next = index === imgs.length - 1 ? 0 : index + 1;
    $(".lightboxImage").attr("src", imgs.eq(next).attr("src"));
  },

  filterByTag() {
    $(".nav-link").removeClass("active active-tag");
    $(this).addClass("active active-tag");

    let tag = $(this).data("images-toggle");

    $(".gallery-item").each(function () {
      let col = $(this).parents(".item-column");
      col.hide();

      if (tag === "all" || $(this).data("gallery-tag") === tag) {
        col.show(300);
      }
    });
  },

  showItemTags(gallery, position, tags) {
    let tagItems =
      '<li class="nav-item"><span class="nav-link active active-tag" data-images-toggle="all">Tous</span></li>';

    $.each(tags, function(index, value) {
      tagItems += `
        <li class="nav-item">
          <span class="nav-link" data-images-toggle="${value}">${value}</span>
        </li>`;
    });

    let tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;

    if (position === "bottom") {
      gallery.append(tagsRow);
    } else {
      gallery.prepend(tagsRow);
    }
  },

  createLightBox(gallery, lightboxId, navigation) {
      gallery.append(`<div class="modal fade" id="${
        lightboxId ? lightboxId : "galleryLightbox"
      }" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-body">
                            ${
                              navigation
                                ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>'
                                : '<span style="display:none;" />'
                            }
                            <img class="lightboxImage img-fluid" alt="Contenu de l\'image affichée dans la modale au clique"/>
                            ${
                              navigation
                                ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;">></div>'
                                : '<span style="display:none;" />'
                            }
                        </div>
                    </div>
                </div>
            </div>`);
    },

};

})(jQuery);
