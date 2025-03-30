import express from 'express';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import session from 'express-session';
import fetch from 'node-fetch';
let port = 3000;

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//initialize session variable
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  //   cookie: { secure: true }
}))

//setting up database connection pool
// current tables: artists, users, favorites
// artists: artistId, geniusId, firstName, lastName
// users: userId, username, password
// favorites: userId, artistId
const pool = mysql.createPool({
  host: "tyler-pruitt.site",
  user: "tylerpru_projectuser",
  password: "simplepassword",
  database: "tylerpru_allartists",
  connectionLimit: 10,
  waitForConnections: true
});
const conn = await pool.getConnection();

/* 















*/


//code snippet for genius api
const clientId = 'dJ0HOTe7sXnIBVwBCiLE_wUMV2oEPEEI0ln4f0v6jgkn9_EqijdZ_hu3UM1jvIhC';
const clientSecret = '14kfTAByYlu52LvSXkJyTqULVN4d9Gh4k8d-kJHDo-jZMrxgx611UzYxKcy2hFqwVZ1Mq-UhvXo7oVaoJiXHNQ';
const authUrl = 'https://api.genius.com/oauth/token';
const authHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded',
  Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
};
const authData = {
  grant_type: 'client_credentials',
};
const authToken = await fetch(authUrl, {
  method: 'POST',
  headers: authHeaders,
  body: new URLSearchParams(authData),
}).then((response) => response.json()).then((data) => data.access_token);







// //variable to contain artist name for both searches
// let artistFirstName = "Sabrina";
// let artistLastName = "Capenter";
// let artist = artistFirstName + " " + artistLastName;

// //genius api search based on artist name
// const searchTerm = artist;
// const searchUrl = `https://api.genius.com/search?q=${encodeURIComponent(searchTerm)}`;
// const searchHeaders = {
//   Authorization: `Bearer ${authToken}`,
// };
// const searchResults = await fetch(searchUrl, {
//   headers: searchHeaders,
// }).then((response) => response.json()).then((data) => data.response.hits);


// //gets song information based off of first search result
// const songId = searchResults[0].result.id;
// const songUrl = `https://api.genius.com/songs/${songId}`;
// const songHeaders = {
//   Authorization: `Bearer ${authToken}`,
// };
// const songData = await fetch(songUrl, {
//   headers: songHeaders,
// }).then((response) => response.json()).then((data) => data.response.song);

//display Genius search results
// for(let i = 0; i < songData.writer_artists.length; i++){
//   console.log(songData.writer_artists[i].name);
//   console.log(songData.writer_artists[i].id);
// }


// const artistId = 1421;
// const artistUrl = `https://api.genius.com/artists/${artistId}`;
// const artistHeaders = {
//   Authorization: `Bearer ${authToken}`,
// };
// const artistData = await fetch(artistUrl, {
//   headers: artistHeaders,
// }).then((response) => response.json()).then((data) => data.response.artist);
// console.log(artistData);



//code snippet for spotify api
import { SpotifyApi } from "@spotify/web-api-ts-sdk";

// console.log("Searching Spotify for The Beatles...");

const api = SpotifyApi.withClientCredentials(
    "d7f2d23bd9634f63929e00d682231010",
    "23078e3cfa8a4d1087efb62fb7ae1109"
);


//search for artist and display name, followers, and popularity as well as similar for similar artists in a table

// const items = await api.search(artist, ["artist"]);

// console.table(items.artists.items.map((item) => ({
//     name: item.name,
//     id: item.id
// })));



//sample code for getting artist information from spotify
// const item = await api.artists.get("0OdUWJ0sBjDrqHygGUXeCF");
// console.log(item);
//information avaialable from spotify: given id: 0OdUWJ0sBjDrqHygGUXeCF
// {
//   external_urls: { spotify: 'https://open.spotify.com/artist/0OdUWJ0sBjDrqHygGUXeCF' },
//   followers: { href: null, total: 1021900 },
//   genres: [
//     'chamber pop',
//     'indie folk',
//     'indie rock',
//     'indietronica',
//     'modern rock',
//     'seattle indie',
//     'stomp and holler'
//   ],
//   href: 'https://api.spotify.com/v1/artists/0OdUWJ0sBjDrqHygGUXeCF?locale=*',
//   id: '0OdUWJ0sBjDrqHygGUXeCF',
//   images: [
//     {
//       url: 'https://i.scdn.co/image/ab6761610000e5ebde20f1d3bdfc3239a770921c',
//       height: 640,
//       width: 640
//     },
//     {
//       url: 'https://i.scdn.co/image/ab67616100005174de20f1d3bdfc3239a770921c',
//       height: 320,
//       width: 320
//     },
//     {
//       url: 'https://i.scdn.co/image/ab6761610000f178de20f1d3bdfc3239a770921c',
//       height: 160,
//       width: 160
//     }
//   ],
//   name: 'Band of Horses',
//   popularity: 61,
//   type: 'artist',
//   uri: 'spotify:artist:0OdUWJ0sBjDrqHygGUXeCF'
// }

