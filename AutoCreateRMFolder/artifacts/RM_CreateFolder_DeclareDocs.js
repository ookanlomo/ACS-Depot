function main()
{
	try
	{
		RM();
	}
	catch(r)
	{
		logger.log("Unable to Successfully Process Request");		
		logger.error(r);		
	}

}

function RM ()
{
	var folderID;
	
	//Update the evaluation criteria to the desired property and value
	if(document.properties["{targetproperty}"] = "{targetValue}")
	{
		var requestBody = '{"name":"' + document.name + '","nodeType":"rma:recordFolder"}';
		logger.log(requestBody);
		//replace {HostName}
		//replace {TargetRecordCategory} with parent record category nodeID
		//creates record folder
		var r = http2.post('{HostName}/alfresco/api/-default-/public/gs/versions/1/record-categories/{TargetRecordCategory}/children',requestBody, "","demo", "demo");
		logger.log(r);
		
		
		//get created folder id
		//loop through target node to find documents in ex. personal auto/2023 folder
		
		//GET FOLDER ID
		var j = JSON.parse(r);
		logger.log("parsing");
		for (var x in j.entry) 
		{
			logger.log(x);
			if(x == "id")
			{
				var folderID = j.entry[x];
				logger.log("Folder ID Created: " + folderID);
			}
		}
		
		
		//FIND DOCS TO DECLARE AS RECORD

		var childfolders = document.getChildren();
		for(var lob in childfolders)
		{
			logger.log(childfolders[lob].getName());
			//first level folder
			if(childfolders[lob].getName() == "{FirstLevelFolder}")
			{
				var years = childfolders[lob].getChildren();
				for (var year in years)
				{
					logger.log(years[year].getName());	
					var test = years[year].getChildren();
					for( var doc in test)
					{
						logger.log("Doc Type: " +test[doc].getType());
						logger.log("Doc ID: " +test[doc].getId());

						var requestBody = '{}';
						
						http2.post('{HostName}/alfresco/api/-default-/public/gs/versions/1/files/'+ test[doc].getId() +'/declare?hideRecord=false&parentId=' + folderID,requestBody, "","demo", "demo")
					}
				}				
			}			
		}
	}	

}


main();