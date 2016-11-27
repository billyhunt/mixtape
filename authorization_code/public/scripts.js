  (function() {

      var audio = new Audio();
    var spotifyApi = new SpotifyWebApi();


        /**
         * Obtains parameters from the hash of the URL
         * @return Object
         */
        function getHashParams() {
          var hashParams = {};
          var e, r = /([^&;=]+)=?([^&;]*)/g,
              q = window.location.hash.substring(1);
          while ( e = r.exec(q)) {
             hashParams[e[1]] = decodeURIComponent(e[2]);
          }
          return hashParams;
        }


      function playPlaylist() {
          var uri = this.attr('uri');
          console.log(uri);
      }

        var userProfileSource = document.getElementById('user-profile-template').innerHTML,
            userProfileTemplate = Handlebars.compile(userProfileSource),
            userProfilePlaceholder = document.getElementById('user-profile');

        var oauthSource = document.getElementById('oauth-template').innerHTML,
            oauthTemplate = Handlebars.compile(oauthSource),
            oauthPlaceholder = document.getElementById('oauth');

        var params = getHashParams();

        var access_token = params.access_token,
            refresh_token = params.refresh_token,
            error = params.error;
        window.contextVars = {
          access_token: access_token,
          spotifyApi: spotifyApi
        };


      var spotifyApi = new SpotifyWebApi();
      spotifyApi.setAccessToken(window.contextVars.access_token);
      spotifyApi.getUserPlaylists()  // note that we don't pass a user id
          .then(function(data) {
              var $userPlaylists = $('.user-playlists');
              for (var i=0; i < data.items.length; i++) {
                  var item = data.items[i];
                  $userPlaylists.append('<a class="playlist-link" href="#" uri="' + item.uri + '">' + item.name + '</a></br>');
              }

          }, function(err) {
              console.error(err);
          });


      if (error) {
          alert('There was an error during the authentication');
        } else {
          if (access_token) {
            // render oauth info
            oauthPlaceholder.innerHTML = oauthTemplate({
              access_token: access_token,
              refresh_token: refresh_token
            });

            $.ajax({
                url: 'https://api.spotify.com/v1/me',
                headers: {
                  'Authorization': 'Bearer ' + access_token
                },
                success: function(response) {
                  userProfilePlaceholder.innerHTML = userProfileTemplate(response);

                  $('#login').hide();
                  $('#loggedin').show();
                }
            });
          } else {
              // render initial screen
              $('#login').show();
              $('#loggedin').hide();
          }

          $(document).ready(function() {
              $('.playlist-link').click(function() { console.log(this)});

          });

          document.getElementById('obtain-new-token').addEventListener('click', function() {
            $.ajax({
              url: '/refresh_token',
              data: {
                'refresh_token': refresh_token
              }
            }).done(function(data) {
              access_token = data.access_token;
                window.contextVars.access_token = data.access_token
                oauthPlaceholder.innerHTML = oauthTemplate({
                access_token: access_token,
                refresh_token: refresh_token
              });
            });
          }, false);

          document.getElementById('get-user-playlists').addEventListener('click', function() {


          }, false);
        }
      })();