//sample code for getting top tracks from spotify
// const tracks = await api.artists.topTracks("0OdUWJ0sBjDrqHygGUXeCF");
// console.log(tracks.tracks[0]);
// This provides:
// {
//   album: {
//     album_type: 'album',
//     artists: [ [Object] ],
//     available_markets: [
//       'AR', 'AU', 'AT', 'BE', 'BO', 'BR', 'BG', 'CA', 'CL', 'CO',
//       'CR', 'CY', 'CZ', 'DK', 'DO', 'DE', 'EC', 'EE', 'SV', 'FI',
//       'FR', 'GR', 'GT', 'HN', 'HK', 'HU', 'IS', 'IE', 'IT', 'LV',
//       'LT', 'LU', 'MY', 'MT', 'MX', 'NL', 'NZ', 'NI', 'NO', 'PA',
//       'PY', 'PE', 'PH', 'PL', 'PT', 'SG', 'SK', 'ES', 'SE', 'CH',
//       'TW', 'TR', 'UY', 'US', 'GB', 'AD', 'LI', 'MC', 'ID', 'JP',
//       'TH', 'VN', 'RO', 'IL', 'ZA', 'SA', 'AE', 'BH', 'QA', 'OM',
//       'KW', 'EG', 'MA', 'DZ', 'TN', 'LB', 'JO', 'PS', 'IN', 'BY',
//       'KZ', 'MD', 'UA', 'AL', 'BA', 'HR', 'ME', 'MK', 'RS', 'SI',
//       'KR', 'BD', 'PK', 'LK', 'GH', 'KE', 'NG', 'TZ', 'UG', 'AG',
//       ... 85 more items
//     ],
//     external_urls: {
//       spotify: 'https://open.spotify.com/album/7ik4rjxOnmwnAWWzjj5ni3'
//     },
//     href: 'https://api.spotify.com/v1/albums/7ik4rjxOnmwnAWWzjj5ni3',
//     id: '7ik4rjxOnmwnAWWzjj5ni3',
//     images: [ [Object], [Object], [Object] ],
//     is_playable: true,
//     name: 'Everything All The Time',
//     release_date: '2006-03-21',
//     release_date_precision: 'day',
//     total_tracks: 10,
//     type: 'album',
//     uri: 'spotify:album:7ik4rjxOnmwnAWWzjj5ni3'
//   },
//   artists: [
//     {
//       external_urls: [Object],
//       href: 'https://api.spotify.com/v1/artists/0OdUWJ0sBjDrqHygGUXeCF',
//       id: '0OdUWJ0sBjDrqHygGUXeCF',
//       name: 'Band of Horses',
//       type: 'artist',
//       uri: 'spotify:artist:0OdUWJ0sBjDrqHygGUXeCF'
//     }
//   ],
//   available_markets: [
//     'AR', 'AU', 'AT', 'BE', 'BO', 'BR', 'BG', 'CA', 'CL', 'CO',
//     'CR', 'CY', 'CZ', 'DK', 'DO', 'DE', 'EC', 'EE', 'SV', 'FI',
//     'FR', 'GR', 'GT', 'HN', 'HK', 'HU', 'IS', 'IE', 'IT', 'LV',
//     'LT', 'LU', 'MY', 'MT', 'MX', 'NL', 'NZ', 'NI', 'NO', 'PA',
//     'PY', 'PE', 'PH', 'PL', 'PT', 'SG', 'SK', 'ES', 'SE', 'CH',
//     'TW', 'TR', 'UY', 'US', 'GB', 'AD', 'LI', 'MC', 'ID', 'JP',
//     'TH', 'VN', 'RO', 'IL', 'ZA', 'SA', 'AE', 'BH', 'QA', 'OM',
//     'KW', 'EG', 'MA', 'DZ', 'TN', 'LB', 'JO', 'PS', 'IN', 'BY',
//     'KZ', 'MD', 'UA', 'AL', 'BA', 'HR', 'ME', 'MK', 'RS', 'SI',
//     'KR', 'BD', 'PK', 'LK', 'GH', 'KE', 'NG', 'TZ', 'UG', 'AG',
//     ... 85 more items
//   ],
//   disc_number: 1,
//   duration_ms: 322173,
//   explicit: false,
//   external_ids: { isrc: 'USSUB0669004' },
//   external_urls: { spotify: 'https://open.spotify.com/track/5lRzWDEe7UuedU2QPsFg0K' },
//   href: 'https://api.spotify.com/v1/tracks/5lRzWDEe7UuedU2QPsFg0K',
//   id: '5lRzWDEe7UuedU2QPsFg0K',
//   is_local: false,
//   is_playable: true,
//   name: 'The Funeral',
//   popularity: 68,
//   preview_url: null,
//   track_number: 4,
//   type: 'track',
//   uri: 'spotify:track:5lRzWDEe7UuedU2QPsFg0K'
// }




