var express = require('express');
var router = express.Router();

var builder = require('xmlbuilder');

var usersObj = [
  {id: 1, name: 'fabio', email:'souzace@gmail.com'},
  {id: 2, name: 'marcio', email:'marcio@gmail.com'},
  {id: 3, name: 'lidia', email:'lidia@gmail.com'}
]

var users = builder.create('users', { encoding: 'utf-8' });
    users.att('xmlns', 'http://www.w3.org/2005/Atom');
for(var i = 0; i < usersObj.length; i++) {
  var userXml = users.ele('user');
  userXml.ele('id',  usersObj[i].id );
  userXml.ele('name',  usersObj[i].name);
  userXml.ele('email',  usersObj[i].email);
}
  

/* GET users listing. */
router.get('/', function(req, res, next) {
  //console.log(users);
 res.header('Content-Type', 'text/xml');
 res.send(users.end({ pretty: true}));
});


router.post('/', function(req, res, next) {
  
  var id = usersObj.length + 1;
  usersObj.push({
    id: id,
    name: req.body.name,
    email: req.body.email,  
  });

  console.log(usersObj);
  res.send({
    id: id,
    name: req.body.name,
    email: req.body.email,  
  }); 
});


router.get('/:id', function(req, res, next) {
  
  var user = builder.create('user', { encoding: 'utf-8' });
  user.att('xmlns', 'http://www.w3.org/2005/Atom');
  
  var userObj = usersObj.filter(function(userFilter) {
    return userFilter.id == req.params.id;
  });

  var userXml = user.ele('user');
  userXml.ele('id',  userObj[0].id );
  userXml.ele('name',  userObj[0].name);
  userXml.ele('email',  userObj[0].email);

  //console.log(userObj);

 res.header('Content-Type', 'text/xml');
 res.send(userXml.end({ pretty: true}));
});

module.exports = router;
