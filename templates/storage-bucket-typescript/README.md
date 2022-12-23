# Cloud Toolkit Bucket template

## The Gist

This is a template for the Cloud Toolkit Bucket component. Here you can find a provisional configuration to start your own Bucket instance. 


## Architecture

A Bucket is an object storage service which provides security, availability and scalability for you data. One of the benefits of a Bucket is its configuration flexibility. For instance, to access a Bucket, it can be as simple as assigning our predefined read-only and write policies or creating custom IAM policies.

With this component you can also:

- Enable Bucket encryption to protect your sensitive data.
- Replicate Bucket data to another one to ensure data availability.
- Keep track of the versioning of your files.
- Enforce Bucket data visibility to be protected against data leakages.

![](assets/Component%20Architecture%20-%20Bucket.svg)


## Usage

### Applying the stack

The stack can be applied like every other Pulumi project.

```bash
pulumi up
``` 

Check the Stack Tree. It should look like the following:

```
    Type                                                    Name                                    Status      
 +   pulumi:pulumi:Stack                                     test                                    created     
 +   └─ cloudToolkit:aws:storage:Bucket                      cloud-toolkit-bucket                    created     
 +      ├─ aws:iam:Role                                      cloud-toolkit-bucket-bucketRole         created     
 +      ├─ aws:s3:BucketV2                                   cloud-toolkit-bucket                    created     
 +      ├─ aws:s3:BucketPolicy                               cloud-toolkit-bucket                    created     
 +      ├─ aws:s3:BucketServerSideEncryptionConfigurationV2  cloud-toolkit-bucket-encryption         created     
 +      ├─ aws:iam:Policy                                    cloud-toolkit-bucket-read               created     
 +      ├─ aws:iam:Policy                                    cloud-toolkit-bucket-write              created     
 +      ├─ aws:s3:BucketOwnershipControls                    cloud-toolkit-bucket-bucketOwnership    created     
 +      ├─ aws:s3:BucketVersioningV2                         cloud-toolkit-bucket-bucketVersioning   created     
 +      └─ aws:s3:BucketPublicAccessBlock                    cloud-toolkit-bucket-publicAccessBlock  created   
```

### Testing

Once the infraestructure is up and running, you can find it on the AWS console. Additionally, there is a view where you can upload and download files on the Bucket to test that everything works as defined. You can access it on **Amazon S3 -> Buckets -> Your Bucket**.

## Troubleshooting

If you find any problem, you can open an issue in the Cloud Toolkit AWS Templates repository.
