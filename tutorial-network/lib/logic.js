/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Write your transction processor functions here
 */


/**
 * Sample transaction
 * @param {org.basic.server.transaction.CreateDoctor} listing
 * @transaction
 */
async function createDoctor(listing) {
    var factory = getFactory();

    return getParticipantRegistry('org.basic.server.Doctor').then(async function (doctorRegistry) {
        doctorNew = await factory.newResource("org.basic.server", "Doctor", listing.identityCardNumber)
        doctorNew.personId = listing.identityCardNumber;
        doctorNew.name = listing.name;
        doctorNew.address = listing.address;
        doctorNew.email = listing.email;
        doctorNew.phone = listing.phone;
        doctorNew.identityCardNumber = listing.identityCardNumber;
        doctorNew.sex = listing.sex;
        doctorNew.birthday = listing.birthday;
        doctorNew.createAt = listing.createAt;
        doctorNew.updateAt = listing.updateAt;
        return await doctorRegistry.add(doctorNew);
    });
}

/**
 * Sample transaction
 * @param {org.basic.server.transaction.CreatePatient} listing
 * @transaction
 */

async function createPatient(listing) {
    var factory = getFactory();

    return getParticipantRegistry('org.basic.server.Patient').then(async function (patientRegistry) {
        patientNew = await factory.newResource("org.basic.server", "Patient", listing.identityCardNumber)
        patientNew.personId = listing.identityCardNumber;
        patientNew.name = listing.name;
        patientNew.address = listing.address;
        patientNew.email = listing.email;
        patientNew.phone = listing.phone;
        patientNew.identityCardNumber = listing.identityCardNumber;
        patientNew.sex = listing.sex;
        patientNew.birthday = listing.birthday;
        patientNew.createAt = listing.createAt;
        patientNew.updateAt = listing.updateAt;
        return await patientRegistry.add(patientNew);
    });
}

/**
 * Sample transaction
 * @param {org.basic.server.transaction.CreateDoctorInfo} listing 
 * @transaction
 */
async function createDoctorInfo(listing) {
    var factory = getFactory();

    return getAssetRegistry('org.basic.server.DoctorInfo').then(async function (doctorInfoRegistry) {
        doctorInfoNew =await factory.newResource("org.basic.server", "DoctorInfo", listing.doctorInfoId)
        doctorInfoNew.doctorId = listing.identityCardNumber;
        doctorInfoNew.name = listing.name;
        doctorInfoNew.address = listing.address;
        doctorInfoNew.email = listing.email;
        doctorInfoNew.phone = listing.phone;
        doctorInfoNew.identityCardNumber = listing.identityCardNumber;
        doctorInfoNew.sex = listing.sex;
        doctorInfoNew.birthday = listing.birthday;
        doctorInfoNew.specialist = listing.specialist;
        doctorInfoNew.marriageStatus = listing.marriageStatus;
        doctorInfoNew.tittle = listing.tittle;
        doctorInfoNew.createAt = listing.createAt;
        doctorInfoNew.updateAt = listing.updateAt;
        doctorInfoNew.authorizedPatients = [];

        var owner = await factory.newRelationship("org.basic.server", "Doctor", listing.identityCardNumber);

        doctorInfoNew.owner = owner;

        await doctorInfoRegistry.add(doctorInfoNew);
    });
}


/**
 * Sample transaction
 * @param {org.basic.server.transaction.CreatePatientInfo} listing 
 * @transaction
 */
async function createPatientInfo(listing) {
    var factory = getFactory();

    return getAssetRegistry('org.basic.server.PatientInfo').then(async function (patientInfoRegistry) {
        patientInfoNew =await factory.newResource("org.basic.server", "PatientInfo", listing.patientInfoId)
        patientInfoNew.patientId = listing.identityCardNumber;
        patientInfoNew.name = listing.name;
        patientInfoNew.address = listing.address;
        patientInfoNew.email = listing.email;
        patientInfoNew.phone = listing.phone;
        patientInfoNew.identityCardNumber = listing.identityCardNumber;
        patientInfoNew.sex = listing.sex;
        patientInfoNew.birthday = listing.birthday;
        patientInfoNew.career = listing.career;
        patientInfoNew.marriageStatus = listing.marriageStatus;
        patientInfoNew.createAt = listing.createAt;
        patientInfoNew.updateAt = listing.updateAt;

        patientInfoNew.authorizedDoctors = [];

        var owner = await factory.newRelationship("org.basic.server", "Patient", listing.identityCardNumber);

        patientInfoNew.owner = owner;

        await patientInfoRegistry.add(pgatientInfoNew);
    });
}


