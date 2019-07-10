(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict'; // Reload client for Chrome Apps & Extensions.
// The reload client has a compatibility with livereload.
// WARNING: only supports reload command.

var LIVERELOAD_HOST = 'localhost:';
var LIVERELOAD_PORT = 35729;
var connection = new WebSocket('ws://' + LIVERELOAD_HOST + LIVERELOAD_PORT + '/livereload');
var lastReload = false;
chrome.runtime.onInstalled.addListener(function (details) {
  lastReload = Date.now();
});

connection.onerror = function (error) {
  console.log('reload connection got error:', error);
};

connection.onmessage = function (e) {
  if (e.data) {
    var data = JSON.parse(e.data);

    if (data && data.command === 'reload') {
      var currentTime = Date.now();

      if (lastReload && currentTime - lastReload > 60000) {
        // don't reload more than once a minute
        chrome.runtime.reload();
        chrome.developerPrivate.reload(chrome.runtime.id, {
          failQuietly: true
        });
      }
    }
  }
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc2NyaXB0cy5iYWJlbC9jaHJvbWVyZWxvYWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxhLENBRUE7QUFDQTtBQUNBOztBQUVBLElBQU0sZUFBZSxHQUFHLFlBQXhCO0FBQ0EsSUFBTSxlQUFlLEdBQUcsS0FBeEI7QUFDQSxJQUFNLFVBQVUsR0FBRyxJQUFJLFNBQUosQ0FBYyxVQUFVLGVBQVYsR0FBNEIsZUFBNUIsR0FBOEMsYUFBNUQsQ0FBbkI7QUFFQSxJQUFJLFVBQVUsR0FBRyxLQUFqQjtBQUVBLE1BQU0sQ0FBQyxPQUFQLENBQWUsV0FBZixDQUEyQixXQUEzQixDQUF1QyxVQUFTLE9BQVQsRUFBa0I7QUFDdkQsRUFBQSxVQUFVLEdBQUcsSUFBSSxDQUFDLEdBQUwsRUFBYjtBQUNELENBRkQ7O0FBSUEsVUFBVSxDQUFDLE9BQVgsR0FBcUIsVUFBQSxLQUFLLEVBQUk7QUFDNUIsRUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLDhCQUFaLEVBQTRDLEtBQTVDO0FBQ0QsQ0FGRDs7QUFJQSxVQUFVLENBQUMsU0FBWCxHQUF1QixVQUFBLENBQUMsRUFBSTtBQUMxQixNQUFJLENBQUMsQ0FBQyxJQUFOLEVBQVk7QUFDVixRQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBTCxDQUFXLENBQUMsQ0FBQyxJQUFiLENBQWI7O0FBQ0EsUUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE9BQUwsS0FBaUIsUUFBN0IsRUFBdUM7QUFDckMsVUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUwsRUFBbEI7O0FBQ0EsVUFBSSxVQUFVLElBQUksV0FBVyxHQUFHLFVBQWQsR0FBMkIsS0FBN0MsRUFBb0Q7QUFDekQ7QUFDQSxRQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWUsTUFBZjtBQUNBLFFBQUEsTUFBTSxDQUFDLGdCQUFQLENBQXdCLE1BQXhCLENBQStCLE1BQU0sQ0FBQyxPQUFQLENBQWUsRUFBOUMsRUFDVTtBQUFDLFVBQUEsV0FBVyxFQUFFO0FBQWQsU0FEVjtBQUVNO0FBQ0Y7QUFDRjtBQUNGLENBYkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIndXNlIHN0cmljdCc7XG5cbi8vIFJlbG9hZCBjbGllbnQgZm9yIENocm9tZSBBcHBzICYgRXh0ZW5zaW9ucy5cbi8vIFRoZSByZWxvYWQgY2xpZW50IGhhcyBhIGNvbXBhdGliaWxpdHkgd2l0aCBsaXZlcmVsb2FkLlxuLy8gV0FSTklORzogb25seSBzdXBwb3J0cyByZWxvYWQgY29tbWFuZC5cblxuY29uc3QgTElWRVJFTE9BRF9IT1NUID0gJ2xvY2FsaG9zdDonO1xuY29uc3QgTElWRVJFTE9BRF9QT1JUID0gMzU3Mjk7XG5jb25zdCBjb25uZWN0aW9uID0gbmV3IFdlYlNvY2tldCgnd3M6Ly8nICsgTElWRVJFTE9BRF9IT1NUICsgTElWRVJFTE9BRF9QT1JUICsgJy9saXZlcmVsb2FkJyk7XG5cbnZhciBsYXN0UmVsb2FkID0gZmFsc2U7XG5cbmNocm9tZS5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKGZ1bmN0aW9uKGRldGFpbHMpIHtcbiAgbGFzdFJlbG9hZCA9IERhdGUubm93KCk7XG59KTsgICAgXG5cbmNvbm5lY3Rpb24ub25lcnJvciA9IGVycm9yID0+IHtcbiAgY29uc29sZS5sb2coJ3JlbG9hZCBjb25uZWN0aW9uIGdvdCBlcnJvcjonLCBlcnJvcik7XG59O1xuXG5jb25uZWN0aW9uLm9ubWVzc2FnZSA9IGUgPT4ge1xuICBpZiAoZS5kYXRhKSB7XG4gICAgY29uc3QgZGF0YSA9IEpTT04ucGFyc2UoZS5kYXRhKTtcbiAgICBpZiAoZGF0YSAmJiBkYXRhLmNvbW1hbmQgPT09ICdyZWxvYWQnKSB7XG4gICAgICB2YXIgY3VycmVudFRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgaWYgKGxhc3RSZWxvYWQgJiYgY3VycmVudFRpbWUgLSBsYXN0UmVsb2FkID4gNjAwMDApIHtcblx0Ly8gZG9uJ3QgcmVsb2FkIG1vcmUgdGhhbiBvbmNlIGEgbWludXRlXG5cdGNocm9tZS5ydW50aW1lLnJlbG9hZCgpO1xuXHRjaHJvbWUuZGV2ZWxvcGVyUHJpdmF0ZS5yZWxvYWQoY2hyb21lLnJ1bnRpbWUuaWQsIFxuXHRcdFx0XHQgICAgICAge2ZhaWxRdWlldGx5OiB0cnVlfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG4iXX0=
