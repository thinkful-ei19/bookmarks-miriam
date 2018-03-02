// eslint-disable-next-line no-unused-vars
'use strict';
const api = (function () {
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/miriam/bookmarks';

  const getItems = function (callback) {
    $.getJSON(
      BASE_URL,
      (response) => {
        callback(response);
      });
  };

  const createItem = function(bookmark, callback) {
    console.log('before stringify bookmark=', bookmark);
    const newBookmark = JSON.stringify(bookmark);
    console.log("after stringify", newBookmark);
    $.ajax({
      url: BASE_URL,
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: newBookmark,
      success: callback 
    });

  };

  return {
    getItems,
    createItem,

  };
}());
