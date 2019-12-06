var express = require("express");
var router = express.Router();
const path = require("path");
const dbPath = path.resolve(__dirname, "../soa.db");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbPath);
var builder = require("xmlbuilder");
let fs = require("fs");

/* GET users listing. */
router.get("/", function(req, res, next) {
  var users = builder.create("users", { encoding: "utf-8" });
  users.att("xmlns", "http://www.w3.org/2005/Atom");
  db.serialize(function() {
    db.all(`SELECT * FROM users ORDER BY id ASC`, function(err, rows) {
      for (var i = 0; i < rows.length; i++) {
        var userXml = users.ele("user");
        userXml.ele("id", rows[i].id);
        userXml.ele("name", rows[i].name);
        userXml.ele("email", rows[i].email);
      }

      res.header("Content-Type", "text/xml");
      res.send(userXml.end({ pretty: true }));
    });
  });
});

router.get("/download", function(req, res, next) {
  var users = builder.create("users", { encoding: "utf-8" });
  users.att("xmlns", "http://www.w3.org/2005/Atom");
  db.serialize(function() {
    db.all(`SELECT * FROM users ORDER BY id ASC`, function(err, rows) {
      for (var i = 0; i < rows.length; i++) {
        var userXml = users.ele("user");
        userXml.ele("id", rows[i].id);
        userXml.ele("name", rows[i].name);
        userXml.ele("email", rows[i].email);
      }

      let filename = "users.xml";
      let absPath = path.join(__dirname, "../generated/", filename);
      let relPath = path.join("../generated", filename);
      //res.setHeader('Content-disposition', 'attachment; filename=teste');
      //res.setHeader("Content-Type", "text/xml");
      //res.send(userXml.end({ pretty: true }));

      fs.writeFile(relPath, "File content", err => {
        if (err) {
          console.log(err);
        }
        res.download(absPath, err => {
          if (err) {
            console.log(err);
          }
          fs.unlink(relPath, err => {
            if (err) {
              console.log(err);
            }
            console.log("FILE [" + filename + "] REMOVED!");
          });
        });
      });
    });
  });
});

router.post("/", function(req, res, next) {
  db.serialize(function() {
    db.run(
      `INSERT INTO users (name, email)  VALUES ('${req.body.name}', '${req.body.email}');`
    );
    res.send();
  });
});

router.get("/:id", function(req, res, next) {
  var user = builder.create("user", { encoding: "utf-8" });
  user.att("xmlns", "http://www.w3.org/2005/Atom");

  db.serialize(function() {
    db.all(`SELECT * FROM users WHERE id = ${req.params.id}`, function(
      err,
      row
    ) {
      console.log(row);
      var userXml = user.ele("user");
      userXml.ele("id", row[0].id);
      userXml.ele("name", row[0].name);
      userXml.ele("email", row[0].email);

      res.header("Content-Type", "text/xml");
      res.send(userXml.end({ pretty: true }));
    });
  });
});

router.put("/:id", function(req, res, next) {
  var user = builder.create("user", { encoding: "utf-8" });
  user.att("xmlns", "http://www.w3.org/2005/Atom");

  db.serialize(function() {
    db.run(
      `UPDATE users SET name='${req.body.name}', email='${req.body.email}' WHERE id = ${req.params.id}`,
      function(err, row) {
        res.send();
      }
    );
  });
});

router.delete("/:id", function(req, res, next) {
  var user = builder.create("user", { encoding: "utf-8" });
  user.att("xmlns", "http://www.w3.org/2005/Atom");

  db.serialize(function() {
    db.run(`DELETE FROM users WHERE id = ${req.params.id}`, function(err, row) {
      res.send();
    });
  });
});

module.exports = router;
