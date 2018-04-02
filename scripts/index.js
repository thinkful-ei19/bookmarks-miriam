/* global bookmarks list, store, Item, api */
'use strict';
$(document).ready(function() {
  api.getItems((items) => {
    items.forEach((item) => store.addItem(item));
    itemList.render();
    itemList.bindEventListeners();
  });
});
