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
        for (var i = 0; i < rows.length; i++) {
          var leasedDeviceXml = leasedDevices.ele("device");
            leasedDeviceXml.ele("id", rows[i].id);
            leasedDeviceXml.ele("deviceId", rows[i].deviceId);
            leasedDeviceXml.ele("leaseDate", rows[i].leaseDate);
            leasedDeviceXml.ele("tippingNumber", rows[i].tippingNumber);
            leasedDeviceXml.ele("collaboratorName", rows[i].collaboratorName);
            leasedDeviceXml.ele("status", rows[i].status);
            leasedDeviceXml.ele("devolutionDate", rows[i].devolutionDate);
        }
  
        res.header("Content-Type", "text/xml");
        (leasedDeviceXml) ? res.send(leasedDeviceXml.end({ pretty: true })) : res.send({});
      });
    });
});

router.post("/", function(req, res, next) {
  db.serialize(function() {
    db.run(
      `INSERT INTO leasedDevices (deviceId, leaseDate, tippingNumber, collaboratorName)  VALUES ('${req.body.deviceId}','${req.body.leaseDate}', '${req.body.tippingNumber}', '${req.body.collaboratorName}');`
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
        var leasedDeviceXml = leasedDevice.ele("leasedDevice");
        leasedDeviceXml.ele("id", row[0].id);
        leasedDeviceXml.ele("deviceId", row[0].deviceId);
        leasedDeviceXml.ele("leaseDate", row[0].leaseDate);
        leasedDeviceXml.ele("tippingNumber", row[0].tippingNumber);
        leasedDeviceXml.ele("collaboratorName", row[0].collaboratorName);
        leasedDeviceXml.ele("status", row[0].status);
        leasedDeviceXml.ele("devolutionDate", row[0].devolutionDate); 
  
        res.header("Content-Type", "text/xml");
        res.send(leasedDeviceXml.end({ pretty: true }));
      });
    });
});

router.put("/:id", function(req, res, next) {
    var leasedDevice = builder.create("leasedDevice", { encoding: "utf-8" });
    leasedDevice.att("xmlns", "http://www.w3.org/2005/Atom");
  
    db.serialize(function() {
      db.run(
        `UPDATE leasedDevices SET status='${req.body.status}' , devolutionDate='${req.body.devolutionDate}' WHERE id = ${req.params.id}`,
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