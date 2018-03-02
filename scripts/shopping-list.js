'use strict';
/* global store */
//<button  id="add" >Add Bookmark</button>

// eslint-disable-next-line no-unused-vars

$("#addItemButton").click(function() {
  displayBookmarkForm();
})
$("#submitItemButton").click(function(){
  hideBookmarkForm();
})

function displayBookmarkForm() {
  $("#js-bookmark-form").removeClass("hidden");
  $("#addItemButton").addClass("hidden");
}

function hideBookmarkForm() {
  $("#addItemButton").removeClass("hidden");
  $("#js-bookmark-form").addClass("hidden");
}

const shoppingList = (function () {
  function generateItemElement(item) {

    return `
    <li class="bookmark-item">
    <header>
      <span class="header-text">${item.title}</span>
    <button class= "remove-bookmark-button">X</button>
    </header>
    <article>
    <a href="{item.url}" >${item.url}</a> 
      <p class="description">
        ${item.description}
      </p>
    </article>
    <div class="rating">
      <span>&#x2605</span><span>&#x2605</span><span>&#x2605</span><span>&#x2606</span><span>&#x2606</span>
      </div>
      
    
  </li>`;
  }
  // Use a better naming convention eg. Bookmarks
  function generateShoppingItemsString(shoppingList) {
    const items = shoppingList.map((item) => generateItemElement(item));
    return items.join('');
  }

  function render() {
    // Filter item list if store prop is true by item.checked === false
    let items = store.items;
     
    // Filter item list if store prop `searchTerm` is not empty
    // if (store.searchTerm) {
    //   items = store.items.filter(item => item.name.includes(store.searchTerm));
    // }
  
    // render the shopping list in the DOM
    console.log('`render` ran');
    const shoppingListItemsString = generateShoppingItemsString(items);
  
    // insert that HTML into the DOM
    $('.bookmarks-list').html(shoppingListItemsString);
  }

  function handleNewItemSubmit() {
    $('#js-bookmark-form').submit(function (event) {
      event.preventDefault();

      const title = $('.js-bookmark-list-title').val();
      $('.js-bookmark-list-title').val('');

      const url = $('.js-bookmark-list-url').val();
      $('.js-bookmark-list-url').val('');

      const description = $('.js-bookmark-list-description').val();
      $('.js-bookmark-list-description').val('');


      const rating = $('input:radio[name="bookmark-rating"]:checked').val();
    
      let bookmark  = {};
      bookmark.title = title;
      bookmark.url = url;
      bookmark.desc = description;
      bookmark.rating = rating;

      //store.addItem(newItemName);
      api.createItem(bookmark, () => {
        store.addItem(bookmark);
       render();
      });
      
    });
  }

  function getItemIdFromElement(item) {
    return $(item)
      .closest('.js-item-element')
      .data('item-id');
  }

  function handleItemCheckClicked() {
    $('.js-shopping-list').on('click', '.js-item-toggle', event => {
      const id = getItemIdFromElement(event.currentTarget);
      store.findAndToggleChecked(id);
      render();
    });
  }
  
  function handleDeleteItemClicked() {
    // like in ` handleItemCheckClicked`, we use event delegation
    $('.js-bookmarks-list').on('click', '.remove-bookmark-button', event => {
      // get the index of the item in store.items
      const id = getItemIdFromElement(event.currentTarget);
      // delete the item
      store.findAndDelete(id);
      // render the updated shopping list
      render();
    });
  }

  function handleEditShoppingItemSubmit() {
    $('.js-shopping-list').on('submit', '#js-edit-item', event => {
      event.preventDefault();
      const id = getItemIdFromElement(event.currentTarget);
      const itemName = $(event.currentTarget).find('.shopping-item').val();
      store.findAndUpdateName(id, itemName);
      render();
    });
  }
  
  function handleToggleFilterClick() {
    $('.js-filter-checked').click(() => {
      store.toggleCheckedFilter();
      render();
    });
  }
  
  function handleShoppingListSearch() {
    $('.js-shopping-list-search-entry').on('keyup', event => {
      const val = $(event.currentTarget).val();
      store.setSearchTerm(val);
      render();
    });
  }
  
  function bindEventListeners() {
    handleNewItemSubmit();
    handleItemCheckClicked();
    handleDeleteItemClicked();
    handleEditShoppingItemSubmit();
    handleToggleFilterClick();
    handleShoppingListSearch();
  }

  // This object contains the only exposed methods from this module:
  return {
    render: render,
    bindEventListeners: bindEventListeners,
  };

}());