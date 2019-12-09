const BusinessNetworkConnection = require("composer-client")
  .BusinessNetworkConnection;
const { IdCard } = require("composer-common");
const AdminConnection = require("composer-admin").AdminConnection;
const chalk = require("chalk");

let adminConnection = new AdminConnection();

async function createDoctor(data) {
  console.log("start creating a new participant");
  let businessNetworkConnection = new BusinessNetworkConnection();

  try {
    //console.log(data.personId);
    const definition = await businessNetworkConnection.connect(
      "admin@tutorial-network"
    );
    let participantRegistry = await businessNetworkConnection.getParticipantRegistry(
      "org.basic.server.Doctor"
    );
    //let doctor =participantRegistry.get(data.identityCardNumber);
    let factory = definition.getFactory();
    //define information of a user
    let participant = factory.newResource(
      "org.basic.server",
      "Doctor",
      data.identityCardNumber
    );
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
  } catch (error) {
    //error: trung id card
    console.log(error);
    return 0;
    // process.exit(1);
  }
}

async function createDoctorInfo(data) {
  console.log("start creating a new doctor info");
  let businessNetworkConnection = new BusinessNetworkConnection();

  try {
    //console.log(data.personId);
    const definition = await businessNetworkConnection.connect(
      "admin@tutorial-network"
    );
    //let participantRegistry = await businessNetworkConnection.getParticipantRegistry('org.basic.server.Doctor');

    // let results=await businessNetworkConnection.query('selectAllDoctorInfo');
    // let count=results.length;
    // let doctorInfoId=count+1;

    let assetRegistry = await businessNetworkConnection.getAssetRegistry(
      "org.basic.server.DoctorInfo"
    );
    let factory = definition.getFactory();
    //define information of a user
    let doctorInfo = factory.newResource(
      "org.basic.server",
      "DoctorInfo",
      data.identityCardNumber
    );
    doctorInfo.doctorId = data.identityCardNumber;
    doctorInfo.name = data.name;
    doctorInfo.address = data.address;
    doctorInfo.email = data.email;
    doctorInfo.phone = data.phone;
    doctorInfo.identityCardNumber = data.identityCardNumber;
    doctorInfo.sex = data.sex;
    doctorInfo.specialist = data.specialist;
    doctorInfo.authorizedDoctors = [];
    doctorInfo.authorizedPatients = [];
    doctorInfo.marriageStatus = data.marriageStatus;
    doctorInfo.tittle = data.tittle;

    var owner = await factory.newRelationship(
      "org.basic.server",
      "Doctor",
      data.identityCardNumber
    );

    doctorInfo.owner = owner;

    //add a new participant to business network
    await assetRegistry.add(doctorInfo);

    //disconect admin card
    await businessNetworkConnection.disconnect();
    console.log("Add doctor info successfully");
    return 1;
  } catch (error) {
    //error: trung id card
    console.error(error);
    return 0;
    // process.exit(1);
  }
}

async function createPatient(data) {
  console.log("start creating a new participant");
  let businessNetworkConnection = new BusinessNetworkConnection();

  try {
    //console.log(data.personId);
    const definition = await businessNetworkConnection.connect(
      "admin@tutorial-network"
    );
    let participantRegistry = await businessNetworkConnection.getParticipantRegistry(
      "org.basic.server.Patient"
    );
    let factory = definition.getFactory();
    //define information of a user
    let participant = factory.newResource(
      "org.basic.server",
      "Patient",
      data.identityCardNumber
    );
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
  } catch (error) {
    //error: trung id card
    console.error(error);
    return 0;
    // process.exit(1);
  }
}

async function createPatientInfo(data) {
  console.log("start creating a new patient info");
  let businessNetworkConnection = new BusinessNetworkConnection();

  try {
    //console.log(data.personId);
    const definition = await businessNetworkConnection.connect(
      "admin@tutorial-network"
    );
    //let participantRegistry = await businessNetworkConnection.getParticipantRegistry('org.basic.server.Doctor');

    // let results=await businessNetworkConnection.query('selectAllPatientInfo');
    // let count=results.length;
    // let patientInfoId=count+1;

    let assetRegistry = await businessNetworkConnection.getAssetRegistry(
      "org.basic.server.PatientInfo"
    );
    let factory = definition.getFactory();
    //define information of a user
    let patientInfo = factory.newResource(
      "org.basic.server",
      "PatientInfo",
      data.identityCardNumber
    );
    patientInfo.patientId = data.identityCardNumber;
    patientInfo.name = data.name;
    patientInfo.address = data.address;
    patientInfo.email = data.email;
    patientInfo.phone = data.phone;
    patientInfo.identityCardNumber = data.identityCardNumber;
    patientInfo.sex = data.sex;
    patientInfo.career = data.career;
    patientInfo.authorizedDoctors = [];
    patientInfo.marriageStatus = data.marriageStatus;

    var owner = await factory.newRelationship(
      "org.basic.server",
      "Patient",
      data.identityCardNumber
    );

    patientInfo.owner = owner;

    //add a new participant to business network
    await assetRegistry.add(patientInfo);

    //disconect admin card
    await businessNetworkConnection.disconnect();
    console.log("Add patient info successfully");
    return 1;
  } catch (error) {
    //error: trung id card
    console.error(error);
    return 0;
    // process.exit(1);
  }
}

