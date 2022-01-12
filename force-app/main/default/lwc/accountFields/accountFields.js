import { LightningElement, track } from 'lwc';
import getAccountFields from '@salesforce/apex/AccountClass.getAccountFields';
 

export default class AccountFields extends LightningElement {
    @track listOfSelectedFields = [];
    @track sendingFields = [];
    @track Fields;
    @track errors;
    connectedCallback(){
        getAccountFields()
        .then(result=>{
            this.Fields = result;
        })
        .catch(error=>{
            this.errors = error;
        })
    }
    addSelect(event){
        this.listOfSelectedFields.push(event.target.value);
    }
    sendSelectedItems(){
       this.sendingFields = this.listOfSelectedFields;
    }
}