/**
 * Sample transaction
 * @param {org.basic.server.transaction.CreateHealthRecord} listing 
 * @transaction
 */
async function createHealthRecord(listing) {
    var factory = getFactory();

    return getAssetRegistry('org.basic.server.HealthRecord').then(async function (healthRecordRegistry) {
        healthRecord =await factory.newResource("org.basic.server", "HealthRecord", listing.healthRecordId)
        healthRecord.hight = listing.hight;
        healthRecord.thaingoai = listing.thaingoai;
        healthRecord.tuoithai = listing.tuoithai;
        healthRecord.cogiat = listing.cogiat;
        healthRecord.truyenmau = listing.truyenmau;
        healthRecord.hattruong0 = listing.hattruong0;
        healthRecord.tieucau0 = listing.tieucau0;
        healthRecord.tq0 = listing.tq0;
        healthRecord.aptt0 = listing.aptt0;
        healthRecord.fibrinogen0 = listing.fibrinogen0;
        healthRecord.authorizedDoctors = [];

        // var resourceRegistry=await getParticipantRegistry('org.basic.server.Doctor');
        // var doctor=await resourceRegistry.get(listing.doctorId);

        var doctor=await factory.newRelationship("org.basic.server","Doctor",listing.doctorId);

        var owner = await factory.newRelationship("org.basic.server", "Patient", listing.patientId);
        healthRecord.owner = owner;

        healthRecord.authorizedDoctors.push(doctor);

        await healthRecordRegistry.add(healthRecord);
    });
}

/**
 * Sample transaction
 * @param {org.basic.server.transaction.PatientAcceptRequestHealthRecordOfDoctor} listing 
 * @transaction
 */

async function patientAcceptRequestHealthRecordOfDoctor(listing){
    return getAssetRegistry('org.basic.server.Request').then(async function (requestRegistry){
       var req=await requestRegistry.get(listing.requestId);

       var resourceRegistry=await getAssetRegistry('org.basic.server.'+req.resourceType);
       var resource=await resourceRegistry.get(req.resourceId);

       var owner=req.owner;

       resource.authorizedDoctors.push(owner);

       await resourceRegistry.update(resource);
       req.status="Accepted";
       await requestRegistry.update(req);
    })
}

/**
 * Sample transaction
 * @param {org.basic.server.transaction.CreateDoctorProfile} listing 
 * @transaction
 */

 async function createDoctorProfile(listing){
    var factory = getFactory();
    return getAssetRegistry('org.basic.server.DoctorProfile').then(async function (doctorProfileRegistry) {
        doctorProfileNew =await factory.newResource("org.basic.server", "DoctorProfile", listing.doctorProfileId)
        doctorProfileNew.doctorId = listing.doctorId;
        doctorProfileNew.role = listing.role;
        doctorProfileNew.avatar = listing.avatar;
        doctorProfileNew.createAt = listing.createAt;  
        doctorProfileNew.updateAt = listing.updateAt;

        var owner = await factory.newRelationship("org.basic.server", "Doctor", listing.doctorId);

        doctorProfileNew.owner = owner;

        await doctorProfileRegistry.add(doctorProfileNew);
    });
 }

/**
 * Sample transaction
 * @param {org.basic.server.transaction.CreatePatientProfile} listing 
 * @transaction
 */

async function createPatientProfile(listing){
    var factory = getFactory();
    return getAssetRegistry('org.basic.server.PatientProfile').then(async function (patientProfileRegistry) {
        patientProfileNew =await factory.newResource("org.basic.server", "PatientProfile", listing.patientProfileId)
        patientProfileNew.patientId = listing.patientId;
        patientProfileNew.role = listing.role;
        patientProfileNew.avatar = listing.avatar;
        patientProfileNew.createAt = listing.createAt;  
        patientProfileNew.updateAt = listing.updateAt;

        var owner = await factory.newRelationship("org.basic.server", "Patient", listing.patientId);

        patientProfileNew.owner = owner;

        await patientProfileRegistry.add(patientProfileNew);
    });
 }


/**
 * Sample transaction
 * @param {org.basic.server.transaction.CreateRequest} listing 
 * @transaction
 */
