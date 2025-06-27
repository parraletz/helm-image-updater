import { promises as fs } from 'fs'
import * as path from 'path'
import { fileLoader, fileSaver } from '../src/index'

describe('fileLoader and fileSaver', () => {
  const testFile = path.join(__dirname, 'test-values.yaml')
  const testData = {
    image: {
      repository: 'repo/test',
      tag: '1.0.0'
    }
  }

  afterEach(async () => {
    try {
      await fs.unlink(testFile)
    } catch {
      // ignore
    }
  })

  it('should save and load YAML data correctly', async () => {
    await fileSaver(testFile, testData)
    const loaded = await fileLoader<typeof testData>(testFile)
    expect(loaded).toEqual(testData)
  })

  it('should throw if file does not exist', async () => {
    await expect(fileLoader('nonexistent.yaml')).rejects.toBeDefined()
  })
})
