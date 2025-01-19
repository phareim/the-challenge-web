import sharp from 'sharp'
import { promises as fs } from 'fs'
import path from 'path'

const sizes = [72, 96, 128, 144, 152, 192, 384, 512]
const inputFile = 'public/icons/icon.svg'
const outputDir = 'public/icons'

async function generateIcons() {
  try {
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true })

    // Generate each size
    await Promise.all(sizes.map(async (size) => {
      const outputFile = path.join(outputDir, `icon-${size}x${size}.png`)
      await sharp(inputFile)
        .resize(size, size)
        .png()
        .toFile(outputFile)
      console.log(`Generated ${outputFile}`)
    }))

    console.log('All icons generated successfully!')
  } catch (error) {
    console.error('Error generating icons:', error)
    process.exit(1)
  }
}

generateIcons() 