//sampe code for artist information from genius
// const artistId = artistId;
// const artistUrl = `https://api.genius.com/artists/${artistId}`;
// const artistHeaders = {
//   Authorization: `Bearer ${authToken}`,
// };

// const artistData = await fetch(artistUrl, {
//   headers: artistHeaders,
// }).then((response) => response.json()).then((data) => data.response.artist);
//information available from genius: given id: 1421
// {
//   alternate_names: [ 'Kendrick Duckworth', 'Kendrick Lamar Duckworth', 'K-Dot' ],
//   api_path: '/artists/1421',
//   description: { dom: { tag: 'root', children: [Array] } },
//   facebook_name: 'kendricklamar',
//   followers_count: 0,
//   header_image_url: 'https://images.genius.com/1d39f4a8c2906db0e696e5cc4427fa92.300x300x1.png',
//   id: 1421,
//   image_url: 'https://images.genius.com/43c7fc30a6d9fd31b239bb47cf1533f4.1000x1000x1.png',
//   instagram_name: 'kendricklamar',
//   is_meme_verified: true,
//   is_verified: true,
//   name: 'Kendrick Lamar',
//   translation_artist: false,
//   twitter_name: 'kendricklamar',
//   url: 'https://genius.com/artists/Kendrick-lamar',
//   current_user_metadata: {
//     permissions: [ 'view_activity_stream', 'view_discography' ],
//     excluded_permissions: [
//       'edit',
//       'edit_images',
//       'edit_names',
//       'edit_anything',
//       'merge',
//       'sort_artist_songs',
//       'follow',
//       'view_contribution_opportunities',
//       'edit_translation_artist',
//       'see_short_id'
//     ],
//     interactions: { following: false }
//   },
//   iq: 62748,
//   description_annotation: {
//     _type: 'referent',
//     annotator_id: 1057,
//     annotator_login: 'dragon191',
//     api_path: '/referents/6927681',
//     classification: 'accepted',
//     fragment: 'Kendrick Lamar',
//     id: 6927681,
//     is_description: true,
//     path: '/6927681/Kendrick-lamar/Kendrick-lamar',
//     range: { content: 'Kendrick Lamar' },
//     song_id: null,
//     url: 'https://genius.com/6927681/Kendrick-lamar/Kendrick-lamar',
//     verified_annotator_ids: [],
//     annotatable: {
//       api_path: '/artists/1421',
//       context: null,
//       id: 1421,
//       image_url: 'https://images.genius.com/43c7fc30a6d9fd31b239bb47cf1533f4.1000x1000x1.png',
//       link_title: 'Kendrick Lamar',
//       title: 'Kendrick Lamar',
//       type: 'Artist',
//       url: 'https://genius.com/artists/Kendrick-lamar'
//     },
//     annotations: [ [Object] ]
//   },
//   user: {
//     api_path: '/users/117985',
//     avatar: {
//       tiny: [Object],
//       thumb: [Object],
//       small: [Object],
//       medium: [Object]
//     },
//     header_image_url: 'https://images.genius.com/1d39f4a8c2906db0e696e5cc4427fa92.300x300x1.png',
//     human_readable_role_for_display: 'Verified Artist',
//     id: 117985,
//     iq: 62748,
//     login: 'KendrickLamar',
//     name: 'Kendrick Lamar',
//     role_for_display: 'verified_artist',
//     url: 'https://genius.com/KendrickLamar',
//     current_user_metadata: {
//       permissions: [],
//       excluded_permissions: [Array],
//       interactions: [Object]
//     }
//   }
// }

