public with sharing class AccountClass {
    public AccountClass() {

    }
    @AuraEnabled
    public static List<String> getAccountFields(){
        SObjectType accountType = Schema.getGlobalDescribe().get('Account');
        Map<String,Schema.SObjectField> mfields = accountType.getDescribe().fields.getMap();

        List<String> sObjectDetailsList = new List<String>();
        for(String s : mfields.keySet()){
            sObjectDetailsList.add(String.valueOf(mfields.get(s)));
        }
        return sObjectDetailsList;
    }

}
