const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'myDatabase'
});

// images klasörü için yol
const imagesFolder = path.join(__dirname, 'images');

/* fs.readdir(imagesFolder,(err, files)=>{

    if(err){
        console.log('hata');
    }
    else{
        console.log(`path: ${files.toString()}`)
    }

}) */


// images klasörünü kontrol et ve resimleri kaydet
fs.readdir(imagesFolder, (err, files) => {
    if (err) throw err;

    let remainingFiles = files.length; // Kalan dosya sayısını tutar

    files.forEach((file) => {
        const imgPath = path.join(imagesFolder, file);

        var imgName = String(file);
        
        // Resmin veritabanında olup olmadığını kontrol et
        db.query('SELECT * FROM images WHERE image = ?', [imgPath], (err, results) => {
            if (err) {
                console.error('Veritabanı sorgusu sırasında hata oluştu:', err);
                return;
            }

            if (results.length > 0) {
                console.log(`Resim ${imgPath} zaten veritabanında mevcut.`);
                remainingFiles--;

                if (remainingFiles === 0) {
                    db.end((err) => {
                        if (err) {
                            console.error('Bağlantı kapatılırken hata oluştu:', err);
                        } else {
                            console.log('Veritabanı bağlantısı başarıyla kapatıldı.');
                        }
                    });
                }
            } else {
                //  kayıt işlemi
                db.query('INSERT INTO images (image,imageName) VALUES (?, ?)', [imgPath,imgName], (err, result) => {
                    if (err) {
                        console.error('Resim kaydedilirken hata oluştu:', err);
                    } else {
                        console.log(`Resim ${imgPath} başarıyla kaydedildi.`);
                    }

                    remainingFiles--;  

                    //  dosyalar işlendiğinde bağlantıyı kapat
                    if (remainingFiles === 0) {
                        db.end((err) => {
                            if (err) {
                                console.error('Bağlantı kapatılırken hata oluştu:', err);
                            } else {
                                console.log('Veritabanı bağlantısı başarıyla kapatıldı.');
                            }
                        });
                    }
                });
            }
        });
    });
});
