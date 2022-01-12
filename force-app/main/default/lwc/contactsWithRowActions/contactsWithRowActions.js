import { LightningElement , track, wire } from 'lwc';
import  getContactsbyfilter from '@salesforce/apex/ContactsClass.getContactsbyfilter';
import { refreshApex } from '@salesforce/apex';

import { subscribe, unsubscribe, APPLICATION_SCOPE, MessageContext, publish } from 'lightning/messageService';
import ContFilterChannel from '@salesforce/messageChannel/ContactService__c'; 
import ContFilterChannel_2 from '@salesforce/messageChannel/ContactService2__c'; 

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { deleteRecord } from 'lightning/uiRecordApi';

import { CurrentPageReference } from 'lightning/navigation';
import { registerListener,unregisterAllListeners,fireEvent } from 'c/pubsub'; 


const actions = [
    {label:'Edit', name:'edit'},
    {label:'Delete', name:'delete'}
]
const cols = [
    {label:'Name', fieldName:'Name',type:'text'},
    {label:'Email', fieldName:'Email', type:'email'},
    {label:'Phone Number', fieldName:'MobilePhone', type:'phone'},
    {type:'action', typeAttributes:{ rowActions:actions, menuAlignment:'right'} },
];


export default class ContactsWithRowActions extends LightningElement {
    contactColumns = cols;
   @track conNameFltr = '';
   @track conLeadSourceFltr = '';
   @track conList;
   @track boolean;
   @track recordId='';
   @track message;
   @wire(CurrentPageReference) pageRef;

    openNewContactModal = false;
    isLoading = false;

    @wire(MessageContext)
    messageContext;
    
    @wire(getContactsbyfilter, {fname : '$conNameFltr', lead : '$conLeadSourceFltr'})
    contacts;

    subscription = null;
    subscription_2 = null;
    connectedCallback(){
        this.subscribeToLMC();
        registerListener('messageSend',this.handleMessageSend,this);
    }
    handleMessageSend(publisherMessage){
        this.message = publisherMessage;
        this.handleEdit(this.message);
        console.log('messagevalue '+this.message);
    }
   // refresh(){
       // refreshApex(this.contacts);
    //}
    disconnectedCallback(){
        this.unsubscribeToLMC();
       // unregisterAllListeners(this);
    }
    
    subscribeToLMC(){
        console.log("1");
        if(!this.subscription){
            this.subscription = subscribe(
                    this.messageContext,
                    ContFilterChannel,
                    (message) => this.handleMessage(message),
                    {scope : APPLICATION_SCOPE}
            );
            
            console.log("if 1");
        }
    }
   
    unsubscribeToLMC(){
        this.subscription = null;
        unsubscribe(this.subscription);
    }

    handleMessage(message){
        //console.log({'message from filter cmp' : message});
        this.conNameFltr = message.contactName;
        console.log("conNameFltr:"+message.contactName);
        this.conLeadSourceFltr = message.leadSource;
        console.log("conLeadSourceFltr:"+message.leadSource);
       
    }
    openCloseNewConatctModal(){
        this.openNewContactModal = !this.openNewContactModal;
    }

    handleContactSubmit(){
        this.isLoading = true;
    }
    handleContactSuccess(event){
        this.isLoading = false;
        this.openNewContactModal = false;
        this.showThePopupMessage('Success', 'Contact Created Successfully!', 'success');
        console.log('success');
        refreshApex(this.contacts);
    }

    handleContactRowAction(event){
        let row = event.detail.row;
        let action = event.detail.action.name;
        console.log({'actionName' : action, 'rowId' : row.Id});
        switch(action){
            case 'edit':
                this.editTheContact(row);
                break;
            case 'delete' :
                this.deleteTheContact(row);
                break;
        }
    }
    deleteTheContact(currentRow){
        deleteRecord(currentRow.Id)
            .then(()=>{
                this.showThePopupMessage('Success', 'Contact Deleted Successfully !', 'success');
                refreshApex(this.contacts);
                console.log('deleted contact : '+this.contacts);
            })
            .catch(error =>{
                this.showThePopupMessage('Error', 'Your attempt to delete '+currentRow.Id +' could not be completed because it is associated with a particular Case');
            });
        
    }
 
    editTheContact(currentRow){
        this.recordId = currentRow.Id;
        const payloadforEdit = {recordId : currentRow.Id};
        publish(this.messageContext, ContFilterChannel, payloadforEdit);
        console.log({'conatcts':this.contacts});
    }

    showThePopupMessage(messageTitle, message, messageVariant){
        this.dispatchEvent(
            new ShowToastEvent({
                title: messageTitle,
                message: message,
                variant: messageVariant
            })
        );
    }
    handleEdit(message){
        console.log('editform');
        console.log('loading');
        refreshApex(this.contacts);
        console.log(this.contacts+'Contacts');
        console.log('refreshed');
    }
    
}