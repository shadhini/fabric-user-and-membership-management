var shell = require('shelljs');
var cmd = require('node-run-cmd');

var set_ca_home = function () {
    // shell.exec('export PATH=$PATH:~/go/bin;');
    // shell.exec('cd $HOME/go/bin/');
    cmd.run()
    console.log('ca home set')
};

var add_id = function (username, password, affiliation, maxEnroll, attributes, type ){
    command = 'fabric-ca-client identity add ' + username + ' --secret ' + password;
    if (type){
        command = command + ' --type ' + type;
    }
    if(affiliation){
        command = command + ' --affiliation ' + affiliation;
    }
    if(maxEnroll){
        command = command + ' --maxenrollments ' + maxEnroll;
    }
    if(attributes){
        command = command + ' --attrs ' + attributes;
    }
    console.log(command);
    set_ca_home();
    return shell.exec(command);
}

exports.set_ca_home = set_ca_home;
exports.add_id = add_id;
