function isSameFile(leftFile: File, rightFile: File) {
  return (
    leftFile.name === rightFile.name &&
    leftFile.size === rightFile.size &&
    leftFile.type === rightFile.type &&
    leftFile.lastModified === rightFile.lastModified
  )
}

function mergeSelectedFiles(currentFiles: File[], incomingFiles: File[]) {
  const nextFiles = [...currentFiles]

  for (const incomingFile of incomingFiles) {
    if (!nextFiles.some((currentFile) => isSameFile(currentFile, incomingFile))) {
      nextFiles.push(incomingFile)
    }
  }

  return nextFiles
}

export { mergeSelectedFiles }
