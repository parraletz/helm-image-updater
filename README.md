# helm-image-updater

CLI to update the image repository and/or tag in Helm Chart `values.yaml` files, as well as the `appVersion` in `Chart.yaml` files.

## Installation

1. Clone this repository and enter the folder:
   ```sh
   git clone https://github.com/parraletz/helm-image-updater
   cd helm-image-updater
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Build the project:
   ```sh
   npm run build
   ```
4. (Optional) Install globally:
   ```sh
   npm link
   ```

## Usage

You can run the CLI with:

```sh
npx tsx src/index.ts <command> [options]
# or if installed globally
helm-image-updater <command> [options]
```

### Main Commands

#### `image`

Update the image tag and/or repository in a `values.yaml` file.

Options:

- `-f, --file <path>`: Path to the `values.yaml` file (required)
- `-v, --version <version>`: New image tag
- `-r, --repository <repository>`: New image repository
- `-c, --chart <chart>`: Subchart name (optional)

Example:

```sh
helm-image-updater image -f values.yaml -v 1.2.3
```

#### `tag`

Update only the image tag in a `values.yaml` file.

Options:

- `-f, --file <path>`: Path to the `values.yaml` file (required)
- `-v, --version <version>`: New tag (required)
- `-c, --chart <chart>`: Subchart name (optional)

Example:

```sh
helm-image-updater tag -f values.yaml -v 2.0.0
```

#### `repository`

Update only the image repository in a `values.yaml` file.

Options:

- `-f, --file <path>`: Path to the `values.yaml` file (required)
- `-r, --repository <repository>`: New repository (required)
- `-c, --chart <chart>`: Subchart name (optional)

Example:

```sh
helm-image-updater repository -f values.yaml -r myrepo/app
```

#### `chart`

Update the `appVersion` field in a `Chart.yaml` file.

Options:

- `-f, --file <path>`: Path to the `Chart.yaml` file (required)
- `-v, --version <version>`: New app version (required)

Example:

```sh
helm-image-updater chart -f Chart.yaml -v 1.2.3
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for more information.

## Security

See [SECURITY.md](SECURITY.md) for how to report vulnerabilities.