async function createRequest(listing) {
    var factory =await getFactory();

    return getAssetRegistry('org.basic.server.Request').then(async function (requestRegistry) {
        requestNew = await factory.newResource("org.basic.server", "Request", listing.requestId)
        requestNew.resourceId = listing.resourceId;
        requestNew.requesterRole = listing.requesterRole;
        requestNew.resourceOwnerRole = listing.resourceOwnerRole;
        requestNew.resourceType = listing.resourceType;

        requestNew.status="New";
        // --> Person owner
        // --> Person resourceOwner
        var owner = await factory.newRelationship("org.basic.server", listing.requesterRole, listing.idRequester);
        var resourceOwner = await factory.newRelationship("org.basic.server", listing.resourceOwnerRole, listing.idResourceOwner);
        requestNew.owner = owner;
        requestNew.resourceOwner = resourceOwner; 

        await requestRegistry.add(requestNew);
    });
}

/**
 * Sample transaction
 * @param {org.basic.server.transaction.DeleteRequest} listing 
 * @transaction
 */
async function deleteRequest(listing) {
    var factory = getFactory();

    return getAssetRegistry('org.basic.server.Request').then(async function (requestRegistry) {

        var request=await requestRegistry.get(listing.requestId);

        await requestRegistry.remove(request);
    });
}


/**
 * Sample transaction
 * @param {org.basic.server.transaction.PatientRevokeRequestOfDoctor} listing 
 * @transaction
 */
async function patientRevokeRequestOfDoctor(listing) {
    

    return getAssetRegistry('org.basic.server.Request').then(async function (requestRegistry) {

        var request= await requestRegistry.get(listing.requestId);


        var resourceRegistry=await getAssetRegistry('org.basic.server.'+request.resourceType); 
        var resource=await resourceRegistry.get(request.resourceId);

        var doctor=request.owner;

        //delete doctor in authorizedDoctors and update resourceRegistry
        await resource.authorizedDoctors.splice(resource.authorizedDoctors.indexOf(doctor,"1"));//van de do:V 2 cho d phai giong nhau :V 
        await resourceRegistry.update(resource);

        request.status="Rejected";
        await requestRegistry.update(request);
    });
}

/**
 * Sample transaction
 * @param {org.basic.server.transaction.DoctorRevokeRequestOfPatient} listing 
 * @transaction
 */
async function doctorRevokeRequestOfPatient(listing) {
    

    return getAssetRegistry('org.basic.server.Request').then(async function (requestRegistry) {

        var request= await requestRegistry.get(listing.requestId);


        var resourceRegistry=await getAssetRegistry('org.basic.server.'+request.resourceType); 
        var resource=await resourceRegistry.get(request.resourceId);

        var patient=request.owner;

        //delete doctor in authorizedDoctors and update resourceRegistry
        await resource.authorizedPatients.splice(resource.authorizedPatients.indexOf(patient,"1"));
        await resourceRegistry.update(resource);

        request.status="Rejected";
        await requestRegistry.update(request);
    });
}


/**
 * Sample transaction
 * @param {org.basic.server.transaction.DoctorAcceptRequestOfPatient} listing 
 * @transaction
 */

 async function doctorAcceptRequestOfPatient(listing){
    return getAssetRegistry('org.basic.server.Request').then(async function (requestRegistry){
        var req=await requestRegistry.get(listing.requestId);

        
        var resourceRegistry=await getAssetRegistry('org.basic.server.'+req.resourceType);
        var resource=await resourceRegistry.get(req.resourceId);

        var owner=req.owner;

        resource.authorizedPatients.push(owner);

        await resourceRegistry.update(resource);

        req.status="Accepted";
        await requestRegistry.update(req);
    })
 }

 /**
 * Sample transaction
 * @param {org.basic.server.transaction.PatientAcceptRequestOfDoctor} listing 
 * @transaction
 */

 async function patientAcceptRequestOfDoctor(listing){
     return getAssetRegistry('org.basic.server.Request').then(async function (requestRegistry){
        var req=await requestRegistry.get(listing.requestId);

        var resourceRegistry=await getAssetRegistry('org.basic.server.'+req.resourceType);
        var resource=await resourceRegistry.get(req.resourceId);

        var owner=req.owner;

        resource.authorizedDoctors.push(owner);

        await resourceRegistry.update(resource);
        req.status="Accepted";
        await requestRegistry.update(req);
     })
 }