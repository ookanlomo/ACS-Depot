#### This article details the steps required to invoke HTTP calls from ACS, Updated to handle both 200 and 201 response codes from the Alfresco APIs

### Use-Case / Requirement

An HTTP call (GET, POST, PUT etc) has to be triggered from ACS.

### Prerequisites to run this demo end-2-end

* Alfresco Content Services (Version 7.0 and above)
* [HTTP Jar](../http_js-platform-1.0-SNAPSHOT.jar) 
* [JS Console - Repo](artifacts/javascript-console-repo-0.7-SNAPSHOT.amp)  (if running on ACS v7.0/7.1)
* [JS Console - Share](artifacts/javascript-console-share-0.7-SNAPSHOT.amp)  (if running on ACS v7.0/7.1)

## Configuration Steps

1. Deploy the [http_js-platform-1.0-SNAPSHOT.jar](artifacts/http_js-platform-1.0-SNAPSHOT.jar) file to ACS. Full credits and thanks to [Rui Fernandes](https://github.com/rjmfernandes) and [Sherry Matthews](https://github.com/sherrymax/) for their previous ideas and contributions this is building upon.
2. Restart ACS Server/Container.

## Javascript examples that invoke HTTP

```javascript
var requestBody = '{ "Id": 78912,  "Customer": "Jason Sweet", "Quantity": 1,  "Price": 18.00 }';
var r = http2.post(requestURL, requestBody, "application/json",'myuser','mypassword');
print(r);
```

```javascript
var requestBody = '{ "id": "9909", "name": "Sam Jackson M.D", "address": "123 Sample Ave, Harford, CT 08661"}';
var r = http2.post('http://ec2-1-2-3-4.compute-1.amazonaws.com:4000/doctors', requestBody, "", "", "");
logger.error(r);
```

```javascript
try {
    var hostName = 'http://' + sysAdmin.getHost();
	var requestBody = '{ "id": "9909", "name": "Sam Jackson M.D", "address": "123 Sample Ave, Harford, CT 08661"}';

    var res = http2.post(requestURL, requestBody, "application/json", 'demo', 'demo');
    logger.log(res);

} catch (ex) {
	logger.error(ex);
}
```

## Run the DEMO

## References
* Creating Script Root Object : <https://www.youtube.com/watch?v=jGG60evBQ44&t=84s>
* Get Alfresco HostName : <https://github.com/sherrymax/acs-examples/tree/master/acs-get-alfresco-hostname>