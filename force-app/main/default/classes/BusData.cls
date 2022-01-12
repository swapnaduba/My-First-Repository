public with sharing class BusData {
    public BusData() {

    }
    @AuraEnabled

    public static List<Bus__c> getBusData(){

       return [select id,Picture__c,Year__c,Maximum_Capacity__c,Odometer_Reading__c,Resale_Value__c From Bus__c];

    }
}
