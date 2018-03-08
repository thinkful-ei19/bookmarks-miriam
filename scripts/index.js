/* global shoppingList, store, Item, api */
'use strict';
$(document).ready(function() {
  itemList.bindEventListeners();
  itemList.render();
});




// api.getItems(function(data) {
//   console.log(data);
// });

// api.createItem('pears', (newItem) => {
//   api.getItems((items) => {
//     console.log(items);
//   });
// });

api.getItems((items) => {
  items.forEach((item) => store.addItem(item));
  itemList.render();
});