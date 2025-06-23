#!/usr/bin/env node

import { Command } from "commander"
import { constants as fsConstants } from "fs"
import * as fs from "fs/promises"
import * as yaml from "js-yaml"

interface ImageValues {
  image: {
    repository: string
    tag: string
  }
  [key: string]: any
}

interface ChartFile {
  appVersion: string
  [key: string]: any
}

const program = new Command()

program
  .name("helm-image-updater")
  .description("CLI to update image repository/tag in Helm values files")

const fileLoader = async <T>(filepath: string): Promise<T> => {
  try {
    await fs.access(filepath, fsConstants.R_OK | fsConstants.W_OK)
    const fileContents = await fs.readFile(filepath, "utf8")
    return yaml.load(fileContents) as T
  } catch (error: any) {
    if (error.code === "ENOENT") {
      console.error(`Error: The file "${filepath}" does not exist.`)
    } else if (error.code === "EACCES") {
      console.error(
        `Error: Permission denied to read/write the file "${filepath}".`
      )
    } else {
      console.error(
        `An unexpected error occurred while loading the file: ${error.message}`
      )
    }
    process.exit(1)
  }
}

const fileSaver = async (filepath: string, data: any): Promise<void> => {
  try {
    const yamlString = yaml.dump(data)
    await fs.writeFile(filepath, yamlString, "utf8")
  } catch (error: any) {
    console.error(
      `An unexpected error occurred while saving the file: ${error.message}`
    )
    process.exit(1)
  }
}

program
  .command("image")
  .description("Update image version and/or repository in a values.yaml file")
  .requiredOption("-f, --file <path>", "Path to the values.yaml file")
  .option("-v, --version <version>", "New version to set in values.yaml")
  .option(
    "-r, --repository <repository>",
    "New repository to set in values.yaml"
  )
  .option(
    "-c, --chart <chart>",
    "Chart to update in the values file (for subcharts)"
  )
  .action(async (options) => {
    const { file, version, repository, chart } = options

    if (!version && !repository) {
      console.error("Should set a value for version or/and repository")
      return
    }

    const valuesFile = await fileLoader<ImageValues>(file)
    let updated = false

    const target = chart ? valuesFile[chart] : valuesFile

    if (!target || !target.image) {
      console.error(
        `Error: Cannot find 'image' section for chart "${chart || "root"}".`
      )
      return
    }

    if (version) {
      if (version !== target.image.tag) {
        target.image.tag = version
        console.log(
          `Version ${version} has been set successfully${
            chart ? ` in the chart ${chart}` : ""
          }.`
        )
        updated = true
      } else {
        console.log(
          `New version ${version} is the same as the one in the values.yaml.`
        )
      }
    }

    if (repository) {
      if (repository !== target.image.repository) {
        target.image.repository = repository
        console.log(
          `Repository ${repository} has been set successfully${
            chart ? ` in the chart ${chart}` : ""
          }.`
        )
        updated = true
      } else {
        console.log(
          `New repository ${repository} is the same as the one in the values.yaml.`
        )
      }
    }

    if (updated) {
      await fileSaver(file, valuesFile)
    }
  })

program
  .command("tag")
  .description("Update image tag in a values.yaml file")
  .requiredOption("-f, --file <path>", "Path to the values.yaml file")
  .requiredOption(
    "-v, --version <version>",
    "New version to set in values.yaml"
  )
  .option(
    "-c, --chart <chart>",
    "Chart to update in the values file (for subcharts)"
  )
  .action(async (options) => {
    const { file, version, chart } = options
    const valuesFile = await fileLoader<ImageValues>(file)
    const target = chart ? valuesFile[chart] : valuesFile

    if (!target || !target.image) {
      console.error(
        `Error: Cannot find 'image' section for chart "${chart || "root"}".`
      )
      return
    }

    if (version !== target.image.tag) {
      target.image.tag = version
      await fileSaver(file, valuesFile)
      console.log(
        `Version ${version} has been set successfully${
          chart ? ` in the chart ${chart}` : ""
        }.`
      )
    } else {
      console.log(
        `New version ${version} is the same as the one in the values.yaml.`
      )
    }
  })

program
  .command("repository")
  .description("Update image repository in a values.yaml file")
  .requiredOption("-f, --file <path>", "Path to the values.yaml file")
  .requiredOption(
    "-r, --repository <repository>",
    "New repository to set in values.yaml"
  )
  .option(
    "-c, --chart <chart>",
    "Chart to update in the values file (for subcharts)"
  )
  .action(async (options) => {
    const { file, repository, chart } = options
    const valuesFile = await fileLoader<ImageValues>(file)
    const target = chart ? valuesFile[chart] : valuesFile

    if (!target || !target.image) {
      console.error(
        `Error: Cannot find 'image' section for chart "${chart || "root"}".`
      )
      return
    }

    if (repository !== target.image.repository) {
      target.image.repository = repository
      await fileSaver(file, valuesFile)
      console.log(
        `Repository ${repository} has been set successfully${
          chart ? ` in the chart ${chart}` : ""
        }.`
      )
    } else {
      console.log(
        `New repository ${repository} is the same as the one in the values.yaml.`
      )
    }
  })

program
  .command("chart")
  .description("Update appVersion in a Chart.yaml file")
  .requiredOption("-f, --file <path>", "Path to the Chart.yaml file")
  .requiredOption("-v, --version <version>", "New appVersion to set")
  .action(async (options) => {
    const { file, version } = options
    const chartFile = await fileLoader<ChartFile>(file)

    if (!chartFile.appVersion) {
      console.error(
        `Error: The file ${file} does not seem to be a valid Chart.yaml (missing 'appVersion').`
      )
      return
    }

    if (version !== chartFile.appVersion) {
      chartFile.appVersion = version
      await fileSaver(file, chartFile)
      console.log(`appVersion ${version} has been set successfully in ${file}.`)
    } else {
      console.log(
        `New appVersion ${version} is the same as the one in the chart file.`
      )
    }
  })

program.parse(process.argv)
