'use strict';
/* global Item */

// eslint-disable-next-line no-unused-vars
const store = (function(){
  const addItem = function(item) {
    //console.log('in store aditem=',item);
    this.items.push(item);
    //}
  };

  const editItem = function(item) {
    const bookmark = this.findById(item.id);
    const itemIndex = this.items.indexOf(bookmark);
    this.items.splice(itemIndex, 1, item);
  };  

  const findById = function(id) {
    return this.items.find(item => item.id === id);
  };

  const findAndToggleChecked = function(id) {
    const item = this.findById(id);
    item.checked = !item.checked;
  };

  const findAndDelete = function(id) {
    this.items = this.items.filter(item => item.id !== id);
  };

  const findAndUpdateName = function(id, name) {
    try {
      Item.validateName(name);
      const item = this.findById(id);
      item.name = name;
    } catch(e) {
      console.log('Cannot update name: ' + e.message);
    }
  };

  const toggleCheckedFilter = function() {
    this.hideCheckedItems = !this.hideCheckedItems;
  };

  const setSearchTerm = function(term) {
    this.searchTerm = term;
  };

  return {
    items: [],
    hideCheckedItems: false,
    searchTerm: '',

    addItem,
    editItem,
    findById,
    findAndToggleChecked,
    findAndDelete,
    findAndUpdateName,
    toggleCheckedFilter,
    setSearchTerm,
  };
  
}());
