const { createCanvas } = require("canvas")
const GIFEncoder = require("gif-encoder-2")

module.exports = async (req, res) => {
  try {
    const { text = "brat", gif } = req.query

    // Determine if we should generate GIF or JPG
    const isGif = gif === "true"

    // Canvas setup
    const width = 800
    const height = 400
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext("2d")

    const backgroundColor = "#FFFFFF" // White background
    const textColor = "#000000" // Black text

    if (isGif) {
      // Generate animated GIF with typing effect
      const encoder = new GIFEncoder(width, height, "neuquant", true)
      encoder.start()
      encoder.setRepeat(0) // Loop forever
      encoder.setDelay(150) // 150ms between frames
      encoder.setQuality(10)

      const frames = text.length + 5 // Extra frames to show complete text

      for (let frame = 0; frame <= frames; frame++) {
        // Clear canvas
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, width, height)

        // Set text properties
        ctx.fillStyle = textColor
        ctx.font = "bold 48px Arial, sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"

        // Calculate text to show (typing effect)
        const currentText = frame <= text.length ? text.substring(0, frame) : text

        // Add blinking cursor for typing effect
        const displayText = frame <= text.length ? currentText + "|" : currentText

        // Draw text
        ctx.fillText(displayText, width / 2, height / 2)

        // Add frame to GIF
        encoder.addFrame(ctx)
      }

      encoder.finish()
      const buffer = encoder.out.getData()

      res.setHeader("Content-Type", "image/gif")
      res.setHeader("Cache-Control", "public, max-age=31536000")
      res.send(buffer)
    } else {
      // Generate static JPG
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, width, height)

      // Set text properties
      ctx.fillStyle = textColor
      ctx.font = "bold 48px Arial, sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      // Draw text
      ctx.fillText(text, width / 2, height / 2)

      // Convert to JPEG
      const buffer = canvas.toBuffer("image/jpeg", { quality: 0.9 })

      res.setHeader("Content-Type", "image/jpeg")
      res.setHeader("Cache-Control", "public, max-age=31536000")
      res.send(buffer)
    }
  } catch (error) {
    console.error("Error generating image:", error)
    res.status(500).json({ error: "Failed to generate image" })
  }
}
