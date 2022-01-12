import { LightningElement, track} from 'lwc';
import getBusData from '@salesforce/apex/BusData.getBusData';

// Import message service features required for publishing and the message channel
import { publish, createMessageContext } from 'lightning/messageService';
import BusMC from '@salesforce/messageChannel/BusMessageChannel__c';

export default class BusPublisher extends LightningElement {
    context = createMessageContext();
    @track busData;
     @track errors;
    connectedCallback(){
        getBusData()
        .then(result=>{
            this.busData = result;
        })
        .catch(error=>{
            this.errors = error;
        })
    }
    handleClick(event){
        const message = {
            recordId: event.target.dataset.value
        };
        publish(this.context,BusMC,message);
    }
}