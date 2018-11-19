'use strict';
/*
* Copyright IBM Corp All Rights Reserved
*
* SPDX-License-Identifier: Apache-2.0
*/
/*
 * Enroll the admin user
 */

var Fabric_Client = require('fabric-client');
var Fabric_CA_Client = require('fabric-ca-client');

var path = require('path');
var util = require('util');
var os = require('os');

//
var fabric_client = new Fabric_Client();
var fabric_ca_client = null;
var user = null;
var store_path = path.join(__dirname, 'hfc-key-store');
console.log(' Store path:' + store_path);

// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
Fabric_Client.newDefaultKeyValueStore({
    path: store_path
}).then((state_store) => {
    // assign the store to the fabric client
    fabric_client.setStateStore(state_store);
    var crypto_suite = Fabric_Client.newCryptoSuite();
    // use the same location for the state store (where the users' certificate are kept)
    // and the crypto store (where the users' keys are kept)
    var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
    crypto_suite.setCryptoKeyStore(crypto_store);
    fabric_client.setCryptoSuite(crypto_suite);
    var tlsOptions = {
        trustedRoots: [],
        verify: false
    };
    // be sure to change the http to https when the CA is running TLS enabled
    fabric_ca_client = new Fabric_CA_Client('http://localhost:7054', tlsOptions, 'ca.tracexyz.com', crypto_suite);

    // first check to see if the admin is already enrolled
    return fabric_client.getUserContext('user_admin', true);
}).then((user_from_store) => {
    if (user_from_store && user_from_store.isEnrolled()) {
        console.log('Successfully loaded user from persistence');
        user = user_from_store;


        return null;
    } else {
        // need to enroll it with CA server
        return fabric_ca_client.enroll({
            enrollmentID: 'user_admin',
            enrollmentSecret: 'SECRET'
        }).then((enrollment) => {
            console.log(enrollment);
            console.log('Successfully enrolled user "user_admin"');
            return fabric_client.createUser(
                {
                    username: 'user_admin',
                    mspid: 'Org1MSP',
                    cryptoContent: {privateKeyPEM: enrollment.key.toBytes(), signedCertPEM: enrollment.certificate}
                });
        }).then((user1) => {
            user = user1;
            //let affiliationService = fabric_ca_client.newAffiliationService();
            //console.log('AFF');
            //return affiliationService.create({name: "org1.admin",force: true}, user)
            //return affiliationService.getAll(user);


            return fabric_client.setUserContext(user);
        }).then((aff_service_resp) => {
            console.log('AFFC');
            console.log(aff_service_resp)

        }).catch((err) => {
            console.error('Failed to enroll and persist admin. Error: ' + err.stack ? err.stack : err);
            throw new Error('Failed to enroll admin');
        });
    }
}).then(() => {
    console.log('Assigned the admin user to the fabric client ::' + user.toString());
}).catch((err) => {
    console.error('Failed to enroll admin: ' + err);
});
