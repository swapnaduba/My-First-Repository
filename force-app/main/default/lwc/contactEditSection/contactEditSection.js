import { LightningElement, wire,track, api } from 'lwc';
import CONTACT_OBJ from '@salesforce/schema/Contact';
import NAME_FIELD from '@salesforce/schema/Contact.Name';
import LEADSOURCE_FIELD from '@salesforce/schema/Contact.LeadSource';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { subscribe, unsubscribe, APPLICATION_SCOPE, MessageContext, publish } from 'lightning/messageService';
import ContFilterChannel from '@salesforce/messageChannel/ContactService__c';
import ContFilterChannel_2 from '@salesforce/messageChannel/ContactService2__c'; 

import { CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';


export default class ContactEditSection extends LightningElement {
    fields = [NAME_FIELD, LEADSOURCE_FIELD, EMAIL_FIELD];
    objectName = CONTACT_OBJ;
    recordId = null;
    recorIdTemp = null;
    subscription = null;
    @wire(CurrentPageReference) pageRef;

    @wire(MessageContext)
    messageContext;

    connectedCallback(){
        this.subscribeToMC();
    }
    disconnectedCallback(){
        this.unsubscribeToMC();
    }

    subscribeToMC(){
        if(!this.subscription){
            this.subscription = subscribe(
                this.messageContext,
                ContFilterChannel,
                (message) => this.handleMessageFromList(message),
                {scope : APPLICATION_SCOPE}
            );
        }
    }
    unsubscribeToMC(){
        console.log('came into edit section unsubscription')
        this.subscription = null;
        unsubscribe(this.subscription);
    }

    handleMessageFromList(message){
        this.recordId = message.recordId;
    }

    handleContactEditSuccess(event){
        
       // console.log('after edit'+ this.recordId);
       // this.recorIdTemp = this.recordId;
        this.dispatchEvent(
            new ShowToastEvent({
                title : 'Success !!',
                message : 'Contact Updated Successfully !',
                variant : 'success'
            })      
        );
            fireEvent(this.pageRef,'messageSend','true');
       // const message = {editedContactId : this.recordId};
      //  console.log(this.recordId+'recordId');
      // publish(this.messageContext, ContFilterChannel, message);
        //this.recordId = this.recorIdTemp;
        //console.log('after edit '+ this.message); 
    }
    


}