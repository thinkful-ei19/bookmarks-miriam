"use strict";
/* global store */

// eslint-disable-next-line no-unused-vars

$("#addItemButton").click(function() {
  $("#min-rating-dropdown")
    .val("0")
    .change();
  displayItemForm();
});

$("#cancelButton").click(function() {
  if (store.items.length) {
    $("#min-rating-dropdown").show();
    hideItemForm();
  }
});

$("#min-rating-dropdown").on("change", event => {
  // change event returns a js event so
  // already contains a value
  store.minRating = parseInt(event.currentTarget.value, 10);
  itemList.render();
});

function displayItemForm() {
  $(".js-bookmark-list-rating").prop("checked", false);
  $("#js-bookmark-form").show();
  $("#min-rating-dropdown").hide();
  $("#addItemButton").hide();
}
function hideItemForm() {
  $("#addItemButton").show();
  if (store.items.length > 0) {
    $("#addItemButton").show();
  }
  $("#js-bookmark-form").hide();
}

function displayMinimumRatingMenu() {
  if (store.items.length > 0) {
    //$('#min-rating-dropdown').val("0");
    $("#min-rating-dropdown").show();
  } else {
    $("#min-rating-dropdown").hide();
  }
}

const itemList = (function() {
  function generateItemElement(item) {
    var rating = item.rating;
    var ratingString = "";
    for (var i = 1; i <= item.rating; i++)
      ratingString += " <span>&#x2605</span>";

    for (var i = item.rating; i < 5; i++)
      ratingString += " <span>&#x2606</span>";

    return `
    <li class="bookmark-item" data-item-id="${item.id}">
    <header class="bookmark-header">
      <span class="header-text">${item.title}</span>
    <button class= "remove-bookmark-button">X</button>
    <button class= "edit-bookmark-item"><i class="far fa-edit"></i></button>
    </header>
    <article class="hidden">
      <p class="description">
        ${item.desc}
      </p>
      <p>
        <span>Visit site: </span><a href="${item.url}" target="_blank">${
      item.url
    }</a>
      </p>
    </article>
    <div class="rating">
      ${ratingString}
    </div>


  </li>`;
  }

  function generateItemForm(item) {
    return `
        <div class="side1">
          <label for="js-bookmark-form-label">Edit Bookmark</label>
          <input type="hidden" value=${
            item.id
          } name="bookmark-id" class="js-bookmark-list-id"/>
          <br>
          <input type="text" value="${
            item.title
          }" name="bookmark-title" title="Title" class="js-bookmark-list-title" placeholder="e.g., Title" required/>

          <input type="text" value=${
            item.url
          } name="bookmark-url" title="URL" class="js-bookmark-list-url" placeholder="e.g., http://google.com" required/>

          <br>
          <textarea name="bookmark-description" rows="10" cols="80" title="Description" class="js-bookmark-list-description">${
            item.desc
          }</textarea>

        </div>

        <div class="side2">
          <label for="rating5">5 star</label>
          <input type="radio" id="rating5" name="bookmark-rating" class="js-bookmark-list-rating" value="5"></input>

          <label for="rating4">4 star</label>
          <input type="radio" id="rating4" name="bookmark-rating" class="js-bookmark-list-rating" value="4"></input>


          <label for="rating3">3 star</label>
          <input type="radio" id="rating3" name="bookmark-rating" class="js-bookmark-list-rating" value="3"></input>


          <label for="rating2">2 star</label>
          <input type="radio" id="rating2" name="bookmark-rating" class="js-bookmark-list-rating" value="2"></input>


          <label for="rating1">1 star</label>
          <input type="radio" id="rating1" name="bookmark-rating" class="js-bookmark-list-rating" value="1"></input>
        </div>

        <button title="Click to submit your bookmark" type="submit">Submit</button>
        <button type="button" onclick='window.location.href="${
          window.location.href
        }"'>Cancel</button>
      `;
  }

  function generateItemsString(itemList) {
    const items = itemList.map(item => generateItemElement(item));
    return items.join("");
  }

  function handleHeaderClick() {
    $(".js-bookmarks-list").on("click", ".bookmark-header", event => {
      $(event.currentTarget)
        .next("article")
        .toggleClass("hidden");
    });
  }

  function render() {
    let items = store.items;

    if (store.minRating) {
      items = store.items.filter(item => item.rating >= store.minRating);
    }

    // render the book list in the DOM
    const listItemsString = generateItemsString(items);

    // insert that HTML into the DOM
    $(".bookmarks-list").html(listItemsString);

    displayMinimumRatingMenu();
    // displayItemForm if there are no items
    if (!store.items.length) {
      displayItemForm();
    }
  }

  function handleSubmitOrEditButton() {
    $("#js-bookmark-form").submit(function(event) {
      event.preventDefault();
      // pull id from '.js-bookmark-list-id' if editing
      const id = $(".js-bookmark-list-id") && $(".js-bookmark-list-id").val();
      $(".js-bookmark-list-id").val("");

      const title = $(".js-bookmark-list-title").val();
      $(".js-bookmark-list-title").val("");

      const url = $(".js-bookmark-list-url").val();
      $(".js-bookmark-list-url").val("");

      if (!title || !title.trim() || !url || !url.trim()) {
        $(".error").show();
        return false;
      }

      hideItemForm();

      const description = $(".js-bookmark-list-description").val();
      $(".js-bookmark-list-description").val("");

      const rating = $('input:radio[name="bookmark-rating"]:checked').val();

      let item = {};
      item.title = title;
      item.url = url;
      item.desc = description;
      item.rating = rating;

      if (id) {
        item.id = id;
        store.editItem(Object.assign({}, item));
        api.editItem(id, item, response => {
          $(".bookmarks-list").show();
          render();
        });
      } else {
        api.createItem(item, response => {
          store.addItem(response);
          render();
        });
      }
    });
  }

  function getItemIdFromElement(item) {
    return $(item)
      .closest(".bookmark-item")
      .data("item-id");
  }

  function handleDeleteItemClicked() {
    $(".js-bookmarks-list").on("click", ".remove-bookmark-button", event => {
      const newFormShown = $("#js-bookmark-form").hasClass("hidden");
      // get the index of the item in store.items
      const id = getItemIdFromElement(event.currentTarget);
      // delete the item
      api.deleteItem(id, response => {
        store.findAndDelete(id);
        // render the updated bookmark list
        render();
        !$("#js-bookmark-form").hasClass("hidden") &&
          $("#min-rating-dropdown").hide();
      });
    });
  }

  function handleEditItemSubmit() {
    $(".js-bookmarks-list").on("click", ".edit-bookmark-item", event => {
      event.preventDefault();

      const id = getItemIdFromElement(event.currentTarget);
      const item = store.findById(id);
      $("#min-rating-dropdown").hide();
      $("#addItemButton").hide();
      $(".bookmarks-list").hide();
      const editForm = generateItemForm(item);
      $("#js-bookmark-form").show();
      $("#js-bookmark-form").html(editForm);
      $(`.js-bookmark-list-rating[value=${item.rating}]`)
        .prop("checked", "checked")
        .trigger("click");
    });
  }

  function handleNoteContentToggle() {
    $(".js-filter-checked").click(() => {
      store.toggleCheckedFilter();
      render();
    });
  }

  function bindEventListeners() {
    handleSubmitOrEditButton();
    handleDeleteItemClicked();
    handleEditItemSubmit();
    handleNoteContentToggle();
    handleHeaderClick();
  }

  // This object contains the only exposed methods from this module:
  return {
    render: render,
    bindEventListeners: bindEventListeners
  };
})();
