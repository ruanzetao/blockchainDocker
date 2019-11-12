const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const { IdCard } = require('composer-common');
const AdminConnection = require('composer-admin').AdminConnection;
const chalk = require('chalk');

let adminConnection = new AdminConnection();

async function createDoctor(data){
    console.log("start creating a new participant");
    let businessNetworkConnection = new BusinessNetworkConnection();

    try{
        console.log(data.personId);
        const definition = await businessNetworkConnection.connect('admin@tutorial-network');
        let participantRegistry = await businessNetworkConnection.getParticipantRegistry('org.basic.server.Doctor');
        let factory = definition.getFactory();
        //define information of a user
        let participant = factory.newResource('org.basic.server', 'Doctor', data.personId);
        participant.name = data.name;
        participant.address = data.address;
        participant.email = data.email;
        participant.phone = data.phone;
        participant.identityCardNumber = data.identityCardNumber;
        participant.sex = data.sex;
        participant.birthday = data.birthday;
        participant.createAt = data.createAt;
        participant.updateAt = data.updateAt;

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

async function createDoctorIdentity(){
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

async function createPatientIdentity(){
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

module.exports={
    createDoctor,createDoctorIdentity,createPatientIdentity,importCard,exportCard,deleteCard
}