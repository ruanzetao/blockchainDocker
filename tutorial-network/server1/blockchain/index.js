const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const { IdCard } = require('composer-common');
const AdminConnection = require('composer-admin').AdminConnection;
const chalk = require('chalk');

let adminConnection = new AdminConnection();

async function createDoctor(data){
    console.log("start creating a new participant");
    let businessNetworkConnection = new BusinessNetworkConnection();

    try{
        //console.log(data.personId);
        const definition = await businessNetworkConnection.connect('admin@tutorial-network');
        let participantRegistry = await businessNetworkConnection.getParticipantRegistry('org.basic.server.Doctor');
        let doctor =participantRegistry.get(data.identityCardNumber);
        let factory = definition.getFactory();
        //define information of a user
        let participant = factory.newResource('org.basic.server', 'Doctor', data.identityCardNumber);
        participant.personId = data.identityCardNumber;
        participant.name = data.name;
        participant.address = data.address;
        participant.email = data.email;
        participant.phone = data.phone;
        //participant.identityCardNumber = data.identityCardNumber;
        participant.sex = data.sex;
        //participant.birthday = data.birthday;
        //participant.createAt = data.createAt;
        //participant.updateAt = data.updateAt;

        //add a new participant to business network
        await participantRegistry.add(participant);

        //disconect admin card
        await businessNetworkConnection.disconnect();
        console.log("Add participant successfully");
        return 1;
    }catch (error) {
        //error: trung id card
        console.error(error);
        return 0;
        // process.exit(1);
    }
}

async function createDoctorInfo(data){
    console.log("start creating a new doctor info");
    let businessNetworkConnection = new BusinessNetworkConnection();

    try{
        //console.log(data.personId);
        const definition = await businessNetworkConnection.connect('admin@tutorial-network');
        //let participantRegistry = await businessNetworkConnection.getParticipantRegistry('org.basic.server.Doctor');
           
        let results=await businessNetworkConnection.query('selectAllDoctorInfo');
        let count=results.length;
        let doctorInfoId=count+1;
        console.log("doctorInfoId: "+doctorInfoId);
        let assetRegistry= await businessNetworkConnection.getAssetRegistry('org.basic.server.DoctorInfo');    
        let factory = definition.getFactory();
        //define information of a user
        let doctorInfo = factory.newResource('org.basic.server', 'DoctorInfo', doctorInfoId.toString());
        doctorInfo.doctorId = data.identityCardNumber;
        doctorInfo.name = data.name;
        doctorInfo.address = data.address;
        doctorInfo.email = data.email;
        doctorInfo.phone = data.phone;
        doctorInfo.identityCardNumber = data.identityCardNumber;
        doctorInfo.sex = data.sex;
        doctorInfo.specialist = data.specialist;
        doctorInfo.authorizedPatients=[];
        doctorInfo.marriageStatus = data.marriageStatus;
        doctorInfo.tittle = data.tittle;

        var owner = await factory.newRelationship("org.basic.server", "Doctor", data.doctorId);

        doctorInfo.owner = owner;

        //add a new participant to business network
        await assetRegistry.add(doctorInfo);

        //disconect admin card
        await businessNetworkConnection.disconnect();
        console.log("Add doctor info successfully");
        return 1;
    }catch (error) {
        //error: trung id card
        console.error(error);
        return 0;
        // process.exit(1);
    }
}



async function createPatient(data){
    console.log("start creating a new participant");
    let businessNetworkConnection = new BusinessNetworkConnection();

    try{
        //console.log(data.personId);
        const definition = await businessNetworkConnection.connect('admin@tutorial-network');
        let participantRegistry = await businessNetworkConnection.getParticipantRegistry('org.basic.server.Patient');
        let factory = definition.getFactory();
        //define information of a user
        let participant = factory.newResource('org.basic.server', 'Patient', data.identityCardNumber);
        participant.personId = data.identityCardNumber;
        participant.name = data.name;
        participant.address = data.address;
        participant.email = data.email;
        participant.phone = data.phone;
        //participant.identityCardNumber = data.identityCardNumber;
        participant.sex = data.sex;
        //participant.birthday = data.birthday;
        //participant.createAt = data.createAt;
        //participant.updateAt = data.updateAt;

        //add a new participant to business network
        await participantRegistry.add(participant);

        //disconect admin card
        await businessNetworkConnection.disconnect();
        console.log("Add participant successfully");
        return 1;
    }catch (error) {
        //error: trung id card
        console.error(error);
        return 0;
        // process.exit(1);
    }
}

