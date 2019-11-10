const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const { IdCard } = require('composer-common');
const AdminConnection = require('composer-admin').AdminConnection;
const chalk = require('chalk');

let adminConnection = new AdminConnection();

async function createDoctor(data){
    console.log("start creating a new participant");
    let businessNetworkConnection = new BusinessNetworkConnection();

    try{
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

module.exports={
    createDoctor
}