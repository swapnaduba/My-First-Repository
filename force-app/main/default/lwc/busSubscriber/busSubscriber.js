import { LightningElement, track} from 'lwc';
// Import message service features required for publishing and the message channel
import {publish,createMessageContext,subscribe,unsubscribe,APPLICATION_SCOPE } from 'lightning/messageService';
import BusMC from '@salesforce/messageChannel/BusMessageChannel__c';
import BusMC1 from '@salesforce/messageChannel/BusMessageChannel__c';
import getBusData from '@salesforce/apex/BusData.getBusData';
import Year from '@salesforce/schema/Bus__c.Year__c';
import Maximum_Capacity from '@salesforce/schema/Bus__c.Maximum_Capacity__c';
import Odometer_Reading from '@salesforce/schema/Bus__c.Odometer_Reading__c';
import Resale_Value from '@salesforce/schema/Bus__c.Resale_Value__c';

export default class BusSubscriber extends LightningElement {
    context = createMessageContext();
    subscription = null;
    @track busId;
    @track objectApiName='Bus__c';
    fields = [Year,Maximum_Capacity,Odometer_Reading];
    fieldName = Resale_Value;
    connectedCallback(){
        this.subscribeMC();
    }
    subscribeMC(){
        if(this.subscription){
            return;
        }
        this.subscription = subscribe(this.context, BusMC,(message) => {
            this.handleMessage(message);
        }),{scope: APPLICATION_SCOPE};
    }
    handleMessage(message){
        this.busId = message.recordId;
    }
    handleChange(event){
        const message = {
            recordId: event.target.dataset.value
        };
        publish(this.context,BusMC1,message);
    }
}