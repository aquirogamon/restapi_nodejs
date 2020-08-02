// PORT
process.env.PORT = process.env.PORT || 3000;

// ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// CADUCIDAD DE TOKEN (60 s, 60 m, 24 h y 30 d)
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// SEED DE TOKEN
process.env.SEED_TOKEN = process.env.SEED_TOKEN || 'seed-desarrollo';

// BASE DE DATOS
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/apiCafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// Google Clien ID
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '299453216967-k4efjaq0mp5p3qob1hav7khf81adierm.apps.googleusercontent.com';