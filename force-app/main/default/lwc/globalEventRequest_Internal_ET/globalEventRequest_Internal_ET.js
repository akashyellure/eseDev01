import { LightningElement, track } from 'lwc';
import createCaseWithRequests  from '@salesforce/apex/ET_global_Event_Request_Controller.createCaseWithRequests';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
 
export default class GlobalEventRequest_Internal_ET extends LightningElement {
    	
    schoolaccountId;
    @track accountId = '';
    @track contactId = '';
    @track recordTypeId = '0123z000000OJ00AAG'; // Add the record type ID
    @track eseRequestLines = [
        {  // id:0,
           number: 1,
            School_Names__c: '',
            Trip_Date__c: '',
            Trip_Destination_From__c: '',
            Trip_Destination_To__c: '',
            Trip_Coordinator_Name__c: '',
            Coordinator_Phone__c: '',
            Email__c: '',
            Cycle__c: '',
            Count_Of_Students__c: '',
            Special_Need_Students_Count__c: '',
            Supervisors_Count_From_School__c: '',
            Arrival_Time_To_Activity__c: '',
            Assembly_Point__c: '',
            Landmark_Trip_To__c: '',
            Landmark_Trip_From__c: '',
            Gender_AR__c: '',
            Gender__c: '',
            Leaving_time_from_Location__c: ''
        
        }
    ];


    addESERequestLine() {
        this.eseRequestLines =
         [...this.eseRequestLines, 
            { 
          // id: this.eseRequestLines.length, 
           number: this.eseRequestLines.length + 1, 
            School_Names__c: '', 
            Trip_Date__c: '',
            Trip_Destination_From__c: '',
            Trip_Destination_To__c: '',
            Trip_Coordinator_Name__c: '',
            Coordinator_Phone__c: '',
            Email__c: '',
            Cycle__c: '',
            Count_Of_Students__c: '',
            Special_Need_Students_Count__c: '',
            Supervisors_Count_From_School__c: '',
            Arrival_Time_To_Activity__c: '',
            Assembly_Point__c: '',
            Landmark_Trip_To__c: '',
            Landmark_Trip_From__c: '',
            Gender_AR__c: '',
            Gender__c: '',
            Leaving_time_from_Location__c: ''
        }
        ];
    }
    deleteESERequestLine(event) {
        const index = event.target.dataset.id;
        if (this.eseRequestLines.length > 1) {
            this.eseRequestLines = this.eseRequestLines.filter((_, i) => i != index).map((line, i) => ({ ...line, number: i + 1 }));
        }else{
            this.showToast('Error', 'Cannot delete the last row.', 'error');

        }
      
    }
      genderOptions = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Other', value: 'Other' }
    ];
    handleInputChange(event) {
        const field = event.target.fieldName;
       if (field === 'ContactId') {
            this.accountId = '0013M00001QY8QsQAL';
            this.contactId = event.target.value;
        }else if(field ==='Type_Of_Case__c'){
            this.Type_Of_Case__c=event.target.value;
        }
    }

    handleEseInputChange(event) {
        const index = event.target.dataset.id;
        const field = event.target.dataset.field;
        this.eseRequestLines[index][field] = event.target.value;
    }
    handleSelectedLookup(event) {
        const index = event.target.dataset.id;
        this.schoolaccountId = event.detail;
        console.log('index'+JSON.stringify(event.detail));
        this.eseRequestLines[index].School_Names__c = event.detail;

    }

    validateFields() {
        let allValid = true;
        const inputs = this.template.querySelectorAll('lightning-input');
        for (let input of inputs) {
            if (!input.reportValidity()) {
                allValid = false;
                return allValid;
            }
        }

        for (let line of this.eseRequestLines) {
            for (let key in line) {
                if (!line[key]) {
                    this.showToast('Error', `Field ${key} is required`, 'error');
                    allValid = false;
                    return allValid;
                }
            }
        }

        return allValid;
    }
    createCaseWithESERequestLines() {
        if (this.validateFields()) {
            createCaseWithRequests({
                accountId: this.accountId,
                contactId: this.contactId,
                recordTypeId: this.recordTypeId,
                eseRequestLines: this.eseRequestLines
            })
            .then(result => {
                this.showToast('Success', 'Case and ESE Request Lines created successfully', 'success');
            })
            .catch(error => {
                this.handleErrors(error);
                console.error('Error creating Case and ESE Request Lines', error);
            });
        } else {
            this.showToast('Error', 'Please fill all mandatory fields correctly', 'error');
        }
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({ 
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }

    handleErrors(error) {
        if (error.body) {
            if (error.body.message) {
                this.showToast('Error', error.body.message, 'error');
            } else if (error.body.fieldErrors) {
                for (const field in error.body.fieldErrors) {
                    error.body.fieldErrors[field].forEach(fieldError => {
                        this.showToast('Field Error', fieldError.message, 'error');
                    });
                }
            } else if (error.body.pageErrors) {
                error.body.pageErrors.forEach(pageError => {
                    this.showToast('Page Error', pageError.message, 'error');
                });
            }
        } else {
            this.showToast('Error', 'Unknown error', 'error');
        }
    }


 
 
}