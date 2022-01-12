import { LightningElement, track, wire } from 'lwc';
import CONTACT_OBJ from '@salesforce/schema/Contact';
import LEADSOURCE_FIELD from '@salesforce/schema/Contact.LeadSource';
import { getObjectInfo, getPicklistValues  } from 'lightning/uiObjectInfoApi';

import {publish, MessageContext} from 'lightning/messageService';
import ContFilterChannel from '@salesforce/messageChannel/ContactService__c';

export default class ContactFilterSection extends LightningElement {
    contactDefaultRecordType = '';
    @track leadSourceOptions;
    @track conName = '';
    @track leadSource;

    @wire(MessageContext)
    messageContext;

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
        this.conName = event.target.value;
        this.publishing();
    }

    handleLeadSourceChange(event){
        console.log(event.detail.value);
       this.leadSource = event.detail.value;
        this.publishing();
    }
    publishing(){
        const message = {
            contactName: this.conName,
            leadSource: this.leadSource
        };
        publish(this.messageContext, ContFilterChannel, message);
    }
}