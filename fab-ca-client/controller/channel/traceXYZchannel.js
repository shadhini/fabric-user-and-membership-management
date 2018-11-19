var shell = require('shelljs');

//quota is a number
var registerUser = function(user, field_path, quota ){
    //dummy1.js
    var response = shell.exec('node ./scripts/AdminScripts/RegisterUser.js ' + user + ' ' + field_path + ' ' + quota);
    return extract_info(response);
};

var addSpecification = function(path_to_spec, spec_name){
    //dummy2.js
    var response = shell.exec( 'node ./scripts/AdminScripts/AddSpecification.js ' + path_to_spec + ' ' + spec_name);
    return extract_info(response);
};

var extract_info = function(response){
    if(response.stdout.length > 1){
        return {status: "success", msg: response.stdout};
    }else if (response.stderr.length > 1){
        return {status: "fail", msg: response.stderr};
    }
};
exports.registerUser = registerUser;
exports.addSpecification = addSpecification;