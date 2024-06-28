import { LightningElement, track } from 'lwc';
import createCaseWithRequests  from '@salesforce/apex/ET_global_Event_Request_Controller.createCaseWithRequests';

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
    handleInputChange(event) {
        const field = event.target.fieldName;
        if (field === 'AccountId') {
          
        } else if (field === 'ContactId') {
            this.accountId = '0013M00001QY8QsQAL';
            this.contactId = event.target.value;
        } 
    }

    handleEseInputChange(event) {
        const index = event.target.dataset.id;
        console.log('index'+index);
        const field = event.target.dataset.field;
        this.eseRequestLines[index][field] = event.target.value;
    }
    handleSelectedLookup(event) {
        const index = event.target.dataset.id;
        alert('data'+index);
        this.schoolaccountId = event.detail;
        console.log('index'+JSON.stringify(event.detail));
        this.eseRequestLines[index].School_Names__c = event.detail;

    }
    /*
    lookupRecord(event){
        const index = event.target.dataset.index;
        console.log('index'+index);
        const selectedRecord = event.detail.selectedRecord;
       
       console.log('Account Name' +JSON.stringify(event.detail.selectedRecord));
        if (index == undefined && selectedRecord) {
            console.log('Account Name  ' +selectedRecord.Id);
            this.eseRequestLines[index].School_Names__c = selectedRecord.Id;
            this.eseRequestLines = [...this.eseRequestLines];
        }
        //alert('Selected Record Value on Parent Component is ' +  JSON.stringify(event.detail.selectedRecord));
    }
        */

    createCaseWithESERequestLines() {
        console.log('ESE Request Lines:', JSON.stringify(this.eseRequestLines, null, 2));
       
        createCaseWithRequests({
            accountId: this.accountId,
            contactId: this.contactId,
            recordTypeId: this.recordTypeId,
            eseRequestLines: this.eseRequestLines
        })
        .then(result => {
           
       
            alert('Case and ESE Request Lines created successfully');
        })
        .catch(error => {
            alert('Error Message'+ error);
            console.error('Error creating Case and ESE Request Lines', error);
        });
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }
}