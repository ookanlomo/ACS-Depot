#### This article details the steps required to interact with the ACS and AGS services and APIs, creating a RM folder with the same name as the original folder name and declaring the child docs as records in the RM folder

### Use-Case / Requirement

Trigger creation of an Record Management folder in a targeted file plan & declare documents in the original folder as records in the newly created Records Management folder contained in a file plan

### Prerequisites to run this demo end-2-end

* Alfresco Content Services (Version 7.0 and above)
* [HTTP Jar](../http_js-platform-1.0-SNAPSHOT.jar) 
* [JS Console - Repo](artifacts/javascript-console-repo-0.7-SNAPSHOT.amp)  (if running on ACS v7.0/7.1)
* [JS Console - Share](artifacts/javascript-console-share-0.7-SNAPSHOT.amp)  (if running on ACS v7.0/7.1)

## Configuration Steps

1. Deploy the [http_js-platform-1.0-SNAPSHOT.jar](artifacts/http_js-platform-1.0-SNAPSHOT.jar) file to ACS. Full credits and thanks to [Rui Fernandes](https://github.com/rjmfernandes) and [Sherry Matthews](https://github.com/sherrymax/) for their previous ideas and contributions this jar is building upon.
2. Restart ACS Server/Container.
3. Create Script with desired logic and deploy to ACS, Example -> [RM_CreateFolder_DeclareDocs.js](artifacts/RM_CreateFolder_DeclareDocs.js)
4. Update ACS folder rules to run script for desired criteria

## Javascript examples that invoke HTTP

```javascript
		var requestBody = '{"name":"' + document.name + '","nodeType":"rma:recordFolder"}';
		logger.log(requestBody);
		//replace {HostName}
		//replace {TargetRecordCategory} with parent record category nodeID
		//creates record folder
		var r = http2.post('{HostName}/alfresco/api/-default-/public/gs/versions/1/record-categories/{TargetRecordCategory}/children',requestBody, "","demo", "demo");
```


```javascript
		var requestBody = '{}';				
		//replace {HostName}
		//replace {TargetRecordCategory} with parent record category nodeID
		//declares doc as record in target folder folderID
		http2.post('{HostName}/alfresco/api/-default-/public/gs/versions/1/files/'+ test[doc].getId() +'/declare?hideRecord=false&parentId=' + folderID,requestBody, "","demo", "demo")
```

## Run the DEMO

## References
* AGS API Info : <https://docs.alfresco.com/governance-services/latest/develop/>
