# S3 Multipart Upload Template - Node.js

This template consists of the infrastructure and code needed for a basic multipart upload solution
to an AWS S3 bucket.

After you create a project from this template, use the Altostra designer to modify it to your needs.

## Before you begin

### 1. Create a free Altostra account
To create an account, simply login to the [Altostra Web Console](https://app.altostra.com).

### 2. Install the Altostra CLI
```sh
# make sure you have Node.js 10 or above installed
$ npm install -g @altostra/cli
```

### 3. Connect an a AWS account
Go to the [Cloud Integrations](https://app.altostra.com/team/settings/integrations/cloud) page in 
the Web Console to connect your account.

> If you don't wish to connect your account just yet, you can deploy to the [Playground](https://docs.altostra.com/reference/concepts/playground-environment.html) environment that simulates the cloud without creating actual resources.

## Using the template

You have several options to get started with this template:
* Initialize a new project from the Altostra CLI and specify the template:

```sh
$ alto new my-project --template s3-multipart-upload-nodejs
$ cd my-project
$ npm install
```

* Create a new project in the [Altostra Web Console](https://app.altostra.com/projects). Select the `s3-multipart-upload-nodejs` template from the list in the Create Project dialog.

* Apply the template to an existing Altostra project in Visual Studio Code. Go to the Altostra 
view in the sidebar and clic on `s3-multipart-upload-nodejs` in the templates list.

## Deploying the project

Make sure you are logged in the Altostra CLI:
```sh
$ alto login
```

>The deployment process is simple and involves a few commands.
>For more information on each command refer to the [Altostra CLI documentation](https://docs.altostra.com/reference/CLI/altostra-cli.html).

Deploy a new instance of the project:
```sh
# install the production dependencies only
$ npm ci --production
$ alto deploy dev-instance --push --env
```

> The `--push` option will auto-create an [image](https://docs.altostra.com/howto/projects/deploy-project.html#create-a-project-image) and the `--env` option will prompt you to select
> an environment from a list, this will save you some time and commands. For more advanced use cases
> refer to the Altostra CLI [Altostra CLI documentation](https://docs.altostra.com/reference/CLI/altostra-cli.html).

## View the deployment status and details
To see the deployment status you have few options:

#### Using the Altostra CLI:
```sh
# lists the instances for the current project
$ alto instances

# shows details for the "dev-instance" instance
$ alto instances get dev-instance
```

#### Using the Web Console:
```sh
# opens the Web Console for the current project where you can see
# all its instances
$ alto console
```

## Modifying the project
After you create the project you can modify it using the Altostra extension for Visual Studio Code. The extension is available on the [Visual Studio marketplace](https://marketplace.visualstudio.com/items?itemName=Altostra.altostra).

To install the extension, search for _Altostra_ in the _Extensions_ view in Visual Studio Code.

Alternatively, you can also install the extension from the terminal:

```sh
$ code --install-extension Altostra.altostra
```

> The extension adds an Altostra view to the sidebar. It also adds the Altostra visual editor that allows you to visually design the project infrastructure.

## Template content

### Source files
The Lambda specific source files are located in the `functions` directory.

The core logic source files are located in the `src` directory.

The integration tests are located in the `tests` directory.

## Contact
Submit issues and pull requests directly to this repository. You contribution is appreciated.

If you need further assistance, have questions or suggestions, you can reach us at [support@altostra.com](mailto:support@altostra.com).