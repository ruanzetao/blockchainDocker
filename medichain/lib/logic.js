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
async function participantDoctor(listing) {
    var factory = await getFactory();

    return getParticipantRegistry('org.basic.server.Doctor').then(async function (doctorRegistry) {
        doctorNew = await factory.newResource("org.basic.server", "Doctor", listing.personId)
        doctorNew.name = listing.name;
        doctorNew.address = listing.address;
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
 * @param {org.basic.server.transaction.CreatePatient} listing
 * @transaction
 */

async function participantPatient(listing) {
    var factory = getFactory();

    return getParticipantRegistry('org.basic.server.Patient').then(async function (patientRegistry) {
        patientNew = await factory.newResource("org.basic.server", "Patient", listing.personId)
        patientNew.name = listing.name;
        patientNew.address = listing.address;
        patientNew.email = listing.email;
        patientNew.phone = listing.phone;
        patientNew.type = listing.type;
        patientNew.sex = listing.sex;
        patientNew.createAt = listing.createAt;

        return await patientRegistry.add(patientNew);
    });
}
