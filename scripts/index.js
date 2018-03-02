/* global shoppingList, store, Item, api */
'use strict';
$(document).ready(function() {
  shoppingList.bindEventListeners();
  shoppingList.render();
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
  shoppingList.render();
});