//needed info from Genius: name, image_url, url? , album, top tracks
//needed info from Spotify: genres, external_urls, href



//routes
app.get('/', (req, res) => {
  res.render('login' , { usernameMessage: "", passwordMessage: "" });
});

//login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  let passwordHash = "";

  let sql = "SELECT * FROM users WHERE username = ?";
  const [rows] = await conn.query(sql, username);


  if (rows.length > 0) {
    passwordHash = rows[0].password;
  } else {
    res.render('login', { usernameMessage: "Username does not exist", passwordMessage: "" });
  }
  let match = await bcrypt.compare(password, passwordHash);
  if (match) {
    //set session variables
    req.session.userId = rows[0].userId;
    req.session.username = rows[0].username;
    req.session.authenticated = true;

    //get info for and redirect to home page
    let artists = await getBasicArtistInfo(req, res);
    res.render('home' , { username: req.session.username, artistsList: artists });
  } else {
    res.render('login', { usernameMessage: "", passwordMessage: "Incorrect password"});
  }
});

//logout route
app.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

//create account page route
app.get('/createAccount', (req, res) => {
  res.render('createAccount' , { usernameMessage: "", passwordMessage: "", repeatPasswordMessage: "" });
});

//create account functionality, leads to home page if successful, else reloads create account page with error message
app.post('/createAccount', async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let repeatpassword = req.body.repeatPassword;
  
  //check for empty fields
  if (username.length < 1) {
    res.render('createAccount', { usernameMessage: "Username must not be empty", passwordMessage: "", repeatPasswordMessage: "" });
  }
  if (password.length < 1) {
    res.render('createAccount', { passwordMessage: "Password must not be empty", usernameMessage: "", repeatPasswordMessage: "" });
  }
  //check to ensure username will fit in database
  if(username.length > 15){
    res.render('createAccount', { usernameMessage: "Username must be less than 15 characters", passwordMessage: "", repeatPasswordMessage: "" });
  }
  //check to ensure password and repeat password match
  if (password === repeatpassword) {
    //check to see if username already exists
    let sql = "SELECT * FROM users WHERE username = ?";
    const [rows] = await conn.query(sql, [username]);
    
    if (rows.length > 0) {
      res.render('createAccount', { usernameMessage: "Username already exists", passwordMessage: "", repeatPasswordMessage: "" });
    } else {
      //check to ensure password is at least 8 characters
      if (password.length < 8) {
        res.render('createAccount', { passwordMessage: "Password must be at least 8 characters", usernameMessage: "", repeatPasswordMessage: "" });
      } else {
        //hash password and insert into database
        let hash = await bcrypt.hash(password, 10);
        sql = "INSERT INTO users (username, password) VALUES (?, ?)";
        await conn.query(sql, [username, hash]);

        //get user id and set session variables
        sql = "SELECT * FROM users WHERE username = ?";
        const [rows] = await conn.query(sql, username);
        req.session.userId = rows[0].userId;
        req.session.username = username;
        req.session.authenticated = true;

        //get info for and redirect to home page
        let artists = await getBasicArtistInfo(req, res);
        res.render('home', { username: req.session.username, artistsList: artists});
      }
    }
  } else {
    res.render('createAccount', { repeatPasswordMessage: "Passwords do not match", usernameMessage: "", passwordMessage: "" });
  }
});

