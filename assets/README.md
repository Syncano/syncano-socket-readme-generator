# aws-face-auth

`version:` **0.0.2**

User face authentication socket with aws rekognition. For basic authentication use 'rest-auth' socket

To install, run:

```
syncano-cli add aws-face-auth
```

## Config

| Name | Required | Description | Info
| ---- | -------- | ----------- | ----
| AWS_REGION | true | AWS region | 
| AWS_SECRET_ACCESS_KEY | true | AWS secret access key | Visit link to know more about managing keys (http://docs.aws.amazon.com/general/latest/gr/managing-aws-access-keys.html). 
| AWS_ACCESS_KEY_ID | true | AWS access key id | Visit link to know more about managing keys (http://docs.aws.amazon.com/general/latest/gr/managing-aws-access-keys.html). 
| FACE_MATCH_THRESHOLD | true |  | Specifies the minimum confidence in the face match to return. Minimum value of 0 and Maximum value of 100.

## Classes

### `user` schema

| Name | Type | Filtering | Ordering
| ---- | ---- | --------- | --------
| face_auth | boolean | true | false
| external_image_id | string | true | false

### `other-class` schema

| Name | Type | Filtering | Ordering
| ---- | ---- | --------- | --------
| some_name | string | false | false

## Endpoints

### create-collection

Creates a collection in an AWS Region

#### Parameters

| name | type | description | example
| ---- | ---- | ----------- | -------
| collectionId | string | ID for the collection that you are creating | SyncanoFaces



#### Response

mimetype: `application/json`

##### Success `200`

```
{
  "collectionArn": "12345",
  "statusCode": 200
}
```

##### Failed `400`

```
{
  "statusCode": 400,
  "code": "ResourceAlreadyExistsException",
  "message":"A collection with the specified ID already exists."
}
```

### delete-collection

Deletes a collection in an AWS Region

#### Parameters

| name | type | description | example
| ---- | ---- | ----------- | -------
| collectionId | string | ID of the collection to delete | SyncanoFaces



#### Response

mimetype: `application/json`

##### Success `200`

```
{
"statusCode": 200
}
```

##### Failed `400`

```
{
  "statusCode": 400,
  "code": "AccessDeniedException",
  "message":"You are not authorized to perform the action."
}
```

### face-register

Register face to existing user account for face authentication.

#### Parameters

| name | type | description | example
| ---- | ---- | ----------- | -------
| username | string | User email | you@domain.com
| password | string | User password | 
| collectionId | string | ID of the collection | SyncanoFaces
| image | string | Path to image or an S3 object key | 
| bucketName | string | Name of s3 bucket. Leave empty if image not on s3 bucket. | 



#### Response

mimetype: `application/json`

##### Success `200`

```
{
  message: "User face registered for face authentication."
}
```

##### Failed `400`

```
{
  message: "Fail to register face."
}
```

### face-login

Login to a user account using face image

#### Parameters

| name | type | description | example
| ---- | ---- | ----------- | -------
| collectionId | string | ID of the collection | SyncanoFaces
| image | string | Path to image or an S3 object key | 
| bucketName | string | Name of s3 bucket. Leave empty if image not on s3 bucket. | 



#### Response

mimetype: `application/json`

##### Success `200`

```
{
  token: "cb21ff98ac8c7dda8fcd01",
  username: "you@domain.com"
}
```

##### Failed `400`

```
{
  message: "Authentication fail."
}
```

### remove-face-auth

Remove face authentication for particular user

#### Parameters

| name | type | description | example
| ---- | ---- | ----------- | -------
| username | string | Username of user | you@domain.com
| token | string | User token | cb21fac8c7dda8fcd0129b0adb0254dea5c8e
| collectionId | string | ID of the collection | SyncanoFaces
| image | string | Path to image or an S3 object key | 
| bucketName | string | Name of s3 bucket. Leave empty if image not on s3 bucket. | 



#### Response

mimetype: `application/json`

##### Success `200`

```
{
  message: "User account removed from face authentication."
}
```

##### Failed `400`

```
{
  message: "Face authentication not enabled for user account."
}
```

### verify-face-auth

Checks if user face authentication is enabled

#### Parameters

| name | type | description | example
| ---- | ---- | ----------- | -------
| username | string | Username of user | you@domain.com
| token | string | User token | cb21fac8c7dda8fcd0129b0adb0254dea5c8e



#### Response

mimetype: `application/json`

##### Success `200`

```
{
  message: "Face auth enabled on user account.",
  is_face_auth: true
}
```

##### Failed `200`

```
{
  message: "Face auth not enabled on user account.",
  is_face_auth: false
}
```
