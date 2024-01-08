## config -> data-models -> user.ts

  By that simple case we see that

  Use case: Create user _-_ 
  Domain -> maps into -> Data Model (and inserts)
  Use case: Read user
  Data Model -> maps into -> Domain 

  By that simple case we see that Domain is decoupled from persistence concerns

  But Domain is still not secured from persistence since it exposes its inner nature (public properties)
  To get all benefits of encapsulation, we may increase privacy of Entities and expose it by applying Memento Pattern 

  After that refactoring _-_
  Use case: Create User
  Domain -> create Snapshot of current Domain structure -> map Snapshot into -> Data Model
  Use case: Read user
  Data Model -> create empty Snapshot of Domain structure and map Data Model values into Snapshot of Domain -> create Domain from prefilled Snapshot

  Thus, Domain and Data Model are decoupled and safe to be changed, when only just Snapshot needs to be updated.

  Keep in mind that while you will get a lot of benefits, it may take a lot of time to implement. 
  So, FIRST of all try to ask yourself 
    - will particular part of a system be worth of time and qulity that will be spent,
    - will it provide a lot of value to business
    - etc 


```csharp
  // Great code example of what was previously said
public class AuctionRepository {
  public void Save(Auction auction)
  {
    var auctionDataModel = db.Auction.Find(auction.Id);     // Data Model
    var auctionSnapshot = auction.GetSnapshot()             // Domain model current state Snapshot
    Map(auctionDataModel, auctionSnapshot);                 // Map Snapshot -> Data Model (Domain -> Snapshot -> Data Model)
  }

  public Auction FindBy(Guid Id)
  {
    var auctionDataModel = db.Auction.Find(Id);                     // Data Model
    var auctionSnapshot = new AuctionSnapshot();                    // Domain model blank Snapshot

    auctionSnapshot.Id = auctionDataModel.Id;                       // Fill blank Snapshot with Data Model values
    
    var auctionDomainModel = Auction.CreateFrom(auctionSnapshot);   // Create Domain model from prefilled Snapshot (Data Model -> Snapshot -> Domain)
    return auctionDomainModel
  }
}
```