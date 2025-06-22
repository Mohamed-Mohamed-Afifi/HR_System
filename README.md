# current system behavior
- On Select From **==TT_TS_FLIGHT_BOOK==** table
- On Update at **==TT_TS_FLIGHT_BOOK==** table
- On Insert at **==TT_TS_FLIGHT_BOOK==** table

```
@Table(name = "TT_TS_FLIGHT_BOOK")
public class TTFlightBook{

	***@OneToMany( mappedBy = "ttFlightBook")
	private List<TTFlightLegDetail> ttFlightLegDetails ;***
	
	@OneToMany( mappedBy = "ttFlightBook")
	private List<TTFlightSegmentDetail> ttFlightSegmentDetails;

	@OneToMany( mappedBy = "ttFlightBook")
	private List<TTFlightPassengerDetail> ttFlightPassengerDetails ;

	@OneToMany( mappedBy = "ttFlightBook")
	private List<TTFlightPassengerSsr> ttFlightPassengerSsrs;

	@OneToMany( mappedBy = "ttFlightBook")
	private List<TTFlightPaxSegmentBookDetail> ttFlightPaxSegment;
	
	@OneToMany( mappedBy = "ttFlightBook")
	private TTFlightTaxFeeBreakUpV2 TTflighttaxfeebreakupV2;

	@OneToMany( mappedBy = "ttFlightBook")
	private List<TTFlightErrorDetail> ttFlightErrorDetails;


	@OneToMany( mappedBy = "ttFlightBook")
	private List<TTFlightInvoiceDetail> ttFlightInvoiceDetails;
	
	}
```

- On **Select** From  **==TT_TS_FLIGHT_BOOK==** table **OR** ==Any Related Child Of This Table==
		Because of explicit cascade type all table related to tt_flight_book will take the same action and behind the scene will generate select query even less we don't need it .
	 So to prevent this action we have two solution
		- Use Lazy Load but this will impact in many modules and may cause problems.
		- Reduce headache on Master database and move the select query that retrieve the tt_filght_book table and all of the related child to slave database
- _Cons of the second solution _
	-  Moving all related child of tt_flight_book is complex **AS** they are impact at lot of modules 
	- Can not predict the Master and Slave Synchronization problems 
- Available solutions : 
	- Detect where the child query affected directly without any impact on any other modules **Example ** : moving BookingReport reduce headache on TT_Flight_Leg Table 
		
