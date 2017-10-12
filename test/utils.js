const MESSAGE_SEPERATOR = String.fromCharCode(30) // ASCII Record Seperator 1E
const MESSAGE_PART_SEPERATOR = String.fromCharCode(31) // ASCII Unit Separator 1F

exports.msg = function () {
  const args = Array.from(arguments)
  const result = []
  let i

  for (i = 0; i < args.length; i++) {
    result.push(args[i]
      .replace(/\|/g, MESSAGE_PART_SEPERATOR)
      .replace(/\+/g, MESSAGE_SEPERATOR)
    )
  }

  return result.join(MESSAGE_SEPERATOR)
}