async function createDoctorIdentity(participantId) {
  console.log(chalk.cyan.bold.inverse("Start issue new Identity!"));
  let businessNetworkConnection = new BusinessNetworkConnection();
  await businessNetworkConnection.connect("admin@tutorial-network");
  const participantNS = "org.basic.server.Doctor#" + participantId;
  const result = await businessNetworkConnection.issueIdentity(
    participantNS,
    participantId
  );
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
    name: "hlfv1",
    "x-type": "hlfv1",
    "x-commitTimeout": 300,
    version: "1.0.0",
    client: {
      organization: "Org1",
      connection: {
        timeout: {
          peer: {
            endorser: "300",
            eventHub: "300",
            eventReg: "300"
          },
          orderer: "300"
        }
      }
    },
    channels: {
      composerchannel: {
        orderers: ["orderer.example.com"],
        peers: {
          "peer0.org1.example.com": {}
        }
      }
    },
    organizations: {
      Org1: {
        mspid: "Org1MSP",
        peers: ["peer0.org1.example.com"],
        certificateAuthorities: ["ca.org1.example.com"]
      }
    },
    orderers: {
      "orderer.example.com": {
        url: "grpc://localhost:7050"
      }
    },
    peers: {
      "peer0.org1.example.com": {
        url: "grpc://localhost:7051"
      }
    },
    certificateAuthorities: {
      "ca.org1.example.com": {
        url: "http://localhost:7054",
        caName: "ca.org1.example.com"
      }
    }
  };

  const newIdCard = new IdCard(metadata, connectionprofile);

  const directoryPath = `/home/ruanzetao/.composer/cards/${participantId}@tutorial-network`;

  await newIdCard.toDirectory(directoryPath);
  console.log("new card created");
  businessNetworkConnection.disconnect();
  console.log(chalk.green.bold.inverse("Issue new identity successful!"));
}

async function createPatientIdentity(participantId) {
  console.log(chalk.cyan.bold.inverse("Start issue new Identity!"));
  let businessNetworkConnection = new BusinessNetworkConnection();
  await businessNetworkConnection.connect("admin@tutorial-network");
  const participantNS = "org.basic.server.Patient#" + participantId;
  const result = await businessNetworkConnection.issueIdentity(
    participantNS,
    participantId
  );
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
    name: "hlfv1",
    "x-type": "hlfv1",
    "x-commitTimeout": 300,
    version: "1.0.0",
    client: {
      organization: "Org1",
      connection: {
        timeout: {
          peer: {
            endorser: "300",
            eventHub: "300",
            eventReg: "300"
          },
          orderer: "300"
        }
      }
    },
    channels: {
      composerchannel: {
        orderers: ["orderer.example.com"],
        peers: {
          "peer0.org1.example.com": {}
        }
      }
    },
    organizations: {
      Org1: {
        mspid: "Org1MSP",
        peers: ["peer0.org1.example.com"],
        certificateAuthorities: ["ca.org1.example.com"]
      }
    },
    orderers: {
      "orderer.example.com": {
        url: "grpc://localhost:7050"
      }
    },
    peers: {
      "peer0.org1.example.com": {
        url: "grpc://localhost:7051"
      }
    },
    certificateAuthorities: {
      "ca.org1.example.com": {
        url: "http://localhost:7054",
        caName: "ca.org1.example.com"
      }
    }
  };

  const newIdCard = new IdCard(metadata, connectionprofile);

  const directoryPath = `/home/ruanzetao/.composer/cards/${participantId}@tutorial-network`;

  await newIdCard.toDirectory(directoryPath);
  console.log("new card created");
  businessNetworkConnection.disconnect();
  console.log(chalk.green.bold.inverse("Issue new identity successful!"));
}

async function ping(cardName) {
  let businessNetworkConnection = new BusinessNetworkConnection();
  return businessNetworkConnection
    .connect(cardName)
    .then(() => {
      return businessNetworkConnection.ping();
    })
    .then(result => {
      console.log(
        `participant = ${
          result.participant ? result.participant : "<no participant found>"
        }`
      );
      return businessNetworkConnection.disconnect();
    })
    .catch(error => {
      console.error(error);
      // process.exit(1);
    });
}

async function importCard(cardName, cardData) {
  console.log(chalk.cyan.bold.inverse("Start import a new card!"));
  try {
    await adminConnection.connect("admin@tutorial-network");
    await adminConnection.importCard(cardName, cardData);
    console.log(chalk.green.bold.inverse("Card is imported!"));
    await adminConnection.disconnect();
    // process.exit();
    console.log(chalk.green.bold.inverse("Add new card successful!"));
  } catch (error) {
    console.log(chalk.red.bold(error));
  }
}