app.get('/artistinfo/:artistId', isAuthenticated, async (req, res) => {
  const artistId = req.params.artistId;
  let sql = "SELECT * FROM artists WHERE artistId = ?";
  const [rows] = await conn.query(sql, artistId);
  let artist = rows[0];
  
  //get artist info from genius

  const artistUrl = `https://api.genius.com/artists/${artist.geniusId}`;
  const artistHeaders = {Authorization: `Bearer ${authToken}`,};
  const geniusItem = await fetch(artistUrl, {
    headers: artistHeaders,
  }).then((response) => response.json()).then((data) => data.response.artist);
  

  //get artist info from spotify
  const spotifyItem = await api.artists.get(artist.spotifyId);
  const spotifyTopTracks = await api.artists.topTracks(artist.spotifyId);
  const spotifyAlbums = await api.artists.albums(artist.spotifyId);

  //uncomment these if you need more info on what you can get from the api's
  // console.log(geniusItem);
  // console.log(spotifyItem);
  // console.log(spotifyTopTracks);
  // console.log(spotifyAlbums);
  
  //compiled artist info
  //just do artistInfo. and then one of these fields to get that information
  //for the albums and tracks, there is some extra information you can get by extending like artistInfo.spotifyTopTracks[0].name and so on, 
  //there's relevant documentation above
  let artistInfo = {
    artistId: artistId,
    geniusInfo: geniusItem,
    spotifyArtistInfo: spotifyItem,
    spotifyTopTracksInfo: spotifyTopTracks,
    spotifyAlbumsInfo: spotifyAlbums
  }
 
  // console.log(artistInfo.geniusInfo.name); this is an example if you run the code, you will see the given information
  //console.log(artistInfo);// this is an example if you run the code, you will see the given information
 // console.log(artistInfo.geniusInfo.description_annotation.annotations);

  res.render('artistinfo', { username: req.session.username, artistInfo: artistInfo });
});


//add artist to favorites
app.post('/addFavorite', isAuthenticated, async (req, res) => {
  let artistId = req.body.artistId;
  let sql = "SELECT * FROM favorites WHERE userId = ? AND artistId = ?";
  const [rows] = await conn.query(sql, [req.session.userId, artistId]);
  if (rows.length > 0) {
    sql = "DELETE FROM favorites WHERE userId = ? AND artistId = ?";
    await conn.query(sql, [req.session.userId, artistId]);
  }else{
    sql = "INSERT INTO favorites (userId, artistId) VALUES (?, ?)";
    await conn.query(sql, [req.session.userId, artistId]);
  }
  res.redirect('/artistinfo/' + artistId);
});

app.post('/removeFavorite', isAuthenticated, async (req, res) => {
  let artistId = req.body.artistId;
  let sql = "SELECT * FROM favorites WHERE userId = ? AND artistId = ?";
  const [rows] = await conn.query(sql, [req.session.userId, artistId]);
  if (rows.length > 0) {
    sql = "DELETE FROM favorites WHERE userId = ? AND artistId = ?";
    await conn.query(sql, [req.session.userId, artistId]);
  }
  res.redirect('/favorites');
});




//home page route, checks for authentication
app.get('/home', isAuthenticated, async (req, res) => {
  let artists = await getBasicArtistInfo(req, res);
  res.render('home', { username: req.session.username, artistsList: artists });
});







//I dont know if this page is even needed alongside favorites??
app.get('/profile', isAuthenticated, (req, res) => {
  res.render('profile', { username: req.session.username });
});









app.get('/favorites', isAuthenticated, async (req, res) => {
  //get favorites from database
  let sql = "SELECT * FROM favorites WHERE userId = ?";
  const [rows] = await conn.query(sql, req.session.userId);

  //get artist info from database
  sql = "SELECT * FROM artists WHERE artistId = ?";
  let artists = [];
  for(let i = 0; i < rows.length; i++){
    artists.push(await conn.query(sql, rows[i].artistId));
  }
 
  
  //get artist info from genius
  let favorites = [];
  for(let i = 0; i < artists.length; i++){
    let geniusItem = await fetch(`https://api.genius.com/artists/${artists[i][0][0].geniusId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }).then((response) => response.json()).then((data) => data.response.artist);
    let artist = {
      name: geniusItem.name,
      image_url: geniusItem.image_url,
      artistId: rows[i].artistId
    }
    favorites.push(artist);
  }

  res.render('favorites', { username: req.session.username,favoritesList: favorites });
});



//functions
function isAuthenticated(req, res, next) {
  if (req.session.authenticated) {
    return next();
  }
  res.redirect('/');
}

async function getBasicArtistInfo(req, res) {
  let sql = "SELECT * FROM artists";
  const [rows] = await conn.query(sql);
  let artists = [];
  for(let i = 0; i < rows.length; i++){
    let geniusItem = await fetch(`https://api.genius.com/artists/${rows[i].geniusId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }).then((response) => response.json()).then((data) => data.response.artist);
    let artist = {
      name: geniusItem.name,
      image_url: geniusItem.image_url,
      artistId: rows[i].artistId
    }
    artists.push(artist);
  }
  return artists;
}



app.listen(port, () => {
  console.log("Express server running")
})