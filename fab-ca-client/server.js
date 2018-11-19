var express = require('express');
var bodyParser = require('body-parser');

var traceXYZ = require('./controller/channel/traceXYZchannel');

var fabric_ca_client = require('./scripts/fabric-ca/fabric-ca-client')

var app = express(); 

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/', function(req, res) {
   res.render('pages/index');
});


// -----------------------TraceXYZ Channel----------------------------------------------------------------
app.get('/channel', function(req, res) {
    res.render('pages/channel', {page: "default"});
});

app.get('/channel/register-user', function(req, res){
    res.render('pages/channel', {page: "register-user"});
});

app.get('/channel/add-spec', function(req, res){
    res.render('pages/channel', {page: "add-spec"});
});

app.post('/channel/register-user', function(req, res){
    var msg = traceXYZ.registerUser(req.body.user, req.body.field_path, req.body.quota);
    res.render('pages/channel', {page: "response", message: msg});
});

app.post('/channel/add-spec', function(req, res){
    var msg = traceXYZ.addSpecification(req.body.path_to_spec, req.body.spec_name);
    res.render('pages/channel', {page: "response", message: msg});
});


// ----------------------Fabric CA Server----------------------------------------------------------------
app.get('/ca-server', function(req, res) {
    res.render('pages/ca-server', {page: "default"});
});

app.get('/ca-server/enroll', function(req, res) {
    res.render('pages/ca-server', {page: "enroll"});
});

app.get('/ca-server/register', function(req, res) {
    res.render('pages/ca-server', {page: "register"});
});

app.get('/ca-server/re-enroll', function(req, res) {
    res.render('pages/ca-server', {page: "re-enroll"});
});

app.get('/ca-server/revoke', function(req, res) {
    res.render('pages/ca-server', {page: "revoke"});
});


app.get('/ca-server/identity/add', function(req, res) {
    res.render('pages/ca-server', {page: "id_add"});
});


app.post('/ca-server/identity/add', function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    var affiliation = req.params.affiliation;
    var maxEnroll = req.params.maxEnroll;
    var attributes = req.params.attributes;
    var type = req.params.type;
    // console.log('username:' + username);
    // console.log('password:' + password);
    res = fabric_ca_client.add_id(username, password, affiliation, maxEnroll, attributes, type);
    console.log(res);
});

app.use(function(req, res, next){
    res.render('pages/page_not_found');
});


app.listen(8080);