async function createDoctorIdentity(participantId){
    console.log(chalk.cyan.bold.inverse('Start issue new Identity!'));
    let businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect('admin@tutorial-network');
    const participantNS = 'org.basic.server.Doctor#' + participantId;
    const result = await businessNetworkConnection.issueIdentity(participantNS, participantId);
    console.log(`userID = ${result.userID}`);
    console.log(`userSecret = ${result.userSecret}`);
    let metadata = {
        userName: result.userID,
        version: 1,
        enrollmentSecret: result.userSecret,
        businessNetwork: "tutorial-network"
    };
    // let metadata = {version: 1, userName: 'muntasir',enrollmentSecret: "abcarete",businessNetwork: "mybusiness"};
    let connectionprofile = {
        "name": "hlfv1",
        "x-type": "hlfv1",
        "x-commitTimeout": 300,
        "version": "1.0.0",
        "client": {
            "organization": "Org1",
            "connection": {
                "timeout": {
                    "peer": {
                        "endorser": "300",
                        "eventHub": "300",
                        "eventReg": "300"
                    },
                    "orderer": "300"
                }
            }
        },
        "channels": {
            "composerchannel": {
                "orderers": ["orderer.example.com"],
                "peers": {
                    "peer0.org1.example.com": {}
                }
            }
        },
        "organizations": {
            "Org1": {
                "mspid": "Org1MSP",
                "peers": ["peer0.org1.example.com"],
                "certificateAuthorities": ["ca.org1.example.com"]
            }
        },
        "orderers": {
            "orderer.example.com": {
                "url": "grpc://localhost:7050"
            }
        },
        "peers": {
            "peer0.org1.example.com": {
                "url": "grpc://localhost:7051"
            }
        },
        "certificateAuthorities": {
            "ca.org1.example.com": {
                "url": "http://localhost:7054",
                "caName": "ca.org1.example.com"
            }
        }
    };

    const newIdCard = new IdCard(metadata, connectionprofile);

    const directoryPath = `/home/ruanzetao/.composer/cards/${participantId}@tutorial-network`;

    await newIdCard.toDirectory(directoryPath);
    console.log('new card created');
    businessNetworkConnection.disconnect();
    console.log(chalk.green.bold.inverse('Issue new identity successful!'));
}

async function createPatientIdentity(participantId){
    console.log(chalk.cyan.bold.inverse('Start issue new Identity!'));
    let businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect('admin@tutorial-network');
    const participantNS = 'org.basic.server.Patient#' + participantId;
    const result = await businessNetworkConnection.issueIdentity(participantNS, participantId);
    console.log(`userID = ${result.userID}`);
    console.log(`userSecret = ${result.userSecret}`);
    let metadata = {
        userName: result.userID,
        version: 1,
        enrollmentSecret: result.userSecret,
        businessNetwork: "tutorial-network"
    };
    // let metadata = {version: 1, userName: 'muntasir',enrollmentSecret: "abcarete",businessNetwork: "mybusiness"};
    let connectionprofile = {
        "name": "hlfv1",
        "x-type": "hlfv1",
        "x-commitTimeout": 300,
        "version": "1.0.0",
        "client": {
            "organization": "Org1",
            "connection": {
                "timeout": {
                    "peer": {
                        "endorser": "300",
                        "eventHub": "300",
                        "eventReg": "300"
                    },
                    "orderer": "300"
                }
            }
        },
        "channels": {
            "composerchannel": {
                "orderers": ["orderer.example.com"],
                "peers": {
                    "peer0.org1.example.com": {}
                }
            }
        },
        "organizations": {
            "Org1": {
                "mspid": "Org1MSP",
                "peers": ["peer0.org1.example.com"],
                "certificateAuthorities": ["ca.org1.example.com"]
            }
        },
        "orderers": {
            "orderer.example.com": {
                "url": "grpc://localhost:7050"
            }
        },
        "peers": {
            "peer0.org1.example.com": {
                "url": "grpc://localhost:7051"
            }
        },
        "certificateAuthorities": {
            "ca.org1.example.com": {
                "url": "http://localhost:7054",
                "caName": "ca.org1.example.com"
            }
        }
    };

    const newIdCard = new IdCard(metadata, connectionprofile);

    const directoryPath = `/home/ruanzetao/.composer/cards/${participantId}@tutorial-network`;

    await newIdCard.toDirectory(directoryPath);
    console.log('new card created');
    businessNetworkConnection.disconnect();
    console.log(chalk.green.bold.inverse('Issue new identity successful!'));
}

