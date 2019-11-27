const mongoose = require('mongoose');

//importing the celebrities model
const Field = require('../models/field');

const MONGODB_URI = 'mongodb://localhost/Fields-pelada-database';

// Connection to the database "Fields-pelada-database"
mongoose
    .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Connected to Mongo!');
    });

Field.create([{
            name: 'Airfut 53',
            rating: 4.7,
            location: 'Rua 25 de Abril, 10 Prior Velho 2685-368 - Prior Velho',
            photo: '../images/airfut53.jpg',
            lat: 38.7552876,
            lng: -9.1571719
        },
        {
            name: 'UrbanSoccer Lisboa',
            rating: 4.7,
            location: 'Grupo Desportivo Direito, Alto da Boavista, Parque Florestal de Monsanto, 1500-114 Lisboa - Monsanto',
            photo: '../images/UrbanSoccerLisboa.jpg',
            lat: 38.7552876,
            lng: -9.1571719
        },
        {
            name: 'Decathlon Amadora',
            rating: 4.6,
            location: 'Alto da Cabreira, Frente Zona Comercial de Alfragide 2610-017 Amadora - Amadora',
            photo: '../images/decathlonaAmadora.jpg',
            lat: 38.7268884,
            lng: -9.2113177
        },
        {
            name: 'InFoot',
            rating: 4.5,
            location: 'Estr. Mem Martins, Sintra - Sintra',
            photo: '../images/inFootSintra.jpg',
            lat: 38.724106,
            lng: -9.1345574
        },
        {
            name: 'Urban Fut 5',
            rating: 4.7,
            location: 'Estrada das Ligeiras, 34, 2735 - 337, Agualva-Cacém - Cacém',
            photo: '../images/Fut5Cacem.jpg',
            lat: 38.7402301,
            lng: -9.3611037
        }
    ])

    .then(() => {
        console.log('Celebrities was successfully created!');
    })

    .catch(err => {
        console.error('Something when wrong', err)
    })

    .finally(() => {
        mongoose.connection.close();
    });