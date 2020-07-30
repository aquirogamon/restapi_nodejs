// PORT
process.env.PORT = process.env.PORT || 3000;

// ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// BASE DE DATOS
let urlDB;
// if (process.env.NODE_ENV === 'dev') {
//     urlDB = 'mongodb://localhost:27017/apiCafe';
// } else {
urlDB = 'mongodb+srv://aquirogamon:nrcu2F6TXna1dueF@cluster0.z2yfw.mongodb.net/apiCafe';
// }

process.env.URLDB = urlDB;