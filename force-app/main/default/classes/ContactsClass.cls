public with sharing class ContactsClass {
    public ContactsClass() {
    }
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactsbyfilter(String fname ,string lead){   
      String keyString ='%'+fname+'%';   
      String leads = '%'+lead +'%';   
      return Database.query('Select Name,Phone,LeadSource from Contact where (Firstname like:keyString  AND LeadSource like:leads )');   
    
    }
   
}
