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
 * @param {org.basic.server.transaction.CreateNewParticipant} participantInfo 
 * @transaction
 */
async function participantInfo(listing) {
    var factory = getFactory();

    return getParticipantRegistry('org.basic.server.Patient').then(async function (patientRegistry) {
        patientNew = await factory.newResource("org.basic.server", "Patient", listing.personId)
        patientNew.name = listing.name;
        patientNew = address = listing.address;
        patientNew.email = listing.email;
        patientNew.phone = listing.phone;
        patientNew.type = listing.type;
        patientNew.sex = listing.sex;
        patientNew.createAt = listing.createAt;

        return await patientRegistry.add(patientNew);
    });
}

/**
 * Sample transaction
 * @param {org.basic.server.transaction.CreateDoctor} participantDoctor
 * @transaction
 */
async function participantDoctor(listing) {
    var factory = getFactory();

    return getParticipantRegistry('org.basic.server.Doctor').then(async function (doctorRegistry) {
        doctorNew = await factory.newResource("org.basic.server", "Doctor", listing.personId)
        doctorNew.name = listing.name;
        doctorNew = address = listing.address;
        doctorNew.email = listing.email;
        doctorNew.phone = listing.phone;
        doctorNew.type = listing.type;
        doctorNew.sex = listing.sex;
        doctorNew.createAt = listing.createAt;

        return await doctorRegistry.add(doctorNew);
    });
}

/**
 * Sample transaction
 * @param {org.basic.server.transaction.CreatePatient} participantPatient
 * @transaction
 */

async function participantPatient(listing) {
    var factory = getFactory();

    return getParticipantRegistry('org.basic.server.Patient').then(async function (patientRegistry) {
        patientNew = await factory.newResource("org.basic.server", "Patient", listing.personId)
        patientNew.name = listing.name;
        patientNew = address = listing.address;
        patientNew.email = listing.email;
        patientNew.phone = listing.phone;
        patientNew.type = listing.type;
        patientNew.sex = listing.sex;
        patientNew.createAt = listing.createAt;

        return await patientRegistry.add(patientNew);
    });
}

/**
 * Sample transaction
 * @param {org.basic.server.transaction.CreateNewPatientInfo} patientInfo 
 * @transaction
 */
async function patientInfo(listing) {
    var factory = getFactory();

    return getAssetRegistry('org.basic.server.PatientInfo').then(async function (patientInfoRegistry) {
        patientInfoNew =await factory.newResource("org.basic.server", "PatientInfo", listing.patientInfoId)
        patientInfoNew.patientId = listing.patientId;
        patientInfoNew.name = listing.name;
        patientInfoNew.address = listing.address;
        patientInfoNew.email = listing.email;
        patientInfoNew.phone = listing.phone;
        patientInfoNew.type = listing.type;
        patientInfoNew.sex = listing.sex;
        patientInfoNew.createAt = listing.createAt;
        patientInfoNew.specialist = listing.specialist;

        patientInfoNew.authorizedDoctors = [];

        var owner = await factory.newRelationship("org.basic.server", "Patient", listing.patientId);

        patientInfoNew.owner = owner;

        await patientInfoRegistry.add(patientInfoNew);
    });
}

/**
 * Sample transaction
 * @param {org.basic.server.transaction.CreateNewDoctorInfo} doctorInfo 
 * @transaction
 */
async function doctorInfo(listing) {
    var factory = getFactory();

    return getAssetRegistry('org.basic.server.DoctorInfo').then(async function (doctorInfoRegistry) {
        doctorInfoNew =await factory.newResource("org.basic.server", "DoctorInfo", listing.doctorInfoId)
        doctorInfoNew.doctorId = listing.doctorId;
        doctorInfoNew.name = listing.name;
        doctorInfoNew.address = listing.address;
        doctorInfoNew.email = listing.email;
        doctorInfoNew.phone = listing.phone;
        doctorInfoNew.type = listing.type;
        doctorInfoNew.sex = listing.sex;
        doctorInfoNew.createAt = listing.createAt;
        doctorInfoNew.specialist = listing.specialist;

        doctorInfoNew.authorizedPatients = [];

        var owner = await factory.newRelationship("org.basic.server", "Doctor", listing.doctorId);

        doctorInfoNew.owner = owner;

        await doctorInfoRegistry.add(doctorInfoNew);
    });
}

