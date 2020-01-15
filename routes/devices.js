var express = require("express");
var router = express.Router();
const path = require("path");
const dbPath = path.resolve(__dirname, "../soa.db");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbPath);
var builder = require("xmlbuilder");
let fs = require("fs");

/* GET devices listing. */
  router.get("/", function(req, res, next) {
    var devices = builder.create("devices", { encoding: "utf-8" });
    devices.att("xmlns", "http://www.w3.org/2005/Atom");
    db.serialize(function() {
      db.all(`SELECT * FROM devices ORDER BY id ASC`, function(err, rows) {
        for (var i = 0; i < rows.length; i++) {
          var deviceXml = devices.ele("device");
          deviceXml.ele("id", rows[i].id);
          deviceXml.ele("tippingNumber", rows[i].tippingNumber);
          deviceXml.ele("type", rows[i].type);
          deviceXml.ele("name", rows[i].name);
          deviceXml.ele("maker", rows[i].maker);
          deviceXml.ele("model", rows[i].model);
          deviceXml.ele("operatingSystem", rows[i].operatingSystem);
        }
  
        res.header("Content-Type", "text/xml");
        res.send(deviceXml.end({ pretty: true }));
      });
    });
  });

  router.post("/", function(req, res, next) {
    db.serialize(function() {
      db.run(
        `INSERT INTO devices (tippingNumber, type, name, maker, model, operatingSystem)  
            VALUES ('${req.body.tippingNumber}', '${req.body.type}', '${req.body.name}', '${req.body.maker}', '${req.body.model}', '${req.body.operatingSystem}');`
      );
      res.send();
    });
  });

  router.get("/:id", function(req, res, next) {
    var device = builder.create("device", { encoding: "utf-8" });
    device.att("xmlns", "http://www.w3.org/2005/Atom");
  
    db.serialize(function() {
      db.all(`SELECT * FROM devices WHERE id = ${req.params.id}`, function(
        err,
        row
      ) {
        console.log(row);
        var deviceXml = device.ele("device");
        deviceXml.ele("id", row[0].id);
        deviceXml.ele("tippingNumber", rows[0].tippingNumber);
        deviceXml.ele("type", rows[0].type);
        deviceXml.ele("name", rows[0].name);
        deviceXml.ele("maker", rows[0].maker);
        deviceXml.ele("model", rows[0].model);
        deviceXml.ele("operatingSystem", rows[0].operatingSystem);  
  
        res.header("Content-Type", "text/xml");
        res.send(deviceXml.end({ pretty: true }));
      });
    });
  });

  router.put("/:id", function(req, res, next) {
    var device = builder.create("device", { encoding: "utf-8" });
    device.att("xmlns", "http://www.w3.org/2005/Atom");
  
    db.serialize(function() {
      db.run(
        `UPDATE devices SET tippingNumber='${req.body.tippingNumber}', type='${req.body.type}' , name='${req.body.name}' , maker='${req.body.maker}' , model='${req.body.model}' , operatingSystem='${req.body.operatingSystem}' WHERE id = ${req.params.id}`,
        function(err, row) {
          res.send();
        }
      );
    });
  });

  router.delete("/:id", function(req, res, next) {
    var device = builder.create("device", { encoding: "utf-8" });
    device.att("xmlns", "http://www.w3.org/2005/Atom");
  
    db.serialize(function() {
      db.run(`DELETE FROM devices WHERE id = ${req.params.id}`, function(err, row) {
        res.send();
      });
    });
  });
  
  module.exports = router;
  