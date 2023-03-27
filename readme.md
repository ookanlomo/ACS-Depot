#### This article details the steps required to configure Alfresco Intelligence Service (AIS) to perform Rekognition for objects, people, text, scenes, and activities identificaton to auto label content within ACS.  Useful when looking to drive additional processing based on subjects identified.    

### Use-Case / Requirement
The Alfresco system should perform powerful visual analysis on ingested documents.  Using Rekognition objects, scenes, activities, landmarks, faces, dominant colors, and image quality should be available as metadata of the ingested document.  This metadata can be used to deliver timely and actionable alerts when a desired object is detected. Use facial comparison and analysis in your user onboarding and authentication workflows to remotely verify the identity of a user.  The list of use cases could go on.

### How It Works
Alfresco Intelligence Service leverages AWS Rekognition which uses ML, once trained, to extract iand identify objects and scenes in images that are specific to your business needs.

###Documentation
1. https://docs.alfresco.com/intelligence-services/latest/
2. https://docs.alfresco.com/intelligence-services/latest/admin/
3. https://docs.aws.amazon.com/rekognition/latest/dg/what-is.html


##Configuration
1. Install/Deploy `Alfresco Intelligence Services`.
> Note: ADP Users should deploy AIS using `./adp.py deploy ai` followed by STOP and START of all containers.

2. Install/Deploy `Alfresco Gosvernance Services`
> Note: ADP Users should deploy AIS using `./adp.py deploy ags` followed by STOP and START of all containers.

3. Create Security Marks in Administration console

4. Create Classification Guide in the administration console

5. Use Governance Security Marks API to find the Group ID and Security Mark ID 
[GroupID API](assets/Groupid.png)
[Security Mark API](assets/secmark.png)
2. Develop the Javascript for OCR extraction and updating the metadata.

<details>
		<summary>Expand this section for the javascript.</summary>
``` javascript
var doc = document;


//schema:piiEntityTypes

performDataExtraction();


function invokeUntilAvailable(renditionName) {
    var _rendition = getAISRendition();

//retry getting ais reditiion else return rendition object
    for (var i = 0;(_rendition == undefined || _rendition == null); i++) {
		if(i < 1000)
		{
			_rendition = getAISRendition(renditionName);
			logger.info("COUNTER - " + i + " - IS RENDITION UNDEFINED ???  - " + (_rendition == undefined || _rendition == null));
		}
		else
		{
			break;	
			
		}
	}

    return _rendition;
}

//rendition name is cm:aiRekognition passed in performDataextracting
function getAISRendition(renditionName) {
    return renditionService.getRenditionByName(doc, renditionName);
}



function performDataExtraction() {

		logger.log("Performing Extraction");


//function to get rendition
	var aisRendition = invokeUntilAvailable("cm:aiPiiEntities");
	
	
    if (aisRendition !== undefined && aisRendition !== null) 
	{
        logger.info("**** RENDITION IS VERY MUCH AVAILABLE ****");

		//find rendition doc
        var rdoc = search.findNode(aisRendition.nodeRef);
        if (rdoc !== null && rdoc.content !== undefined) 
		{

		//parse rendition JSON return
            var j = JSON.parse(rdoc.content);
			
			const obj = JSON.parse(rdoc.content);
			
			logger.log("Interating through redition json " + typeof j);
			
            // check if response node is null/undefined
			
            if (j !== undefined && j !== null) 
			{
				//loop through parsed response object
				for (var x in j) 
				{
					
					//print obejct and child
						logger.log(x + ":"+ j[x]);
						logger.log("Object Type: " + typeof x);

					//assign child object to variable
						var schemas = j[x];

					//loop through child object
						for (var t in schemas) 
						{
							logger.log(t + ":"+ schemas[t]);
							if(t === "entities")
							{
								logger.log("interating through entities");
								var parsed = JSON.stringify(schemas[t]);

								logger.log("print: "  + parsed);

								for(var key in schemas[t])
								{
									logger.log("key " + key);	
									logger.log("key " + schemas[t][key]);	
									logger.log("PII Type " + schemas[t][key].type);
									logger.log("PII Confidence " + schemas[t][key].score);
									
									if(schemas[t][key].type == "SSN")
									{
										logger.log(schemas[t][key].type + " Identified ");
										logger.log("parent id: " + document.getParent().id);
										

										var requestBody = '{"id": "zMKc15jZ","groupId": "5643299b-8f8c-4f47-8f62-7cd51cac6766","op": "ADD"}';										

										logger.log(requestBody);
										
																											
										http.post('{HostName}/alfresco/api/-default-/public/gs/versions/1/secured-nodes/' + document.getParent().id + '/securing-marks', requestBody, "application/json;charset=UTF-8", "demo", "demo");
										logger.error(r);									
									}
									if(schemas[t][key].type == "BANK_ROUTING")
									{
										logger.log(schemas[t][key].type + " Identified ");
										logger.log("parent id: " + document.getParent().id);
										

										var requestBody = '{"id": "zMKc15jZ","groupId": "5643299b-8f8c-4f47-8f62-7cd51cac6766","op": "ADD"}';												logger.log(requestBody);
										
																											
										http.post('{HostName}/alfresco/api/-default-/public/gs/versions/1/secured-nodes/' + document.getParent().id + '/securing-marks', requestBody, "application/json;charset=UTF-8", "demo", "demo");
										logger.error(r);									

									}									
									if(schemas[t][key].type == "PASSPORT_NUMBER")
									{
										logger.log(schemas[t][key].type + " Identified ");
										logger.log("parent id: " + document.getParent().id);
										

										var requestBody = '{"id": "caCl4PB0","groupId": "ee79c1ef-2c08-4f66-b5c8-6a837560105e","op": "ADD"}';												logger.log(requestBody);
										
																											
										http.post('{HostName}/alfresco/api/-default-/public/gs/versions/1/secured-nodes/' + document.getParent().id + '/securing-marks', requestBody, "application/json;charset=UTF-8", "demo", "demo");
										logger.error(r);											
									}									
								}
							}
							
						}
						
					}
		            logger.log("AWS PII Classification Updated for " + document.getParent().name + " : " + document.getParent().id);

				}

            }

            logger.log("\n--- **** **** **** ---\n");

    } else {
        logger.info("**** RENDITION IS NOT YET AVAILABLE. AIS IS WORKING ON THE DOCUMENT ****");
    }

}
```
</details>
<br/>

4. Save and update the description of the javascript

5.  Configure Folder Rules to:
    1. Add Aspects.
    ![add-aspects](assets/5a.png)
    2. Perform AI Renditions (AWS Comprehend).
    ![ai-rendition](assets/5b.png)
    3. Execute javascript to update metadata.
    ![execute-js](assets/5c.png)


### ACS : Results
The resulting view :
![result](assets/5d.png)