/**
 * Sample transaction
 * @param {org.basic.server.transaction.CreateDoctorProfile} doctorProfile 
 * @transaction
 */

 async function doctorProfile(listing){
    var factory = getFactory();
    return getAssetRegistry('org.basic.server.DoctorProfile').then(async function (doctorProfileRegistry) {
        doctorProfileNew =await factory.newResource("org.basic.server", "DoctorProfile", listing.doctorProfileId)
        doctorProfileNew.participantId = listing.doctorId;
        doctorProfileNew.role = listing.role;
        doctorProfileNew.avatar = listing.avatar;
        doctorProfileNew.createAt = listing.createAt;  
        doctorProfileNew.updateAt = listing.updateAt;

        var owner = await factory.newRelationship("org.basic.server", "Doctor", listing.doctorId);

        doctorProfileNew.owner = owner;

        await doctorInfoRegistry.add(doctorProfileNew);
    });
 }

/**
 * Sample transaction
 * @param {org.basic.server.transaction.CreatePatientProfile} patientProfile 
 * @transaction
 */

async function patientProfile(listing){
    var factory = getFactory();
    return getAssetRegistry('org.basic.server.PatientProfile').then(async function (patientProfileRegistry) {
        patientProfileNew =await factory.newResource("org.basic.server", "PatientProfile", listing.patientProfileId)
        patientProfileNew.participantId = listing.patientId;
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
 * @param {org.basic.server.transaction.CreateRequest} createRequest 
 * @transaction
 */
async function createRequest(listing) {
    var factory = getFactory();

    return getAssetRegistry('org.basic.server.Request').then(async function (requestRegistry) {
        requestNew = await factory.newResource("org.basic.server", "Request", listing.requestId)

        requestNew.requesterRole = listing.requesterRole;
        requestNew.resourceOwnerRole = listing.resourceOwnerRole;
        requestNew.resourceType = listing.resourceType;
        requestNew.resourceId = listing.resourceId;

        requestNew.idRequester = listing.idRequester
        requestNew.idResourceOwner = listing.idResourceOwner;


        // --> Person owner
        // --> Person resourceOwner


        var owner = await factory.newRelationship("org.basic.server", requesterRole, listing.idRequester);
        var resourceOwner = await factory.newRelationship("org.basic.server", resourceOwnerRole, listing.idResourceOwner);
        requestNew.owner = owner;
        requestNew.resourceOwner = resourceOwner;


        await requestRegistry.add(requestNew);
    });
}

/**
 * Sample transaction
 * @param {org.basic.server.transaction.DoctorAcceptRequestOfPatient} doctorAcceptRequestOfPatient 
 * @transaction
 */

 async function doctorAcceptRequestOfPatient(listing){
    return getAssetRegistry('org.basic.server.Request').then(async function (requestRegistry){
        var req=requestRegistry.get(listing.requestId);

        
        var resourceRegistry=await getAssetRegistry('org.basic.server.'+req.resourceType);
        var resource=await resourceRegistry.get(req.resourceId);

        var owner=req.owner;

        resource.authorizedPatients.push(owner);

        await resourceRegistry.update(resource);
    })
 }

 /**
 * Sample transaction
 * @param {org.basic.server.transaction.PatientAcceptRequestOfDoctor} patientAcceptRequestOfDoctor 
 * @transaction
 */

 async function patientAcceptRequestOfDoctor(listing){
     return getAssetRegistry('org.basic.server.Request').then(async function (requestRegistry){
        var req=requestRegistry.get(listing.requestId);

        var resourceRegistry=await getAssetRegistry('org.basic.server.'+req.resourceType);
        var resource=await resourceRegistry.get(req.resourceId);

        var owner=req.owner;

        resource.authorizedDoctors.push(owner);

        await resourceRegistry.update(resource);
     })
 }