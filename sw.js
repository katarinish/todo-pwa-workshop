importScripts('./idb-keyval-iife.min');

//Runs in bg
var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/',
  '/script.js',
  '/register-sw.js',
  '/styles.css',
  '/img/feather-sprite.svg',
  'https://unpkg.com/react@16/umd/react.development.js',
  'https://unpkg.com/react-dom@16/umd/react-dom.development.js',
  'https://unpkg.com/babel-standalone@latest/babel.min.js',
  'https://fonts.googleapis.com/css?family=Roboto'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Cache hit - return response
          if (response) {
            return response;
          }
          return fetch(event.request);
        }
      )
    );
  });

  self.addEventListener('sync', function(event) {
    if (event.tag == 'myFirstSync') {
      event.waitUntil(
        idbKeyval.get('todos').then(function(todos) {
            return idbKeyval.get('todos', function(login) {
                return fetch(SERVER_URL + '/todos/' + login, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                    },
                    body: JSON.stringify(todos)
                }).then(() => {
                    this.fetchTodos()
                    document.getElementById('todoText').value = ''
                }).catch(console.error)
            })
        })
      );
    }
  });
