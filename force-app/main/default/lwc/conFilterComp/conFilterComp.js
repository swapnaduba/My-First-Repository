import { LightningElement, track,api,wire } from 'lwc';
import CONTACT_OBJ from '@salesforce/schema/Contact';
import LEADSOURCE_FIELD from '@salesforce/schema/Contact.LeadSource';
import { getObjectInfo, getPicklistValues  } from 'lightning/uiObjectInfoApi';
import getContactsbyfilter from '@salesforce/apex/ContactsClass.getContactsbyfilter';

const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    { label: 'leadsource', fieldName: 'LeadSource', type: 'picklist' },
    
];

export default class ConFilterComp extends LightningElement {
    @track data;
    @track isVisible = false;
     columns = columns;
    @track  data=[];
    @api recordId;
   
    
    
 connectedCallback(){
    getContactsbyfilter({fname:this.InputName,lead:this.LeadSource})
    .then(response => {
        this.data=response;

    })
 }

    

    contactDefaultRecordType = '';
    @track leadSourceOptions;
    @track InputName='';
    @track LeadSource='';
    

  
    @wire(getObjectInfo, {objectApiName : CONTACT_OBJ})
    contactObjInfo({data, error}){
        if(data){
            this.contactDefaultRecordType = data.defaultRecordTypeId;
        }
    }

    @wire(getPicklistValues, {recordTypeId : '$contactDefaultRecordType',fieldApiName : LEADSOURCE_FIELD})
    leadSourceValues({data,error}){
        if(data){
            console.log({picklistvalues: data.values});
            this.leadSourceOptions = [{label: 'All', value: ''}, ...data.values];
        }
        //this.leadSourceOptions.unShift({label : 'All', value :''});
    }

    handleNameInputChange(event){
         console.log(event.target.value);
        this.InputName=event.target.value;
        
       
    }

    handleLeadSourceChange(event){
        console.log(event.target.value);
    
        this.LeadSource=event.target.value;
    }
    @track contactList=[];
    @wire(getContactsbyfilter,{fname:'$InputName',lead:'$LeadSource'})
   retrieveContacts({error,data}){
       if(data){
           
            this.data = data;
        }
       else if(error){
            console.log(this.error);
          
        }

   }

}