async function exportCard(cardName) {
  console.log(chalk.green.bold.inverse("Start export card " + cardName));
  try {
    await adminConnection.connect("admin@tutorial-network");
    const cardData = await adminConnection.exportCard(cardName);
    console.log(chalk.green.bold.inverse(`Card name ${cardName} is exported!`));
    return cardData;
  } catch (error) {
    console.log(chalk.red.bold(error));
  }
}

async function deleteCard(cardName) {
  console.log(chalk.cyan.bold.inverse("Start delete card!" + cardName));
  try {
    await adminConnection.connect("admin@tutorial-network");
    await adminConnection.deleteCard(cardName);
    console.log(chalk.green.bold.inverse("Card is deleted!"));
    await adminConnection.disconnect();
    // process.exit();
    // console.log(chalk.green.bold.inverse('Add new card successful!'));
  } catch (error) {
    console.log(chalk.red.bold(error));
  }
}

async function getDoctor(cardName) {
  console.log("start get Doctor");

  let businessNetworkConnection = new BusinessNetworkConnection();

  try {
    // await businessNetworkConnection.connect('3@identity');
    await businessNetworkConnection.connect(cardName);
    let participantRegistry = await businessNetworkConnection.getParticipantRegistry(
      "org.basic.server.Doctor"
    );

    //add a new participant to business network
    var result = await participantRegistry.getAll();

    //disconect admin card
    await businessNetworkConnection.disconnect();
    // console.log(result);
    var user = {
      email: result[0].email,
      role: "Doctor",
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

async function getDoctorInfo(cardName) {
  let businessNetworkConnection = new BusinessNetworkConnection();

  try {
    // await businessNetworkConnection.connect('3@identity');
    await businessNetworkConnection.connect(cardName);
    let participantRegistry = await businessNetworkConnection.getAssetRegistry(
      "org.basic.server.DoctorInfo"
    );

    //add a new participant to business network
    var result = await participantRegistry.getAll();
    //console.log("Result:"+result);

    //disconect admin card
    await businessNetworkConnection.disconnect();

    // console.log(result);
    var user = {
      name: result[0].name,
      address: result[0].address,
      email: result[0].email,
      phone: result[0].phone,
      identityCardNumber: result[0].identityCardNumber,
      sex: result[0].sex,
      specialist: result[0].specialist,
      marriageStatus: result[0].marriageStatus,
      tittle: result[0].tittle
    };
    //console.log(user);
    return user;
  } catch (error) {
    await businessNetworkConnection.disconnect();
    var user = {
      name: "Name",
      address: "Address",
      email: "Email",
      phone: "Phone",
      identityCardNumber: "Identity Card Number",
      sex: "Gender",
      specialist: "Specialist",
      marriageStatus: "Marriage Status",
      tittle: "Tittle"
    };

    //error: trung id card
    //console.error(error);
    return user;
    // process.exit(1);
  }
  return 1;
}

async function getDoctorInfos() {
  let businessNetworkConnection = new BusinessNetworkConnection();

  try {
    // await businessNetworkConnection.connect('3@identity');
    await businessNetworkConnection.connect("admin@tutorial-network");
    let participantRegistry = await businessNetworkConnection.getAssetRegistry(
      "org.basic.server.DoctorInfo"
    );

    //add a new participant to business network
    var result = await participantRegistry.getAll();

    arrayResult = [];

    for (var i = 0; i < result.length; i++) {
      var item = {
        doctorInfoId: result[i].doctorInfoId,
        doctorId: result[i].doctorId,
        name: result[i].name,
        address: result[i].address,
        email: result[i].email,
        phone: result[i].phone,
        identityCardNumber: result[i].identityCardNumber,
        sex: result[i].sex,
        specialist: result[i].specialist,
        marriageStatus: result[i].marriageStatus,
        tittle: result[i].tittle
      };

      arrayResult.push(item);
    }

    //disconect admin card
    await businessNetworkConnection.disconnect();
    // console.log(result);

    return arrayResult;
  } catch (error) {
    await businessNetworkConnection.disconnect();
    //error: trung id card

    return 0;
    // process.exit(1);
  }
  //return 1;
}

async function getPatient(cardName) {
  console.log("start get Patient");

  let businessNetworkConnection = new BusinessNetworkConnection();

  try {
    // await businessNetworkConnection.connect('3@identity');
    await businessNetworkConnection.connect(cardName);
    let participantRegistry = await businessNetworkConnection.getParticipantRegistry(
      "org.basic.server.Patient"
    );

    //add a new participant to business network
    var result = await participantRegistry.getAll();

    //disconect admin card
    await businessNetworkConnection.disconnect();
    // console.log(result);
    var user = {
      email: result[0].email,
      role: "Patient",
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

async function getPatientInfo(cardName) {
  console.log("start get Patient Info");

  let businessNetworkConnection = new BusinessNetworkConnection();

  try {
    // await businessNetworkConnection.connect('3@identity');
    await businessNetworkConnection.connect(cardName);
    let participantRegistry = await businessNetworkConnection.getAssetRegistry(
      "org.basic.server.PatientInfo"
    );

    //add a new participant to business network
    var result = await participantRegistry.getAll();

    //disconect admin card
    await businessNetworkConnection.disconnect();
    // console.log(result);
    var user = {
      name: result[0].name,
      address: result[0].address,
      email: result[0].email,
      phone: result[0].phone,
      identityCardNumber: result[0].identityCardNumber,
      sex: result[0].sex,
      career: result[0].career,
      marriageStatus: result[0].marriageStatus
    };
    console.log(user);
    return user;
  } catch (error) {
    await businessNetworkConnection.disconnect();
    var user = {
      name: "Name",
      address: "Address",
      email: "Email",
      phone: "Phone",
      identityCardNumber: "Identity Card Number",
      sex: "Gender",
      Career: "Career",
      marriageStatus: "Marriage Status"
    };
    //error: trung id card
    //console.error(error);
    return user;
    // process.exit(1);
  }
  //return 1;
}

async function getPatientInfos() {
  let businessNetworkConnection = new BusinessNetworkConnection();

  try {
    // await businessNetworkConnection.connect('3@identity');
    await businessNetworkConnection.connect("admin@tutorial-network");
    let participantRegistry = await businessNetworkConnection.getAssetRegistry(
      "org.basic.server.PatientInfo"
    );

    //add a new participant to business network
    var result = await participantRegistry.getAll();

    arrayResult = [];

    for (var i = 0; i < result.length; i++) {
      var item = {
        patientInfoId: result[i].patientInfoId,
        patientId: result[i].patientId,
        name: result[i].name,
        address: result[i].address,
        email: result[i].email,
        phone: result[i].phone,
        identityCardNumber: result[i].identityCardNumber,
        sex: result[i].sex,
        career: result[i].career,
        marriageStatus: result[i].marriageStatus
      };

      arrayResult.push(item);
    }

    //disconect admin card
    await businessNetworkConnection.disconnect();
    // console.log(result);

    return arrayResult;
  } catch (error) {
    await businessNetworkConnection.disconnect();
    //error: trung id card

    return 0;
    // process.exit(1);
  }
  //return 1;
}

async function countDoctorInfo(data) {
  console.log("start creating a new participant");
  let businessNetworkConnection = new BusinessNetworkConnection();

  try {
    //console.log(data.personId);
    const definition = await businessNetworkConnection.connect(
      "admin@tutorial-network"
    );
    let assetRegistry = await businessNetworkConnection.getAssetRegistry(
      "org.basic.server.DoctorInfo"
    );

    let results = await businessNetworkConnection.query("selectAllDoctorInfo");
    let count = results.length;

    //disconect admin card
    await businessNetworkConnection.disconnect();
    console.log("Add participant successfully");
    return count;
  } catch (error) {
    //error: trung id card
    console.error(error);
    return 0;
    // process.exit(1);
  }
}

async function createRequest(data) {
  console.log("start creating a new request");
  let businessNetworkConnection = new BusinessNetworkConnection();

  try {
    
    const definition = await businessNetworkConnection.connect(
      "admin@tutorial-network"
    );
    //let participantRegistry = await businessNetworkConnection.getParticipantRegistry('org.basic.server.Doctor');

    let results = await businessNetworkConnection.query("selectAllRequest");
    let count = results.length;
    let requestId = count + 1;
    
    let assetRegistry = await businessNetworkConnection.getAssetRegistry(
      "org.basic.server.Request"
    );
    let factory = definition.getFactory();
    //define information of a user
    let requestInfo = factory.newResource(
      "org.basic.server",
      "Request",
      requestId.toString()
    );
    //requestInfo.requestId = requestId;
    requestInfo.requesterRole = data.requesterRole;
    requestInfo.resourceOwnerRole = data.resourceOwnerRole;
    requestInfo.resourceType = data.resourceType;
    requestInfo.resourceId = data.resourceId;
    requestInfo.status = "New";
    //requestInfo.idRequester = data.idRequester;
    //requestInfo.idResourceOwner = data.idResourceOwner;

    var owner = await factory.newRelationship(
      "org.basic.server",
      data.requesterRole,
      data.idRequester
    );
    requestInfo.owner = owner;

    var resourceOwner = await factory.newRelationship(
      "org.basic.server",
      data.resourceOwnerRole,
      data.idResourceOwner
    );
    requestInfo.resourceOwner = resourceOwner;

    //add a new participant to business network
    await assetRegistry.add(requestInfo);

    //disconect admin card
    await businessNetworkConnection.disconnect();
    console.log("Create Request successfully");
    return 1;
  } catch (error) {
    //error: trung id card
    console.log(error);
    return 0;
    // process.exit(1);
  }
}

async function getRequestByDoctor(cardName, identityCardNumber) {
  console.log("start get Request by Doctor");

  let businessNetworkConnection = new BusinessNetworkConnection();

  try {
    // await businessNetworkConnection.connect('3@identity');
    await businessNetworkConnection.connect("admin@tutorial-network");
    let participantRegistry = await businessNetworkConnection.getAssetRegistry(
      "org.basic.server.Request"
    );

    //add a new participant to business network
    var result = await participantRegistry.getAll();

    arrayResult = [];

    for (var i = 0; i < result.length; i++) {
      var item = {
        requestId: result[i].requestId,
        requesterRole: result[i].requesterRole,
        resourceOwnerRole: result[i].resourceOwnerRole,
        resourceType: result[i].resourceType,
        status: result[i].status,
        resourceId: result[i].resourceId,
        owner: result[i].owner.getIdentifier(),
        resourceOwner: result[i].resourceOwner.getIdentifier()
      };

      if (item.owner == identityCardNumber) {
        arrayResult.push(item);
      }
    }

    //disconect admin card
    await businessNetworkConnection.disconnect();
    // console.log(result);

    return arrayResult;
  } catch (error) {
    await businessNetworkConnection.disconnect();

    //error: trung id card
    //console.error(error);
    return 0;
    // process.exit(1);
  }
  //return 1;
}

async function getRequestBeRequest(cardName, identityCardNumber) {
  console.log("start get Request by Doctor");

  let businessNetworkConnection = new BusinessNetworkConnection();

  try {
    // await businessNetworkConnection.connect('3@identity');
    await businessNetworkConnection.connect("admin@tutorial-network");
    let participantRegistry = await businessNetworkConnection.getAssetRegistry(
      "org.basic.server.Request"
    );

    //add a new participant to business network
    var result = await participantRegistry.getAll();
    console.log("result: " + result);

    arrayResult = [];

    for (var i = 0; i < result.length; i++) {
      var item = {
        requestId: result[i].requestId,
        requesterRole: result[i].requesterRole,
        resourceOwnerRole: result[i].resourceOwnerRole,
        resourceType: result[i].resourceType,
        status: result[i].status,
        resourceId: result[i].resourceId,
        owner: result[i].owner.getIdentifier(),
        resourceOwner: result[i].resourceOwner.getIdentifier()
      };

      if (item.resourceOwner == identityCardNumber) {
        arrayResult.push(item);
      }
    }

    //disconect admin card
    await businessNetworkConnection.disconnect();
    // console.log(result);

    return arrayResult;
  } catch (error) {
    await businessNetworkConnection.disconnect();

    //error: trung id card
    //console.error(error);
    return 0;
    // process.exit(1);
  }
  //return 1;
}

async function getRequestByPatient(cardName, identityCardNumber) {
  console.log("start get Request by Patient");

  let businessNetworkConnection = new BusinessNetworkConnection();

  try {
    // await businessNetworkConnection.connect('3@identity');
    await businessNetworkConnection.connect("admin@tutorial-network");
    let participantRegistry = await businessNetworkConnection.getAssetRegistry(
      "org.basic.server.Request"
    );

    //add a new participant to business network
    var result = await participantRegistry.getAll();

    arrayResult = [];
    for (var i = 0; i < result.length; i++) {
      var item = {
        requestId: result[i].requestId,
        requesterRole: result[i].requesterRole,
        resourceOwnerRole: result[i].resourceOwnerRole,
        resourceType: result[i].resourceType,
        status: result[i].status,
        resourceId: result[i].resourceId,
        owner: result[i].owner.getIdentifier(),
        resourceOwner: result[i].resourceOwner.getIdentifier()
      };

      if (item.owner == identityCardNumber) {
        arrayResult.push(item);
      }
    }
    //disconect admin card
    await businessNetworkConnection.disconnect();
    // console.log(result);

    return arrayResult;
  } catch (error) {
    await businessNetworkConnection.disconnect();

    //error: trung id card
    //console.error(error);
    return 0;
    // process.exit(1);
  }
  //return 1;
}

async function doctorAcceptRequestOfPatient(cardName,requestId) {
  console.log("start accept request of Patient");

  let businessNetworkConnection = new BusinessNetworkConnection();

  try {
    
    // await businessNetworkConnection.connect("admin@tutorial-network");
    await businessNetworkConnection.connect(cardName);
    let requestRegistry = await businessNetworkConnection.getAssetRegistry(
      "org.basic.server.Request"
    );
    var req = await requestRegistry.get(requestId);
    let resourceRegistry = await businessNetworkConnection.getAssetRegistry(
      "org.basic.server." + req.resourceType
    );
    var resource = await resourceRegistry.get(req.resourceId);

    var owner = req.owner;
    console.log("owner: " + owner);

    resource.authorizedPatients.push(owner);
    await resourceRegistry.update(resource);

    req.status = "Accepted";
    await requestRegistry.update(req);

    //disconect admin card
    await businessNetworkConnection.disconnect();
    // console.log(result);
    return 1;
  } catch (error) {
    await businessNetworkConnection.disconnect();
    //error: trung id card
    console.log(error);
    return 0;
    // process.exit(1);
  }
  //return 1;
}

async function doctorAcceptRequestOfDoctor(cardName,requestId) {
  console.log("start accept request of Doctor");

  let businessNetworkConnection = new BusinessNetworkConnection();

  try {
    // await businessNetworkConnection.connect('3@identity');
    // await businessNetworkConnection.connect("admin@tutorial-network");
    await businessNetworkConnection.connect(cardName);
    let requestRegistry = await businessNetworkConnection.getAssetRegistry(
      "org.basic.server.Request"
    );
    var req = await requestRegistry.get(requestId);
    let resourceRegistry = await businessNetworkConnection.getAssetRegistry(
      "org.basic.server." + req.resourceType
    );
    var resource = await resourceRegistry.get(req.resourceId);

    var owner = req.owner;
    console.log("owner: " + owner);

    resource.authorizedDoctors.push(owner);
    await resourceRegistry.update(resource);

    req.status = "Accepted";
    await requestRegistry.update(req);

    //disconect admin card
    await businessNetworkConnection.disconnect();
    // console.log(result);
    return 1;
  } catch (error) {
    await businessNetworkConnection.disconnect();
    //error: trung id card
    console.log(error);
    return 0;
    // process.exit(1);
  }
  //return 1;
}
async function doctorRevokeRequestOfDoctor(cardName,requestId) {
  console.log("start accept request of Doctor");

  let businessNetworkConnection = new BusinessNetworkConnection();

  try {
    
    // await businessNetworkConnection.connect("admin@tutorial-network");
    await businessNetworkConnection.connect(cardName);
    let requestRegistry = await businessNetworkConnection.getAssetRegistry(
      "org.basic.server.Request"
    );
    var req = await requestRegistry.get(requestId);
    let resourceRegistry = await businessNetworkConnection.getAssetRegistry(
      "org.basic.server." + req.resourceType
    );
    var resource = await resourceRegistry.get(req.resourceId);

    var doctor = req.owner;
    await resource.authorizedDoctors.splice(
      resource.authorizedDoctors.indexOf(doctor, "1")
    );
    await resourceRegistry.update(resource);

    req.status = "Rejected";
    await requestRegistry.update(req);

    //disconect admin card
    await businessNetworkConnection.disconnect();
    // console.log(result);
    return 1;
  } catch (error) {
    await businessNetworkConnection.disconnect();
    //error: trung id card
    console.log(error);
    return 0;
    // process.exit(1);
  }
  //return 1;
}
async function doctorRevokeRequestOfPatient(cardName,requestId) {
  console.log("start accept request of Patient");

  let businessNetworkConnection = new BusinessNetworkConnection();

  try {
    
    // await businessNetworkConnection.connect("admin@tutorial-network");
    await businessNetworkConnection.connect(cardName);
    let requestRegistry = await businessNetworkConnection.getAssetRegistry(
      "org.basic.server.Request"
    );
    var req = await requestRegistry.get(requestId);
    let resourceRegistry = await businessNetworkConnection.getAssetRegistry(
      "org.basic.server." + req.resourceType
    );
    var resource = await resourceRegistry.get(req.resourceId);

    var patient = req.owner;
    await resource.authorizedPatients.splice(
      resource.authorizedPatients.indexOf(patient, "1")
    );
    await resourceRegistry.update(resource);

    req.status = "Rejected";
    await requestRegistry.update(req);

    //disconect admin card
    await businessNetworkConnection.disconnect();
    // console.log(result);
    return 1;
  } catch (error) {
    await businessNetworkConnection.disconnect();
    //error: trung id card
    console.log(error);
    return 0;
    // process.exit(1);
  }
  //return 1;
}

async function patientAcceptRequestOfDoctor(cardName,requestId) {
  console.log("start accept request of Doctor");

  let businessNetworkConnection = new BusinessNetworkConnection();

  try {
    
    // await businessNetworkConnection.connect("admin@tutorial-network");
    await businessNetworkConnection.connect(cardName);
    let requestRegistry = await businessNetworkConnection.getAssetRegistry(
      "org.basic.server.Request"
    );
    var req = await requestRegistry.get(requestId);
    let resourceRegistry = await businessNetworkConnection.getAssetRegistry(
      "org.basic.server." + req.resourceType
    );
    var resource = await resourceRegistry.get(req.resourceId);

    var owner = req.owner;

    resource.authorizedDoctors.push(owner);
    await resourceRegistry.update(resource);

    req.status = "Accepted";
    await requestRegistry.update(req);

    //disconect admin card
    await businessNetworkConnection.disconnect();
    // console.log(result);
    return 1;
  } catch (error) {
    await businessNetworkConnection.disconnect();
    //error: trung id card
    console.log(error);
    return 0;
    // process.exit(1);
  }
  //return 1;
}

async function patientRevokeRequestOfPatient(cardName,requestId) {
  console.log("start accept request of Patient");

  let businessNetworkConnection = new BusinessNetworkConnection();

  try {
   
    // await businessNetworkConnection.connect("admin@tutorial-network");
    await businessNetworkConnection.connect(cardName);
    let requestRegistry = await businessNetworkConnection.getAssetRegistry(
      "org.basic.server.Request"
    );
    var req = await requestRegistry.get(requestId);
    let resourceRegistry = await businessNetworkConnection.getAssetRegistry(
      "org.basic.server." + req.resourceType
    );
    var resource = await resourceRegistry.get(req.resourceId);

    var doctor = req.owner;
    await resource.authorizedDoctors.splice(
      resource.authorizedDoctors.indexOf(doctor, "1")
    );
    await resourceRegistry.update(resource);

    req.status = "Rejected";
    await requestRegistry.update(req);

    //disconect admin card
    await businessNetworkConnection.disconnect();
    // console.log(result);
    return 1;
  } catch (error) {
    await businessNetworkConnection.disconnect();
    //error: trung id card
    console.log(error);
    return 0;
    // process.exit(1);
  }
  //return 1;
}

async function createHealthRecord(identityCardNumber) {
  console.log("start creating a new health record");
  let businessNetworkConnection = new BusinessNetworkConnection();

  try {
    //console.log(data.personId);
    const definition = await businessNetworkConnection.connect(
      "admin@tutorial-network"
    );
    let assetRegistry = await businessNetworkConnection.getAssetRegistry(
      "org.basic.server.HealthRecord"
    );
    let factory = definition.getFactory();

    //define information of a user
    let healthRecordInfo = factory.newResource(
      "org.basic.server",
      "HealthRecord",
      identityCardNumber
    );
    healthRecordInfo.hight = "";
    healthRecordInfo.tuoithai = "";
    healthRecordInfo.hatthu0 = "";
    healthRecordInfo.hattruong0 = "";
    healthRecordInfo.tieucau0 = "";
    healthRecordInfo.tq0 = "";
    healthRecordInfo.aptt0 = "";
    healthRecordInfo.fibrinogen0 = "";
    healthRecordInfo.ast0 = "";
    healthRecordInfo.alt0 = "";
    healthRecordInfo.creatinin0 = "";
    healthRecordInfo.ure0 = "";
    healthRecordInfo.auric0 = "";
    healthRecordInfo.ldh0 = "";
    healthRecordInfo.damnieu0 = "";
    healthRecordInfo.damnieu24h0 = "";
    healthRecordInfo.protein0 = "";
    healthRecordInfo.albumin0 = "";
    healthRecordInfo.bilirubintp0 = "";
    healthRecordInfo.bilirubintt0 = "";
    healthRecordInfo.conclusion = "";

    healthRecordInfo.authorizedDoctors = [];

    var owner = await factory.newRelationship(
      "org.basic.server",
      "Patient",
      identityCardNumber
    );
    healthRecordInfo.owner = owner;

    //add a new participant to business network
    await assetRegistry.add(healthRecordInfo);

    //disconect admin card
    await businessNetworkConnection.disconnect();
    console.log("Add health record successfully");
    return 1;
  } catch (error) {
    //error: trung id card
    console.log(error);
    return 0;
    // process.exit(1);
  }
}

async function getHealthRecordByDoctor(cardName, identityCardNumber) {
  console.log("start get Health Record by Doctor");

  let businessNetworkConnection = new BusinessNetworkConnection();

  try {
    // await businessNetworkConnection.connect('3@identity');
    await businessNetworkConnection.connect("admin@tutorial-network");
    let participantRegistry = await businessNetworkConnection.getAssetRegistry(
      "org.basic.server.HealthRecord"
    );

    //add a new participant to business network
    var result = await participantRegistry.getAll();
    arrayResult = [];

    for (var i = 0; i < result.length; i++) {
      var item = {
        healthRecordId: result[i].healthRecordId,
        owner: result[i].owner.getIdentifier(),
        authorizedDoctors: result[i].authorizedDoctors
      };

      for (var j = 0; j < item.authorizedDoctors.length; j++) {
        if (item.authorizedDoctors[j].getIdentifier() == identityCardNumber) {
          arrayResult.push(item);
        }
      }
    }

    //disconect admin card
    await businessNetworkConnection.disconnect();
    // console.log(result);

    return arrayResult;
  } catch (error) {
    await businessNetworkConnection.disconnect();

    //error: trung id card
    //console.error(error);
    return 0;
    // process.exit(1);
  }
  //return 1;
}

async function listAllHealthRecord() {
  let businessNetworkConnection = new BusinessNetworkConnection();

  try {
    // await businessNetworkConnection.connect('3@identity');
    await businessNetworkConnection.connect("admin@tutorial-network");
    let participantRegistry = await businessNetworkConnection.getAssetRegistry(
      "org.basic.server.HealthRecord"
    );

    var result = await participantRegistry.getAll();

    arrayResult = [];
    for (var i = 0; i < result.length; i++) {
      var item = {
        healthRecordId: result[i].healthRecordId,
        owner: result[i].owner.getIdentifier()
      };
      arrayResult.push(item);
    }
    return arrayResult;
  } catch (error) {
    return 0;
  }
}

async function getDetailHealthRecord(healthRecordId) {
  console.log("start get detail health record");

  let businessNetworkConnection = new BusinessNetworkConnection();

  try {
    // await businessNetworkConnection.connect('3@identity');
    await businessNetworkConnection.connect("admin@tutorial-network");
    let participantRegistry = await businessNetworkConnection.getAssetRegistry(
      "org.basic.server.HealthRecord"
    );

    //add a new participant to business network
    var result = await participantRegistry.get(healthRecordId);

    var item = {
      healthRecordId: result.healthRecordId,
      hight: result.hight,
      tuoithai: result.tuoithai,
      hatthu0: result.hatthu0,
      hattruong0: result.hattruong0,
      tieucau0: result.tieucau0,
      tq0: result.tq0,
      aptt0: result.aptt0,
      fibrinogen0: result.fibrinogen0,
      ast0: result.ast0,
      alt0: result.alt0,
      creatinin0: result.creatinin0,
      ure0: result.ure0,
      auric0: result.auric0,
      ldh0: result.ldh0,
      damnieu0: result.damnieu0,
      damnieu24h0: result.damnieu24h0,
      protein0: result.protein0,
      albumin0: result.albumin0,
      bilirubintp0: result.bilirubintt0,
      bilirubintt0: result.bilirubintt0,
      owner: result.owner.getIdentifier(),
      conclusion: result.conclusion
    };

    //disconect admin card
    await businessNetworkConnection.disconnect();
    // console.log(result);
    console.log("hight "+item.hight);
    return item;
  } catch (error) {
    await businessNetworkConnection.disconnect();

    //error: trung id card
    console.log(error);
    return 0;
    // process.exit(1);
  }
  //return 1;
}

async function doctorUpdateHealthRecord(cardName,data) {
  console.log("doctor start to update Health Record");
  let businessNetworkConnection = new BusinessNetworkConnection();

  try {
    //console.log(data.personId);
    var definition = await businessNetworkConnection.connect(
      cardName
    );

    let assetRegistry = await businessNetworkConnection.getAssetRegistry(
      "org.basic.server.HealthRecord"
    );
    let factory = definition.getFactory();
    var healthRecordAsset = await assetRegistry.get(data.healthRecordId);
    //define information of a user
    healthRecordAsset.hight = data.hight;
    healthRecordAsset.tuoithai = data.tuoithai;
    healthRecordAsset.hatthu0 = data.hatthu0;
    healthRecordAsset.hattruong0 = data.hattruong0;
    healthRecordAsset.tieucau0 = data.tieucau0;
    healthRecordAsset.tq0 = data.tq0;
    healthRecordAsset.aptt0 = data.aptt0;
    healthRecordAsset.fibrinogen0 = data.fibrinogen0;
    healthRecordAsset.ast0 = data.ast0;
    healthRecordAsset.alt0 = data.alt0;
    healthRecordAsset.creatinin0 = data.creatinin0;
    healthRecordAsset.ure0 = data.ure0;
    healthRecordAsset.auric0 = data.auric0;
    healthRecordAsset.ldh0 = data.ldh0;
    healthRecordAsset.damnieu0 = data.damnieu0;
    healthRecordAsset.damnieu24h0 = data.damnieu24h0;
    healthRecordAsset.protein0 = data.protein0;
    healthRecordAsset.albumin0 = data.albumin0;
    healthRecordAsset.bilirubintp0 = data.bilirubintp0;
    healthRecordAsset.bilirubintt0 = data.bilirubintt0;
    healthRecordAsset.conclusion = data.conclusion;

    //add a new participant to business network
    await assetRegistry.update(healthRecordAsset);

    //disconect admin card
    await businessNetworkConnection.disconnect();
    console.log("update health record successfully");
    return 1;
  } catch (error) {
    //error: trung id card
    console.error(error);
    return 0;
    // process.exit(1);
  }
}

module.exports = {
  createDoctor,
  createPatient,
  createDoctorIdentity,
  createPatientIdentity,
  importCard,
  exportCard,
  deleteCard,
  ping,
  getDoctor,
  getPatient,
  createDoctorInfo,
  countDoctorInfo,
  getDoctorInfo,
  createPatientInfo,
  getPatientInfo,
  createRequest,
  getRequestByDoctor,
  getRequestByPatient,
  doctorAcceptRequestOfPatient,
  patientAcceptRequestOfDoctor,
  doctorRevokeRequestOfPatient,
  patientRevokeRequestOfPatient,
  createHealthRecord,
  doctorUpdateHealthRecord,
  getHealthRecordByDoctor,
  getDetailHealthRecord,
  getDoctorInfos,
  getPatientInfos,
  getRequestBeRequest,
  doctorAcceptRequestOfDoctor,
  doctorRevokeRequestOfDoctor,
  listAllHealthRecord
};