async function ping(cardName){
    let businessNetworkConnection = new BusinessNetworkConnection();
    return businessNetworkConnection.connect(cardName).then(() => {
        return businessNetworkConnection.ping();
    }).then((result) => {
        console.log(`participant = ${result.participant ? result.participant : '<no participant found>'}`);
        return businessNetworkConnection.disconnect();
    }).catch((error) => {
        console.error(error);
        // process.exit(1);
    });
}

async function importCard(cardName, cardData) {
    console.log(chalk.cyan.bold.inverse('Start import a new card!'));
    try {
        await adminConnection.connect('admin@tutorial-network');
        await adminConnection.importCard(cardName, cardData);
        console.log(chalk.green.bold.inverse('Card is imported!'));
        await adminConnection.disconnect();
        // process.exit();
        console.log(chalk.green.bold.inverse('Add new card successful!'));
    } catch (error) {
        console.log(chalk.red.bold(error))
    }
}

async function exportCard(cardName) {
    console.log(chalk.green.bold.inverse('Start export card ' + cardName));
    try {
        await adminConnection.connect('admin@tutorial-network');
        const cardData = await adminConnection.exportCard(cardName);
        console.log(chalk.green.bold.inverse(`Card name ${cardName} is exported!`));
        return cardData;
    } catch (error) {
        console.log(chalk.red.bold(error));
    }
}

async function deleteCard(cardName) {
    console.log(chalk.cyan.bold.inverse('Start delete card!' + cardName));
    try {
        await adminConnection.connect('admin@tutorial-network');
        await adminConnection.deleteCard(cardName);
        console.log(chalk.green.bold.inverse('Card is deleted!'));
        await adminConnection.disconnect();
        // process.exit();
        // console.log(chalk.green.bold.inverse('Add new card successful!'));
    } catch (error) {
        console.log(chalk.red.bold(error))
    }
}

async function getDoctor(cardName) {
    console.log("start get Doctor");

    let businessNetworkConnection = new BusinessNetworkConnection();

    try {
        // await businessNetworkConnection.connect('3@identity');
        await businessNetworkConnection.connect(cardName);
        let participantRegistry = await businessNetworkConnection.getParticipantRegistry('org.basic.server.Doctor');


        //add a new participant to business network
        var result = await participantRegistry.getAll();

        //disconect admin card
        await businessNetworkConnection.disconnect();
        // console.log(result);
        var user = {
            email: result[0].email,
            role: 'Doctor',
            name: result[0].name,
            address: result[0].address,
            phone: result[0].phone,
            sex: result[0].sex,
            identityCardNumber: result[0].identityCardNumber
        };
        console.log(user);
        return user;
    } catch (error) {
        //error: trung id card
        console.error(error);
        // process.exit(1);
    }
}

