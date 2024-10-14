//import etmeyi dene ilk require calışmıyor ama importdan sonra calışıyor görünüyor
//import express from 'express';
const { error } = require('console');

const express = require('express');
const axios = require('axios');
const mysql = require('mysql2');
const { createConnection } = require('net');
const { request } = require('http');
const { connect } = require('http2');
const port = 3001;
const app = express();



const dbPool = mysql.createPool({

    host: 'localhost',
    user: 'root',
    password: '',
    database: 'myDatabase'

})


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // İstemcilerin erişim izni
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // İzin verilen HTTP metodları
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // İzin verilen başlık alanları
    res.setHeader('Access-Control-Allow-Credentials', true); // Kimlik doğrulama izinleri (varsa)
    next();
}); 

app.listen(port, () =>{
    console.log('bağlanılan port = ', port);
})

dbPool.getConnection((err,connection)=>{
    if(err){
        console.log('bağlantı hatası', err);
        return
    }
    console.log('baglantı başarılı');
    connection.release();
})

app.get('/titles', async (req, res) => {
    try {
        const sql = 'SELECT * FROM titles';
        dbPool.query(sql, (error, result) => {
            if (error) {
                console.error('hata:', error);
                // alttakı satır ile sunucuya bu mesajı send eder (500) sunucu hatası demektir
                res.status(500).send('sunucu hatası');
            } 
            else {
                res.json(result);
            }
        });
    } catch (error) {
        console.error('hata:', error);
        res.status(500).send('sunucu hatası');
    }
});

app.get('/paragraphs', async(req, res)=>{

    try{
        
        const sql = 'SELECT * FROM paragraphs';
        dbPool.query(sql, (error, result)=>{
            if(error){
                console.error('hata:', error);
                res.status(500).send('sunucu hatası');
            }
            else{
                res.json(result)
            }
        })

    }
    catch(error){
        console.error('hata', error);
        res.status(500).send('sunucu hatası');
    }
})

// app.get() deki res result değil response dir yani yanıtdır
app.get('/images', async(req, res)=>{

    try{
        const sql = 'SELECT * FROM images';
        dbPool.query(sql,(error, result)=>{
            if(error){
                console.error('hata:', error);
                res.status(500).send('sunucu hatası');
            }
            else{
                const images = result.map(row => {
                    return {
                        id: row.id,
                        imageName: row.imageName,
                        image: row.image.toString('base64')
                    };
                });
                res.json(images);
            }
        })
    }
    catch(error){
        console.log('hata',error);
        res.status(500).send('sunucu hatası');
    }
})