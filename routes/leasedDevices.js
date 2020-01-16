var express = require("express");
var router = express.Router();
const path = require("path");
const dbPath = path.resolve(__dirname, "../soa.db");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbPath);
var builder = require("xmlbuilder");
let fs = require("fs");

/* GET leased devices listing. */
router.get("/", function(req, res, next) {
    var leasedDevices = builder.create("leasedDevices", { encoding: "utf-8" });
    leasedDevices.att("xmlns", "http://www.w3.org/2005/Atom");
    db.serialize(function() {
      db.all(`SELECT * FROM leasedDevices ORDER BY id ASC`, function(err, rows) {
        console.log(err);
       
        
        var leasedDeviceXml = leasedDevices.ele("leasedDevice");
        if(rows.length){
          for (var i = 0; i < rows.length; i++) {          
            leasedDeviceXml.ele("id", rows[i].id);
            leasedDeviceXml.ele("leaseDate", rows[i].leaseDate);
            leasedDeviceXml.ele("tippingNumber", rows[i].tippingNumber);
            leasedDeviceXml.ele("collaboratorName", rows[i].collaboratorName);
            leasedDeviceXml.ele("status", rows[i].status);
            leasedDeviceXml.ele("devolutionDate", rows[i].devolutionDate);
           
          }
          res.header("Content-Type", "text/xml");
          res.send(leasedDeviceXml.end({ pretty: true }));
        }
        else{
          res.header("Content-Type", "text/xml");
          res.send(leasedDeviceXml.end({ pretty: true }));
        }
      });
    });
});

router.post("/", function(req, res, next) {
  db.serialize(function() {
    db.run(
      `INSERT INTO leasedDevices (leaseDate, tippingNumber, collaboratorName)  VALUES ('${req.body.leaseDate}', '${req.body.tippingNumber}', '${req.body.collaboratorName}');`
    );
    res.send();
  });
});

router.get("/:id", function(req, res, next) {
    var leasedDevice = builder.create("leasedDevice", { encoding: "utf-8" });
    leasedDevice.att("xmlns", "http://www.w3.org/2005/Atom");
  
    db.serialize(function() {
      db.all(`SELECT * FROM leasedDevices WHERE id = ${req.params.id}`, function(
        err,
        row
      ) {
        console.log(row);
        var leasedDeviceXml = leasedDevice.ele("leasedDevice");
        leasedDeviceXml.ele("id", row[0].id);
        leasedDeviceXml.ele("leaseDate", rows[0].leaseDate);
        leasedDeviceXml.ele("tippingNumber", rows[0].tippingNumber);
        leasedDeviceXml.ele("collaboratorName", rows[0].collaboratorName);
        leasedDeviceXml.ele("status", rows[0].status);
        leasedDeviceXml.ele("devolutionDate", rows[0].devolutionDate); 
  
        res.header("Content-Type", "text/xml");
        res.send(leasedDeviceXml.end({ pretty: true }));
      });
    });
});

router.patch("/:id", function(req, res, next) {
    var leasedDevice = builder.create("leasedDevice", { encoding: "utf-8" });
    leasedDevice.att("xmlns", "http://www.w3.org/2005/Atom");
  
    db.serialize(function() {
      db.run(
        `UPDATE leasedDevices SET status='${req.body.status}' , devolutionDate='${req.body.devolutionDate}'}' WHERE id = ${req.params.id}`,
        function(err, row) {
          res.send();
        }
      );      
    });
});

router.delete("/:id", function(req, res, next) {
    var leasedDevice = builder.create("leasedDevice", { encoding: "utf-8" });
    leasedDevice.att("xmlns", "http://www.w3.org/2005/Atom");
  
    db.serialize(function() {
      db.run(`DELETE FROM leasedDevices WHERE id = ${req.params.id}`, function(err, row) {
        res.send();
      });
    });
});

module.exports = router;