async function getPatient(cardName) {
    console.log("start get Doctor");

    let businessNetworkConnection = new BusinessNetworkConnection();

    try {
        // await businessNetworkConnection.connect('3@identity');
        await businessNetworkConnection.connect(cardName);
        let participantRegistry = await businessNetworkConnection.getParticipantRegistry('org.basic.server.Patient');


        //add a new participant to business network
        var result = await participantRegistry.getAll();

        //disconect admin card
        await businessNetworkConnection.disconnect();
        // console.log(result);
        var user = {
            email: result[0].email,
            role: 'Patient',
            name: result[0].name,
            address: result[0].address,
            phone: result[0].phone,
            sex: result[0].sex,
            identityCardNumber: result[0].identityCardNumber
        };
        console.log(user);
        return user;
    } catch (error) {
        //error: trung id card
        console.error(error);
        // process.exit(1);
    }
}

async function getDoctorById(id, onSucess) {
    console.log("start get doctor by id");

    let businessNetworkConnection = new BusinessNetworkConnection();

    try {
        // await businessNetworkConnection.connect('3@identity');
        await businessNetworkConnection.connect("admin@tutorial-network");
        let participantRegistry = await businessNetworkConnection.getParticipantRegistry('org.basic.server.Doctor');


        //add a new participant to business network
        var result = await participantRegistry.get(id)

        //disconect admin card
        await businessNetworkConnection.disconnect();
        // console.log(result);
        var user = {
            email: result.email,
            role: 'Doctor',
            name: result.name,
            address: result.address,
            phone: result.phone,
            sex: result.sex,
            identityCardNumber: result.identityCardNumber
        };
        console.log(user);
        onSucess({ data: user});
        return ;
    } catch (error) {
        await businessNetworkConnection.disconnect();
        var user = {
            idCardNumber: "",
            fullname: "",
            dateOfBirth: "",
            email: "",
            country: "",
            address: "",
            phoneNumber: ""
        };
        onSucess({ data: user});
        return;
        // process.exit(1);
    }
}

async function getPatientById(id, onSucess) {
    console.log("start get doctor by id");

    let businessNetworkConnection = new BusinessNetworkConnection();

    try {
        // await businessNetworkConnection.connect('3@identity');
        await businessNetworkConnection.connect("admin@tutorial-network");
        let participantRegistry = await businessNetworkConnection.getParticipantRegistry('org.basic.server.Patient');


        //add a new participant to business network
        var result = await participantRegistry.get(id)

        //disconect admin card
        await businessNetworkConnection.disconnect();
        // console.log(result);
        var user = {
            email: result.email,
            role: 'Patient',
            name: result.name,
            address: result.address,
            phone: result.phone,
            sex: result.sex,
            identityCardNumber: result.identityCardNumber
        };
        console.log(user);
        onSucess({ data: user});
        return ;
    } catch (error) {
        await businessNetworkConnection.disconnect();
        var user = {
            idCardNumber: "",
            fullname: "",
            dateOfBirth: "",
            email: "",
            country: "",
            address: "",
            phoneNumber: ""
        };
        onSucess({ data: user});
        return;
        // process.exit(1);
    }
}

async function countDoctorInfo(data){
    console.log("start creating a new participant");
    let businessNetworkConnection = new BusinessNetworkConnection();

    try{
        //console.log(data.personId);
        const definition = await businessNetworkConnection.connect('admin@tutorial-network');
        let assetRegistry= await businessNetworkConnection.getAssetRegistry('org.basic.server.DoctorInfo');
         
        let results=await businessNetworkConnection.query('selectAllDoctorInfo');
        let count=results.length;

        //disconect admin card
        await businessNetworkConnection.disconnect();
        console.log("Add participant successfully");
        return count;
    }catch (error) {
        //error: trung id card
        console.error(error);
        return 0;
        // process.exit(1);
    }
}



module.exports={
    createDoctor,createPatient,createDoctorIdentity,createPatientIdentity,importCard,exportCard,deleteCard,ping,getDoctor,getPatient,getDoctorById
    ,getPatientById,createDoctorInfo,countDoctorInfo
}