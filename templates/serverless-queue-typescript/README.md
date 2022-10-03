# Cloud Toolkit Email Sender template

## The Gist

This is a template for the Cloud Toolkit Queue component. Here you can find a provisional configuration to start your own Queue instance. 

Here you will learn about the base structure of both the code and YAML configuration for this component.

## Architecture

Cloud Toolkit Queue component allows for either FIFO or standard queues. Standard Queues do not guarantee order, they try to, but it is not strict. FIFO queues **do** guarantee the order and **exactly** once delivery. This means that the message throughput is usually going to be lower than that of a standard queue. Compatibility with FIFO queues in other AWS products is also not guaranteed for all of them. If this is your first Queue, it is most likely that you will want a standard Queue.

All the Queues are given by default a Dead Letter Queue. Dead Letters receive messages that have been rejected by the receiver of the message. There could be multiple reasons as to why that happens. It might be a bug on the code, an incorrectly formatted message, a timeout in the processing or any other unforeseen circumstance. It is highly likely you want to avoid "lost" messages or undetected bugs in your system. Keep in mind that a Dead Letter Queue might increase your billing, so depending on your case you can deactivate it.

![](assets/Component%20Architecture%20-%20Queue.svg)


## Usage

### Applying the stack

The stack can be applied like every other Pulumi project.

```bash
pulumi up
``` 

Check the Stack Tree. It should look like the following:

```
    Type                                 Name                 Plan       
+   pulumi:pulumi:Stack                   Queue-test-dev      create     
+   └─ cloudToolkit:aws:serverless:queue  queueName           create     
+      └─ aws:sqs:Queue                   queueName-standard  create     
```

### Testing

Once the Queue is created, you can find it on the AWS console. There is a view to test sending and polling messages to test that everything works as defined. You can access it on **Amazon SQS -> Queues -> Your Queue**.



## Troubleshooting

If you find any problem, you can open an issue in the Cloud Toolkit AWS Templates repository.
