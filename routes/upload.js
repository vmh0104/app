var express = require('express');
var router = express.Router();
var multer = require('multer');
const fs = require("fs");
const fastcsv = require("fast-csv");
const mysql = require("mysql2");
const csv = require('csv-parser');
const fileUpload = require('express-fileupload');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });

var upload = multer({ storage: storage });

router.get('/upload', function(req, res, next) {
    res.render('upload', { title: 'Choose File' });
    console.log('Handling GET /upload');    
  });

router.post('/upload',upload.single('filename'), function(req, res, next) {
    console.log('Handling POST /upload');
   

  // Bao cao ket qua

    const csvFilePath = req.file.path;
    const fileName = req.file.originalname;
    let wrongData = [];
    let allData = [];


    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    function isPastDate(dateString) {
        const date = new Date(dateString);
        const currentDate = new Date();
        return date < currentDate;
    }
    const outputCsvFilePath = __dirname + '\\' + 'result.csv';
    fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
        const idValue = row.id !== null && row.id !== undefined && row.id.trim() !== '' ? 'Giá trị chinh xac' : 'Giá trị là null hoặc sai định dạng';
        const userValue = row.user !== null && row.user !== undefined && row.user.trim() !== '' ? 'Giá trị chinh xac' : 'Giá trị là null hoặc sai định dạng';
        const mailValue = row.mail !== null && row.mail !== undefined && row.mail.trim() !== '' && isValidEmail(row.mail)  ? 'Giá trị chinh xac' : 'Giá trị là null hoặc sai định dạng';
        const bodValue = row.bod !== null && row.bod !== undefined && row.bod.trim() !== '' && isPastDate(row.bod)  ? 'Giá trị chinh xac' : 'Giá trị là null hoặc sai định dạng';
        allData = [...allData, { ...row, id: idValue, user: userValue, mail: mailValue, bod: bodValue}];
        if (idValue === 'Giá trị là null hoặc sai định dạng' || userValue === 'Giá trị là null hoặc sai định dạng' || mailValue === 'Giá trị là null hoặc sai định dạng' || bodValue === 'Giá trị là null hoặc sai định dạng') {
            wrongData = [...wrongData,{ ...row, id: idValue, user: userValue, mail: mailValue, bod: bodValue}];
        }
    })

    .on('end', () => {
        const lengthAllData = allData.length; 
        const lengthWrongData = wrongData.length;
        const lengthCorrectData = lengthAllData - lengthWrongData;
        const uploadResult = {
          title2: 'Da import thanh cong file csv, voi ',
          report1: lengthAllData,
          title3: ' du lieu, ',
          report3: lengthCorrectData,
          title4: ' dong thanh cong, ',
          report2: lengthWrongData,
          title5: ' dong that bai voi nhung ly do sau: ',
          wrongData: wrongData,
        };
        res.json(uploadResult);     
    })

    .on('error', (error) => {
        console.error('Error reading CSV file:', error.message);
    });


    
    // const data2 = [];
    // const output2CsvFilePath = __dirname + '\\' + 'data.csv';
    // fs.createReadStream(csvFilePath)
    //   .pipe(csv())
    //   .on('data', (row) => {
    //     const idValue = row.id?.trim() !== '' ? row.id : null;
    //     const userValue = row.user?.trim() !== '' ? row.user : null;
    //     const mailValue =
    //       row.mail?.trim() !== '' && isValidEmail(row.mail) ? row.mail : null;
    //     const bodValue =
    //       row.bod?.trim() !== '' && isPastDate(row.bod) ? row.bod : null;

    //     if (idValue !== null && userValue !== null && mailValue !== null && bodValue !== null) {
    //       data2 = [...data2, { ...row, id: idValue, user: userValue, mail: mailValue, bod: bodValue}];
    //     }
    //   })

    //   .on('end', () => {
    //     console.log('CSV file successfully processed.');
    //     const newCsvContent = data2.map(row => Object.values(row).join(',')).join('\n');
    //     fs.writeFileSync(output2CsvFilePath, newCsvContent);
    //     console.log('New CSV file successfully created:', output2CsvFilePath);
    //     console.log(data2);
    //     const connection = mysql.createConnection({
    //       host: '127.0.0.1',
    //       port: '3306',
    //       user: 'root',
    //       password: 'Vhieu0104',
    //       database: 'exam_database',
    //       insecureAuth: true,
    //     });

    //     connection.connect(error => {
    //       if (error) {
    //         console.error('Error connecting to the database:', error);
    //       } else {
    //         data2.forEach(row => {
    //           let id = parseInt(row.id);
    //           let query = "INSERT INTO exam_info (ID, User, Mail, Bod) VALUES (?, ?, ?, ?)";
    //           let values = [id, row.user, row.mail, row.bod];

    //           connection.query(query, values, (error, response) => {
    //             if (error) {
    //               console.error('Error inserting data into the database:', error);
    //             } else {
    //               console.log('Data inserted successfully!');
    //             }
    //           });
    //         });
    //       }
    //     });
    //   })

    //   .on('error', (error) => {
    //     console.error('Error reading CSV file:', error.message);
    //   });

});


module.exports = router;