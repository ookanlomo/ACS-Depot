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
[GroupID API](assets/Groupid.png) <br/>
[Security Mark API](assets/secmark.png)
2. Develop the Javascript for OCR extraction and updating the metadata.

<details>
		<summary>Expand this section for the javascript.</summary>
``` javascript									
				if(schemas[t][key].type == "SSN")
				{
					logger.log(schemas[t][key].type + " Identified ");
					logger.log("parent id: " + document.getParent().id);
										
					var requestBody = '{"id": "zMKc15jZ","groupId": "5643299b-8f8c-4f47-8f62-7cd51cac6766","op": "ADD"}';										

					logger.log(requestBody);
										
																											
					http.post('{HostName}/alfresco/api/-default-/public/gs/versions/1/secured-nodes/' + document.getParent().id + '/securing-marks', requestBody, "application/json;charset=UTF-8", "demo", "demo");
					logger.error(r);									
				}
```
```javascript
				if(schemas[t][key].type == "BANK_ROUTING")
				{
					logger.log(schemas[t][key].type + " Identified ");
					logger.log("parent id: " + document.getParent().id);
										
					var requestBody = '{"id": "zMKc15jZ","groupId": "5643299b-8f8c-4f47-8f62-7cd51cac6766","op": "ADD"}';												
					logger.log(requestBody);					
																											
					http.post('{HostName}/alfresco/api/-default-/public/gs/versions/1/secured-nodes/' + document.getParent().id + '/securing-marks', requestBody, "application/json;charset=UTF-8", "demo", "demo");
					logger.error(r);									

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